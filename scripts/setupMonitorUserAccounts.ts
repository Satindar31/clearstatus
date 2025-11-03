import prisma from "@/prisma/prisma";
import "dotenv/config";

// Check if user accounts have already been set up
console.log(process.env.HETRIXTOOLS_USER_ID);
if (
	process.env.HETRIXTOOLS_USER_ID ||
	process.env.STATUSPAGEIO_USER_ID ||
	process.env.UPDOWN_USER_ID ||
	process.env.STATUSCAKE_USER_ID ||
	process.env.PINGDOM_USER_ID ||
	process.env.CHECKLY_USER_ID
) {
	console.log("User accounts have already been set up. Ignoring setup.");
} else {
	console.log("Setting up user accounts...");
	console.time("Setup Duration");
	prisma.user
		.createMany({
			data: [
				{
					name: "HetrixTools",
					email: "user@hetrixtools.com",
					id: "hettrixtools-user-id",
				},
				{
					name: "Statuspage.io",
					email: "user@statuspage.io",
					id: "statuspageio-user-id",
				},
				{
					name: "Updown.io",
					email: "user@updown.io",
					id: "updown-user-id",
				},
				{
					name: "StatusCake",
					email: "user@statuscake.com",
					id: "statuscake-user-id",
				},
				{
					name: "Pingdom",
					email: "user@pingdom.com",
					id: "pingdom-user-id",
				},
				{
					name: "Checkly",
					email: "user@checkly.com",
					id: "checkly-user-id",
				},
			],
		})
		.then(() => {
			console.log("User accounts have been set up successfully.");

			// Push the user ids to the .env file for future reference
			console.log("Adding user IDs to .env file...");
			const fs = require("fs");
			const envFilePath = ".env";
			const envVarsToAdd = [
				`HETRIXTOOLS_USER_ID=hettrixtools-user-id`,
				`STATUSPAGEIO_USER_ID=statuspageio-user-id`,
				`UPDOWN_USER_ID=updown-user-id`,
				`STATUSCAKE_USER_ID=statuscake-user-id`,
				`PINGDOM_USER_ID=pingdom-user-id`,
				`CHECKLY_USER_ID=checkly-user-id`,
			];
			fs.appendFileSync(envFilePath, "\n" + envVarsToAdd.join("\n") + "\n");
			console.log("User IDs have been added to the .env file.");
			console.timeEnd("Setup Duration");
		});
}
