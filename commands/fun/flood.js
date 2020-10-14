const banner = require("banner-framework")

module.exports = new banner.Command({
  permissions: "MANAGE_MESSAGES",
	name: "flood",
	title: "flood",
	description: "Floods the chat with an excerpt from the Communist Manifesto.",
	category: "fun",
	execute: function(message, args) {
    message.channel.send(bot.manifesto, { split: "." })
	},
	checkSyntax: (message, args) => args[1] ? "More arguments than expected." : true
})
