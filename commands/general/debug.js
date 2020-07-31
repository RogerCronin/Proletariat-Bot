module.exports = {
	adminOnly: true, // only admins can see and use if set to true
	permissions: "", // PermissionResolvable or falsy value if no perms needed
	serverSpecific: false, // if command is server specific, array of valid server IDs
	enableDM: true, // if command can be sent in DMs, true
	// make sure server specific and permissive commands aren't allowed in DMs
	name: "debug", // name of the command
	title: "debug", // name of the command + how to use
	description: "Private command only available to bot admins.", // description of command
	execute: async (message, args) => { // function that is run when command runs
		
	},
	checkSyntax: (message, args) => true
}
