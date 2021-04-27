const banner = require("banner-framework")

module.exports = new banner.Command({
  permissions: "MANAGE_GUILD",
  enableDM: false,
  aliases: ["eventsopt", "eventopt"],
	name: "events",
	title: "events <true/false>",
	description: "Allows or disallows events (haiku detection, Taylor Swift, etc.) for the server.",
	category: "general",
	execute: function(message, args) {
		if(args[1] == "true") { // don't want to test to see if I can make this normal
			bot.db.set(message.guild.id, true).write()
		} else {
			bot.db.set(message.guild.id, false).write()
		}
		message.react("✅")
	},
	checkSyntax: function(message, args) {
		if(args[2]) return "More arguments than expected."
		if(!args[1]) return "Must supply a true or false to opt."
		if(args[1] != "true" && args[1] != "false") return "Unrecognized opt option."
		return true
  }
})
