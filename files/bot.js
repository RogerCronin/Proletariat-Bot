const fs = require("fs")

var information = require("./information.json") // bunch of json info
var exports = {
	debug: false, // debug logging true/false
	prefix: "p!", // bot prefix
	useCategories: true,
	color: 0xDC0000, // embed color background
	loadingMessage: () => information.loadingMessages[Math.floor(Math.random() * information.loadingMessages.length)], // random loading message
	errorMessage: () => information.errorMessages[Math.floor(Math.random() * information.errorMessages.length)], // random error message
	activityMessage: () => information.activityMessages[Math.floor(Math.random() * information.activityMessages.length)], // random activity message
	information: information
}
let envKeys = ["botToken", "yandexKey", "imgBBKey", "unicodeSecret", "hypixelKey", "nasaKey", "redditID", "redditSecret", "redditPassword"] // list of keys in process.env
for(key in envKeys) {
	exports[envKeys[key]] = process.env[envKeys[key]] // add them to exports
}
exports.checkAdmin = id => { // returns if user ID is admin or not
	return information.admins[id]
}

exports.manifesto = fs.readFileSync(__dirname + "/manifesto.txt", { encoding: "utf8" })

exports.getUserMention = mention => { // adapted from Discord.js guide
	if(!mention) return false
	if(mention.startsWith("<@") && mention.endsWith(">")) {
		mention = mention.slice(2, -1)
		if(mention.startsWith("!")) {
			mention = mention.slice(1)
		}
		return bot.client.users.cache.get(mention)
	}
}

exports.getChannelMention = mention => {
	if(!mention) return false
	if(mention.startsWith("<#") && mention.endsWith(">")) {
		mention = mention.slice(2, -1)
		return bot.client.channels.cache.get(mention)
	}
}

// sort of based on Crab Simulator text wrapping, execept good
exports.splitLongMessage = (string, length, split) => { // onSpace true when split new messages on space, false when on \n
	let messages = [] // returns array of messages under 2000 characters in length
	let message = "" // holds text until push to messages array
	for(t of string.split(split)) { // splits on \n or space depending on onNewLine
		if((message + split + t).length > length) { // if next iteration is too long
			messages.push(message) //  push current iteration
			message = t + split // reset message to next iteration minus before text
		} else {
			message += t + split // form next iteration
		}
	}
	message = message.slice(0, split.length * -1) // funky way of removing the last split character(s)
	if(message) messages.push(message)
	return messages
}

module.exports = function(discord, client, commands) {
	exports.discord = discord
	exports.client = client
	exports.commands = commands
	client.on("presenceUpdate", (before, after) => { // robot man offline stuff
		if(!before || !after) return // why would an event trigger with both parameters undefined???? wtf discord.js?????
		if(before.userID == "639633583736094759" && before.status == "online" && after.status == "offline") {
			client.channels.cache.get("536529708490293248").send("Robot Man III went offline lmao")
		}
	})
	return exports // send it back to store in global.bot
}

// Roger - 316947582670602240
// RM    - 639633583736094759
