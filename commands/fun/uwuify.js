module.exports = {
	adminOnly: false,
	permissions: "",
	serverSpecific: false,
	enableDM: true,
	name: "uwuify",
	title: "uwuify [text..]",
	description: "Uwuifies any text you give it.",
	execute: (message, args) => {
		args.shift()
		string = bot.messageReconstruct(args).trim()
		string = string.replace(/ow/g, "owo").replace(/uw/g, "uwu").replace(/(?:r|l)/g, "w").replace(/(?:R|L)/g, "W").replace(/The/g, "De").replace(/the/g, "de").replace(/Thi/g, "Di").replace(/thi/g, "di").replace(/Tha/g, "Da").replace(/tha/g, "da").replace(/n([aeiou])/g, "ny$1").replace(/N([aeiou])/g, "Ny$1").replace(/N([AEIOU])/g, "Ny$1").replace(/ove/g, "uv") // lol
		let embed = new bot.discord.MessageEmbed()
			.setColor(message.member.displayColor)
			.setAuthor(message.author.username, message.author.avatarURL())
			.setDescription(string + " uwu")
		message.channel.send(embed)
	},
	checkSyntax: (message, args) => {
		if(args[1]) return true
		return "No text provided."
	}
}
