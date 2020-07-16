var timers = {}

module.exports = {
	adminOnly: false,
	permissions: "",
	serverSpecific: false,
	enableDM: true,
	name: "timer",
	title: "timer <[number under 48 hours]<s/m/h> [reason under 128 characters]>",
	description: "Sets a timer for a set number of seconds, minutes, or hours. Can't be over 48 hours because I can't be bothered.",
	execute: async (message, args) => {
		if(timers[message.author.id]) return message.channel.send("You already have a timer going. Click the X reaction under the timer to delete it.")
		let reason = message.content.substring(message.content.match(/p!timer [0-9]{1,6}[smh] /m)[0].length)
		timers[message.author.id] = {
			user: message.author,
			reason: reason,
			seconds: formatSec(args),
			paused: false
		}
		try {
			const msg = await message.author.send(format(timers[message.author.id].seconds, timers[message.author.id].reason))
			timers[message.author.id].msg = msg
			timers[message.author.id].msg.react("❌")
				.then(() => timers[message.author.id].msg.react("⏯️"))
				.then(() => {
					timers[message.author.id].countdown = setInterval(() => {
						if(!timers[message.author.id].paused) {
							timers[message.author.id].seconds -=2
							if(timers[message.author.id].seconds < 1) {
								timers[message.author.id].msg.delete()
								message.author.send(`Hey ${timers[message.author.id].user}, your timer \`${timers[message.author.id].reason}\` is up!`)
								clearInterval(timers[message.author.id].countdown)
								delete timers[message.author.id]
							} else {
								timers[message.author.id].msg.edit(format(timers[message.author.id].seconds, timers[message.author.id].reason))
							}
						}
					}, 2000)
					timers[message.author.id].collector = timers[message.author.id].msg.createReactionCollector((r, u) => (r.emoji.name == "❌" || r.emoji.name == "⏯️") && u.id == message.author.id, { dispose: true })
					timers[message.author.id].collector.on("collect", r => {
						if(r.emoji.name == "❌") {
							timers[message.author.id].collector.stop()
							timers[message.author.id].msg.delete()
							message.author.send(`Deleted timer \`${timers[message.author.id].reason}\`.`)
							clearInterval(timers[message.author.id].countdown)
							delete timers[message.author.id]
						} else {
							timers[message.author.id].paused = true
							timers[message.author.id].msg.edit(`\`PAUSED\`\n${format(timers[message.author.id].seconds, timers[message.author.id].reason)}`)
						}
					})
					timers[message.author.id].collector.on("remove", () => {
						timers[message.author.id].paused = false
						timers[message.author.id].msg.edit(format(timers[message.author.id].seconds, timers[message.author.id].reason))
					})
				})
		} catch(err) {
			console.log(err)
			delete timers[message.author.id]
			message.channel.send("I can't send DMs to you, check the server privacy settings.")
		}
	},
	checkSyntax: (message, args) => {
		if(args[3]) return "More arguments than expected."
		if(!args[2]) return "No time or reason provided."
		if(!args[1].match(/[0-9]{1,6}[smh]$/m)) return "Incorrectly formatted time."
		if(message.content.substring(message.content.match(/p!timer [0-9]{1,6}[smh] /m)[0].length).length > 128) return "Reason over 128 characters."
		let num = formatSec(args)
		if(num > 172800) return "Incorrectly formatted time or time provided over 48 hours."
		return true
	}
}

var format = (seconds, reason) => `${reason}\n${((Math.floor(seconds / 60 / 60) + 100 + "").substring(1))}:${(Math.floor(seconds / 60) % 60 + 100 + "").substring(1)}:${(seconds % 60 + 100 + "").substring(1)}`

function formatSec(args) {
	let unit = args[1].match(/[smh]/)
	let num = args[1].match(/[0-9]{1,6}/)
	if(unit == "m") num *= 60
	if(unit == "h") num *= 3600
	num *= 1
	return num
}
