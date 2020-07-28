module.exports = {
	adminOnly: false,
	permissions: "MANAGE_MESSAGES",
	serverSpecific: false,
	enableDM: false,
	name: "flood",
	title: "flood",
	description: "Floods the chat with an excerpt from the Communist Manifesto.",
	execute: async (message, args) => {
		message.channel.send(bot.manifesto, { split: "." })
	},
	checkSyntax: (message, args) => args[1] ? "More arguments than expected." : true
}
