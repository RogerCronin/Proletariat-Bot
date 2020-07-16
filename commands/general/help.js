module.exports = {
	adminOnly: true,
	permissions: "",
	serverSpecific: false,
	enableDM: true,
	name: "help",
	title: "help",
	description: "DMs you a list of the commands",
	execute: async (message, args) => {
		var string = `${bot.client.user.username} commands:\n\n`
		let commands = bot.commands.nested
		for(category in commands) {
			string = `${categoryFormat(category)}\n\n`
			for(command in commands[category]) {
				if(bot.commands.flat[command].adminOnly && !bot.checkAdmin(message.author.id)) continue // skips admin commands if you aren't an admin
				if(bot.commands.flat[command].serverSpecific) { // skips server specific commands if you aren't in approved server
					if(!bot.checkAdmin(message.author.id)) {
						if(message.channel.type != "text") continue
						if(!bot.commands.flat[command].serverSpecific.includes(message.channel.guild.id)) continue
					}
				}
				string += `\`${bot.prefix}${bot.commands.flat[command].title}\` - ${bot.commands.flat[command].description}`
				if(bot.commands.flat[command].permissions) string += ` *(Requires ${bot.commands.flat[command].permissions.toString().replace(/,/g, ", ")})*`
				if(bot.commands.flat[command].adminOnly && bot.checkAdmin(message.author.id)) string += " *(Admin Command)*"
				string += "\n"
			}
			string += "⠀" // blank unicode character
			message.author.send(string)
				.catch(() => { return message.channel.send("I can't send DMs to you, check the server privacy settings.") })
			string = ""
		}
		if(message.channel.type != "dm") message.channel.send("Quick, somebody! " + message.author.username + " needs help!")
	},
	checkSyntax: (message, args) => args[1] ? "More arguments than expected" : true
}

let categories = {
	general: "**__General__**",
	fun: "**__Fun__**"
}

function categoryFormat(category) {
	return categories[category]
}
