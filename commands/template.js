module.exports = {
	adminOnly: false, // only admins can see and use if set to true
	permissions: "", // PermissionResolvable or falsy value if no perms needed
	serverSpecific: false, // if command is server specific, array of valid server IDs
	enableDM: true, // if command can be sent in DMs, true
	// make sure server specific and permissive commands aren't allowed in DMs
	name: "help", // name of the command
	aliases: [], // array of aliases for the command
	title: "help <arg1> [string..]", // name of the command + how to use
	description: "Description of your bot.", // description of command
	execute: (message, args) => { // function that is run when command runs

	},
	checkSyntax: (message, args) => { // function that tests if your args work

	}
}
