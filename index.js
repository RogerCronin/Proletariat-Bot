console.log("Starting...")

// TODO
// test p!lunch when school is in person
// fix p!weather / wait for weather.gov to fix their api
// remote update command
// github update banner-framework file stuff'
// remake p!server with https://api.mcsrvstat.us/
// refactor reddit.js cause ugly code

const discord = require("discord.js")
const banner = require("banner-framework")
const fs = require("fs")
const snoowrap = require("snoowrap")
const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")

const commands = {
	// general
	help: require("./commands/general/help.js"),
	translate: require("./commands/general/translate.js"),
	server: require("./commands/general/server.js"),
	lunch: require("./commands/general/lunch.js"),
	weather: require("./commands/general/weather.js"),
	uptime: require("./commands/general/uptime.js"),
	link: require("./commands/general/link.js"),
	random: require("./commands/general/random.js"),
	timer: require("./commands/general/timer.js"),
	download: require("./commands/general/download.js"),
	poll: require("./commands/general/poll.js"),
	events: require("./commands/general/events.js"),
	//fun
	generate: require("./commands/fun/generate.js"),
	duel: require("./commands/fun/duel.js"),
	flood: require("./commands/fun/flood.js"),
	uwuify: require("./commands/fun/uwuify.js"),
	dab: require("./commands/fun/dab.js"),
	bedwars: require("./commands/fun/bedwars.js"),
	reddit: require("./commands/fun/reddit.js"),
	nasa: require("./commands/fun/nasa.js"),
	// admin
	debug: require("./commands/admin/debug.js"),
	echo: require("./commands/admin/echo.js"),
	update: require("./commands/admin/update.js")
}

const eventObject = {
	eventList: {
		goodbot: require("./events/goodbot.js"),
		lyrics: require("./events/lyrics.js"),
		reddit: require("./events/reddit.js"),
		haiku: require("./events/haiku.js"),
		aita: require("./events/aita.js")
	},
	checker: id => {
		let guild = bot.db.get(id).value()
		if(guild == false) return false
		return true
	}
}
/*
const events = {
	goodbot: require("./events/goodbot.js"),
	lyrics: require("./events/lyrics.js"),
	reddit: require("./events/reddit.js"),
	haiku: require("./events/haiku.js"),
	aita: require("./events/aita.js")
}
*/
module.exports = async isDev => {
	const options = {
	  debugOutput: false, // debug outputing
	  prefix: isDev ? "tb!" : "p!", // bot prefix
	  color: 0xDC0000, // embed color background
	  loadingMessage: () => bot.information.loadingMessages[Math.floor(Math.random() * bot.information.loadingMessages.length)],
	  errorMessage: () => bot.information.errorMessages[Math.floor(Math.random() * bot.information.errorMessages.length)],
	  activityMessage: () => bot.information.activityMessages[Math.floor(Math.random() * bot.information.activityMessages.length)],
	  categories: ["general"],
	  information: require("./files/information.json"), // additional json information accessible via a bot instance
	  botProtection: false
	}
	global.bot = new banner.Bot(discord, commands, eventObject, options)
	bot.addEnv(["proletariatBot", "testBot", "imgBBKey", "hypixelKey", "nasaKey", "redditID", "redditSecret", "redditPassword", "unicodeSecret"])
	isDev ? bot.login(bot.testBot) : bot.login(bot.proletariatBot)
	bot.manifesto = fs.readFileSync(__dirname + "/files/manifesto.txt", { encoding: "utf8" })
	bot.redditWrap = new snoowrap({
		userAgent: "nodejs:com.proletariat.bot:v4.0.0 (by /u/SaladTheMediocre)",
		clientId: bot.redditID,
		clientSecret: bot.redditSecret,
		username: "SaladTheMediocre", // hey that's me
		password: bot.redditPassword
	})
	bot.db = await low(new FileSync("files/db.json"))
	bot.client.on("ready", async () => {
		console.log("Ready to rumble")
		if(isDev) return
		let lastMessage = await bot.client.channels.cache.get("765996274721751040").messages.fetch({ limit: 1 })
		lastMessage = lastMessage.first()
		if(lastMessage.content == "❔ Restart bot") {
			await lastMessage.edit("✅ Restart bot")
		}
		lastMessage.channel.send("Bot restarted")
	})
	bot.client.on("presenceUpdate", (before, after) => { // robot man offline stuff
		if(!before || !after) return // why would an event trigger with both parameters undefined???? wtf discord.js?????
		if(before.userID == "639633583736094759" && before.status == "online" && after.status == "offline") {
			bot.client.channels.cache.get("536529708490293248").send("Robot Man III went offline lmao")
		}
	})
	// Roger - 316947582670602240
	// RM    - 639633583736094759
}
