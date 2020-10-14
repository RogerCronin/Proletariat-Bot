const banner = require("banner-framework")

module.exports = new banner.Command({
  adminOnly: true,
  enableDM: false,
	name: "echo",
	title: "echo [text..]",
	description: "Echos whatever you send back into chat.",
	category: "admin",
	execute: function(message, args) {
    args.shift()
		message.delete()
		message.channel.send(bot.messageReconstruct(args))
	},
	checkSyntax: function(message, args) {
    if(!args[1]) return "No text provided."
		return true
  }
})
