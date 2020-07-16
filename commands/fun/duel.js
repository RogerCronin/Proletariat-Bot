var duels = {}

module.exports = {
	adminOnly: false,
	permissions: "",
	serverSpecific: false,
	enableDM: true,
	name: "duel",
	title: "duel <@[username]>",
	description: "Challenges somebody to a duel. Be the first person to send a message after the flag waves!",
	execute: async (message, args) => {
		if(duels[message.channel.id]) return message.channel.send("There is already a duel taking place!")
		let mention = message.mentions.users.first()
		if(mention.id == message.author.id) return message.channel.send("You can't duel yourself!")
		duels[message.channel.id] = true
		const msg = await message.channel.send(`Hey ${mention}, you've just been challenged to a duel! Click the checkmark to accept it, or just ignore it.`)
		msg.react("✔").then(async () => {
			const collector = await msg.createReactionCollector((r, u) => r.emoji.name == "✔" && u.id == mention.id, { time: 20000 })
			collector.on("collect", async reaction => {
				collector.stop("duelStart")
				let flag = false
				let win = false
				message.channel.awaitMessages(m => m.author.id == message.author.id || m.author.id == mention.id, { max: 1, time: 15000, errors: ["time"] })
					.then(m => {
						m = m.first()
						win = true
						if(!flag) {
							flag = true
							if(m.author.id == message.author.id) {
								message.channel.send(`Misfire! ${mention} has won the duel!`)
							} else {
								message.channel.send(`Misfire! ${message.member} has won the duel!`)
							}
						} else {
							if(m.author.id == message.author.id) {
								message.channel.send(`${message.member} has won the duel!`)
							} else {
								message.channel.send(`${mention} has won the duel!`)
							}
						}
						delete duels[message.channel.id]
					})
					.catch(() => message.channel.send("Duel expired. Y'all sleeping or something?"))
				message.channel.send(`Alright, ${message.member} and ${mention}, first person to send a message after I send the 🚩 emoji wins the duel. Be sure not to send a message beforehand.`)
				await new Promise(r => setTimeout(r, (Math.floor(Math.random() * 6) + 3) * 1000))
				if(!win) {
					await message.channel.send("🚩")
					flag = true
				}
			})
			collector.on("end", (col, reason) => {
				if(reason != "duelStart") {
					if(reason != "duelStart") msg.edit(msg.content + "\n**Duel request expired.**")
					delete duels[message.channel.id]
				}
			})
		})
	},
	checkSyntax: (message, args) => {
		if(!args[1]) return "User mention required."
		if(!bot.getUserMention(args[1])) return "Malformed user mention."
		if(args[2]) return "More arguments than expected."
		return true
	}
}
