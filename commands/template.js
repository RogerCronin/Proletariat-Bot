const banner = require("banner-framework")

module.exports = new banner.Command({
  adminOnly: false, // only admins can see and use if set to true
  permissions: "", // PermissionResolvable or falsy value if no perms needed
  serverSpecific: false, // if command is server specific, array of valid server IDs
  //enableDM: true,
  aliases: [], // array of aliases for the command
  // everything above this is optional
	name: "help", // name of the command
	title: "help <arg1> [string..]", // name of the command + how to use
	description: "Description of your command.", // description of command
	category: "category1", // category of command (for help command)
	execute: function(message, args) { // function that is run when command runs

	},
	checkSyntax: function(message, args) { // function that tests if your args work

  }
})
