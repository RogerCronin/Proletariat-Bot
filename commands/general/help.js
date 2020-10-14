const banner = require("banner-framework")

const categoryNames = {
  general: "**__General__**",
  fun: "**__Fun__**",
  admin: "**__Admin__**"
}

module.exports = new banner.Command({
  aliases: ["commands"],
	name: "help",
	title: "help [command name opt.]",
	description: "DMs you a list of the commands.",
	category: "general",
	execute: function(message, args) {
    if(args[1]) {
      let string = fetchCommand(args[1], message, bot.checkAdmin(message.author.id), bot.commands.aliases[args[1]])
      message.author.send(string, { split: true })
        .then(() => {
          if(message.channel.type == "text") message.channel.send("Gotcha :point_right::sunglasses::point_right:")
        })
        .catch(() => message.channel.send(this.errorMessage("error", "I can't send DMs to you, check the server privacy settings.", "help:0")))
      return
    }
    // remember to update for every change to the bot, add a space before the bullet point
		/* paste readme.md patch notes here

		## Patch Notes (Update 2020-09-03)
		 * Added p!download

		*/
		// ensure there is a blank line bewteen the end of patch notes and ${bot.client.user.username} stuff
    let string = `**Patch Notes (Update 2020-10-13)**
 • Updated to version 5.0!
 • Ported to my brand new discord.js bot framework

${bot.client.user.username} commands:\n\n` // start of help message

    let categories = {}
    let isAdmin = bot.checkAdmin(message.author.id)
    for(command in bot.commands.list) {
      if(!categories[bot.commands.list[command].category]) {
        let commandString = fetchCommand(command, message, isAdmin, false)
        if(commandString) categories[bot.commands.list[command].category] = commandString ? commandString : false
      } else {
        let commandString = fetchCommand(command, message, isAdmin, false)
        if(commandString) categories[bot.commands.list[command].category] += commandString ? commandString : false
      }
    }
    for(category in categories) {
      string += `${categoryNames[category]}\n\n${categories[category]}\n`
    }
    message.author.send(string, { split: true })
      .then(() => {
        if(message.channel.type == "text") message.channel.send(`Quick, somebody! ${message.author.username} needs help!`)
      })
      .catch(() => message.channel.send(this.errorMessage("error", "I can't send DMs to you, check the server privacy settings.", "help:1")))
	},
	checkSyntax: function(message, args) {
    if(!args[1]) return true
    if(args[2]) return "More arguments than expected."
    if(Object.keys(bot.commands.list).includes(args[1]) || Object.keys(bot.commands.aliases).includes(args[1])) {
      return true
    } else {
      return "Invalid command name."
    }
    return "More arguments than expected."
  }
})

function fetchCommand(command, message, isAdmin, alias) {
  if(alias) command = bot.commands.aliases[command].name
  command = bot.commands.list[command]
  if(!isAdmin) { // shit shit shit fucking fuck goddamnit horse shit code
    if(command.adminOnly) return
    if(command.serverSpecific) {
      if(message.channel.type != "text") return
      if(!command.serverSpecific.includes(message.channel.guild.id)) return
    }
  }
  let string = `\`${bot.prefix}${command.title}\` - ${command.description}`
  if(command.aliases.length) string += ` *(Aliases \`${command.aliases.toString().replace(/,/g, "`, `")}\`)*`
  if(command.permissions) string += ` *(Requires ${command.permissions.toString().replace(/,/g, ", ")})*` // add permission requirements
  if(command.adminOnly && isAdmin) string += " *(Admin Command)*"
  string += "\n"
  return string
}
