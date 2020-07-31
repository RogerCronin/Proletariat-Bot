module.exports = {
	adminOnly: false,
	permissions: "",
	serverSpecific: false,
	enableDM: true,
	name: "help",
	title: "help",
	description: "DMs you a list of the commands",
	execute: async (message, args) => {
		const commands = bot.commands.nested // list of commands with category nesting
		// remember to update for every change to the bot, add a space before the bullet point
		/* paste readme.md patch notes here

		## Patch Notes (Update 2020-07-31)
		 * Rewrote all node-fetch code to use async/await
		 * Rewrote p!translate and p!uwuify
		 * Added p!gulag: people in the gulag can't use bot commands
		 * Added rudimentary database support for p!gulag
		 * Changed the category p!echo is filed under

		*/
		var string = `**Patch Notes (Update 2020-07-31)**
 • Rewrote all node-fetch code to use async/await
 • Rewrote p!translate and p!uwuify
 • Added p!gulag: people in the gulag can't use bot commands
 • Added rudimentary database support for p!gulag
 • Changed the category p!echo is filed under

${bot.client.user.username} commands:\n\n` // start of help message

		if(bot.useCategories) { // use categories
			for(category in commands) {
				string += `${categoryFormat(category)}\n\n` // add category name
				for(command in commands[category]) { // add each command in the category
					string = fetchCommand(command, string, message)
				}
				string += "\n" // add new line inbetween categories
			}
		} else { // don't use categories
			for(command in bot.commands.flat) { // add each command
				string = fetchCommand(command, string, message)
			}
		}

		message.author.send(string, { split: true })
			.then(() => { if(message.channel.type != "dm") message.channel.send(`Quick, somebody! ${message.author.username} needs help!`) })
			.catch(() => { message.channel.send("I can't send DMs to you, check the server privacy settings.") })

		/* REST IN PEACE my favorite piece of code that I've ever written. took me an hour and a half to write those 7 lines ;(

		// send the message in several of them cause it's probably going to be over 2000 characters in length
		let messages = bot.splitLongMessage(string, 2000, "\n").map(e => { // array of message.author.send()'s
			return message.author.send(e)
		})
		Promise.all(messages) // executes all of them
			.then(() => { if(message.channel.type != "dm") message.channel.send("Help is on the way. Check your DMs!") }) // if all are successful, this line is run
			.catch(() => message.channel.send("I can't send DMs to you, check the server privacy settings.")) // if one fails, this line is run

		*/
	},
	checkSyntax: (message, args) => args[1] ? "More arguments than expected" : true
}

const categories = {
	general: "**__General__**",
	fun: "**__Fun__**"
}

function categoryFormat(category) {
	return categories[category]
}

function fetchCommand(command, string, message) {
	if(bot.commands.flat[command].adminOnly && !bot.checkAdmin(message.author.id)) return string // skips admin commands if you aren't an admin
	if(bot.commands.flat[command].serverSpecific) { // skips server specific commands if you aren't in approved server
		if(!bot.checkAdmin(message.author.id)) {
			if(message.channel.type != "text") return string
			if(!bot.commands.flat[command].serverSpecific.includes(message.channel.guild.id)) return string
		}
	}
	string += `\`${bot.prefix}${bot.commands.flat[command].title}\` - ${bot.commands.flat[command].description}` // adds command
	if(bot.commands.flat[command].permissions) string += ` *(Requires ${bot.commands.flat[command].permissions.toString().replace(/,/g, ", ")})*` // add permission requirements
	if(bot.commands.flat[command].adminOnly && bot.checkAdmin(message.author.id)) string += " *(Admin Command)*" // add admin command notice
	string += "\n"
	return string
}
