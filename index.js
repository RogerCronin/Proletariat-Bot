console.log("Starting...")

// TODO
// command aliases(?)
// test p!lunch when school starts
// fix p!weather / wait for weather.gov to fix their api
// optional prefix @bot

// npm libraries
require("dotenv").config()
const discord = require("discord.js")

// variables
const client = new discord.Client()
// list of commands
const commands = { // writing all of them out is necessary so there is a defined order for p!help
	nested: { // category cannot contain only admin commands, otherwise fucky help command format fixing required
		general: {
			help: require("./commands/general/help.js"),
			translate: require("./commands/general/translate.js"),
			server: require("./commands/general/server.js"),
			lunch: require("./commands/general/lunch.js"),
			weather: require("./commands/general/weather.js"),
			uptime: require("./commands/general/uptime.js"),
			link: require("./commands/general/link.js"),
			random: require("./commands/general/random.js"),
			timer: require("./commands/general/timer.js"),
			debug: require("./commands/general/debug.js")
		},
		fun: {
			generate: require("./commands/fun/generate.js"),
			duel: require("./commands/fun/duel.js"),
			flood: require("./commands/fun/flood.js"),
			uwuify: require("./commands/fun/uwuify.js"),
			dab: require("./commands/fun/dab.js"),
			bedwars: require("./commands/fun/bedwars.js"),
			reddit: require("./commands/fun/reddit.js"),
			nasa: require("./commands/fun/nasa.js"),
			echo: require("./commands/fun/echo.js")
		}
	},
	flat: {},
	aliases: {}
}
for(category in commands.nested) {
	for(commandName in commands.nested[category]) {
		command = commands.nested[category][commandName]
		// take the categories from commands.nested and add to commands.flat
		commands.flat[commandName] = command
		// add aliases to commands.aliases object
		if(command.aliases) for(alias of command.aliases) commands.aliases[alias] = command
	}
}
const events = {
	goodbot: require("./events/goodbot.js"),
	lyrics: require("./events/lyrics.js"),
	reddit: require("./events/reddit.js"),
	haiku: require("./events/haiku.js"),
	aita: require("./events/aita.js")
}

global.bot = require("./files/bot.js")(discord, client, commands) // initialize variable containing important data and functions

client.on("ready", () => {
	console.log("Ready to rumble")
	let activity = bot.activityMessage()
	client.user.setActivity(activity[0], { type: activity[1] })
	setInterval(() => { // changes user activity every 5 minutes
		activity = bot.activityMessage()
		client.user.setActivity(activity[0], {type: activity[1]})
	}, 300000)
})

if(bot.debug) { // when bot sends a debug message
	client.on("debug", debug => {
		console.log("[DEBUG] " + debug) // fancy debug text
	})
}

client.on("message", message => {
	if(message.author.bot) return // protects against bots
	if(message.content.startsWith(bot.prefix)) { // if it's a command, parse it
		parseCommand(message)
	} else { // otherwise process it as an event
		processEvent(message)
	}
})

function parseCommand(message) {
	args = message.content.slice(bot.prefix.length).split(" ").filter(i => i) // splits command into an array and removes empty arguments
	let command = bot.commands.flat[args[0]] || bot.commands.aliases[args[0]]
	if(!command) return // if command doesn't exist, return
	if(command.serverSpecific) { // if command is server specific, check if you're on the right server
		if(!bot.checkAdmin(message.author.id)) { // if you're not a bot admin (admins can perform server restricted commands)
			if(message.channel.type != "text") return // dms can't be on servers
			if(!command.serverSpecific.includes(message.channel.guild.id)) return // if command isn't on approved server, return
		}
	}
	if(command.adminOnly && !bot.checkAdmin(message.author.id)) return
	if(!command.enableDM && message.channel.type == "dm") return message.channel.send("This command isn't available in DMs.")
	if(command.permissions ? !message.member.hasPermission(command.permissions) : false) return message.channel.send("You don't have proper permissions to use this command!")
	let check = command.checkSyntax(message, args)
	if(check === true) { // if syntax checks out, execute, otherwise send error report
		command.execute(message, args)
	} else {
		message.channel.send(`Incorrect syntax. Command should be formatted as:\n\`${bot.prefix}${command.title}\`\nMessage: ${check}`)
	}
}

function processEvent(message) {
	for(e in events) { // for every event, call it
		events[e](message)
	}
}

module.exports = flag => {
	if(flag) {
		bot.prefix = bot.testBotPrefix
		bot.botToken = bot.testBot
	}
	client.login(bot.botToken)
}
