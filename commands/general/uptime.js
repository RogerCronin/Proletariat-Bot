let minutes = 0
setInterval(() => { // updates minutes every minute (duh)
	minutes++
}, 60000)

module.exports = {
	adminOnly: false,
	permissions: "",
	serverSpecific: false,
	enableDM: true,
	name: "uptime",
	title: "uptime",
	description: "Displays how long the bot has been offline since the last restart.",
	execute: (message, args) => message.channel.send(`${bot.client.user.username} has been online for ${Math.floor(minutes / 60 * 10) / 10}${plural(Math.floor(minutes / 60 * 10) / 10)}`),
	checkSyntax: (message, args) => args[1] ? "More arguments than expected." : true
}

function plural(number) {
	if(number == 1) return " hour"
	return " hours"
}
