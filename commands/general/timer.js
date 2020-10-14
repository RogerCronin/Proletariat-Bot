const banner = require("banner-framework")

var timers = {}

module.exports = new banner.Command({
  aliases: ["remind"],
	name: "timer",
	title: "timer [wait time] [reason..]",
	description: "Format with hours, minutes, or seconds like `1h1m1s`.",
	category: "general",
	execute: async function(message, args) {
    if(timers[message.author.id]) return message.channel.send(this.errorMessage("error", "You already have a timer going. Click the X reaction under the timer to delete it.", "timer:0"))
    let reason = message.content.substring(message.content.match(/(?:p|(?:tb))!timer \S+ /)[0].length)
		timers[message.author.id] = {
			user: message.author,
			reason: reason,
			seconds: formatSec(args[1]),
			paused: false
		}
		try {
			const msg = await message.author.send(format(timers[message.author.id].seconds, timers[message.author.id].reason))
			message.channel.send(`Created timer \`${reason}\``)
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
			console.error(err)
			delete timers[message.author.id]
			message.channel.send(this.errorMessage("error", "I can't send DMs to you, check the server privacy settings.", "timer:1"))
		}
	},
	checkSyntax: function(message, args) {
    if(!args[2]) return "No time or reason provided."
    // string.match(regex)[0] == string && string.length > 0
    if(!(args[1].match(/(([0-9]+h)?([0-9]+m)?([0-9]+s)?)$/gm)[0] == args[1] && args[1].length > 0)) return "Incorrectly formatted time."
    let seconds = formatSec(args[1])
    if(seconds > 172800) return "Time provided is over 48 hours."
    if(seconds == 0) return "Timer cannot be 0 seconds long."
    return true
  }
})

var format = (seconds, reason) => `${reason}\n${((Math.floor(seconds / 60 / 60) + 100 + "").substring(1))}:${(Math.floor(seconds / 60) % 60 + 100 + "").substring(1)}:${(seconds % 60 + 100 + "").substring(1)}`

function formatSec(string) {
  let seconds = 0
  for(match of string.match(/[0-9]+[smh]/g)) {
    switch(match.slice(-1)) {
      case "s":
        seconds += match.slice(0, -1) * 1
        break
      case "m":
        seconds += match.slice(0, -1) * 60
        break
      default:
        seconds += match.slice(0, -1) * 3600
    }
  }
  return seconds
}
