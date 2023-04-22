// This script will find and delete all assets that are not
// referenced (in use) by other documents. Sometimes refered
// to as "orphaned" assets.

// `sanity exec scripts/deleteUnusedAssets.js --with-user-token`

/* eslint-disable no-console */
import { getCliClient } from "sanity/cli"

// Gets the client configuration from `sanity.cli.ts` and returns a client.
// Will include write token when run with `sanity exec --with-user-token`
const client = getCliClient()

const query = `
	*[ _type in ["sanity.imageAsset", "sanity.fileAsset"] ]
	{_id, "refs": count(*[ references(^._id) ])}
	[ refs == 0 ]
	._id
`

client
	.fetch(query)
	.then(ids => {
		if (!ids.length) {
			console.log("No assets to delete")
			return true
		}

		console.log(`Deleting ${ids.length} assets`)
		return ids
			.reduce((trx, id) => trx.delete(id), client.transaction())
			.commit()
			.then(() => console.log("Done!"))
	})
	.catch(err => {
		if (err.message.includes("Insufficient permissions")) {
			console.error(err.message)
			console.error("Did you forget to pass `--with-user-token`?")
		} else {
			console.error(err.stack)
		}
	})