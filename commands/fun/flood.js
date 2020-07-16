module.exports = {
	adminOnly: false,
	permissions: "MANAGE_MESSAGES",
	serverSpecific: false,
	enableDM: false,
	name: "flood",
	title: "flood",
	description: "Floods the chat with an excerpt from the Communist Manifesto.",
	execute: (message, args) => {
		let flood = require("../../files/flood.json")
		for(i of flood) {
			message.channel.send(i)
		}
	},
	checkSyntax: (message, args) => args[1] ? "More arguments than expected." : true
}
