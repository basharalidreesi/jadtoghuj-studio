// sanity exec scripts/renameField.ts --with-user-token  

/* eslint-disable no-console */
import { getCliClient } from "sanity/cli"
import { Transaction } from "@sanity/client"

const type = ""
const renameFrom = ""
const renameTo = ""

type Doc = {
	_id: string
	_rev: string
	[renameFrom]: string
}

type DocPatch = {
	id: string
	patch: {
		set: {[renameTo]: string}
		unset: string[]
		ifRevisionID: string
	}
}

// Gets the client configuration from `sanity.cli.ts` and returns a client.
// Will include write token when run with `sanity exec --with-user-token`
const client = getCliClient()

// Fetch the documents we want to migrate, and return only the fields we need.
const fetchDocuments = () =>
	client.fetch(`*[_type == "${type}" && defined(${renameFrom})][0...100] {_id, _rev, ${renameFrom}}`)

// Build a patch for each document, represented as a tuple of `[documentId, patch]`
const buildPatches = (docs: Doc[]) =>
	docs.map(
		(doc: Doc): DocPatch => ({
			id: doc._id,
			patch: {
				set: {[renameTo]: doc[renameFrom]},
				unset: [`${renameFrom}`],
				// this will cause the migration to fail if any of the documents has been
				// modified since it was fetched.
				ifRevisionID: doc._rev,
			},
		})
	)

const createTransaction = (patches: DocPatch[]): Transaction =>
	patches.reduce(
		(tx: Transaction, patch: DocPatch) => tx.patch(patch.id, patch.patch),
		client.transaction()
	)

const commitTransaction = (tx: Transaction) => tx.commit()

const migrateNextBatch = async (): Promise<void> => {
	if (!type || !renameFrom || !renameTo) { return console.log("No params set") }
	const documents = await fetchDocuments()
	const patches = buildPatches(documents)
	if (patches.length === 0) {
		console.log("No more documents to migrate!")
		process.exit(1)
	}
	console.log(
		`Migrating batch:\n %s`,
		patches.map((patch) => `${patch.id} => ${JSON.stringify(patch.patch)}`).join("\n")
	)
	const transaction = createTransaction(patches)
	await commitTransaction(transaction)
	return migrateNextBatch()
}

migrateNextBatch().catch((err: any) => {
	console.error(err)
	process.exit(1)
})