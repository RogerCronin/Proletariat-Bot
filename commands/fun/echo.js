module.exports = {
	adminOnly: true,
	permissions: "",
	serverSpecific: false,
	enableDM: true,
	name: "echo",
	title: "echo [text..]",
	description: "Echos whatever you send back into chat.",
	execute: async (message, args) => {
		args.shift()
		await message.delete()
		message.channel.send(bot.messageReconstruct(args))
	},
	checkSyntax: (message, args) => {
		if(!args[1]) return "No text provided."
		return true
	}
}
