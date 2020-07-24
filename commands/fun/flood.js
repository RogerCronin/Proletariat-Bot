module.exports = {
	adminOnly: false,
	permissions: "MANAGE_MESSAGES",
	serverSpecific: false,
	enableDM: false,
	name: "flood",
	title: "flood",
	description: "Floods the chat with an excerpt from the Communist Manifesto.",
	execute: async (message, args) => {
		let messages = bot.splitLongMessage(bot.manifesto, 2000, ".")
		for(t of messages) {
			await message.channel.send(t)
		}
	},
	checkSyntax: (message, args) => args[1] ? "More arguments than expected." : true
}
