const banner = require("banner-framework")

const numberArray = [
	"1️⃣",
	"2️⃣",
	"3️⃣",
	"4️⃣",
	"5️⃣",
	"6️⃣",
	"7️⃣",
	"8️⃣",
	"9️⃣",
	"🔟"
]

module.exports = new banner.Command({
	name: "poll",
	title: "poll <[options 1],> <[option 2],> ..",
	description: "Creates a poll for people to react on.",
	category: "general",
	execute: async function(message, args) {
		let options = args.slice(1).join(" ").split(",")
		let string = ""
		for(i in options) {
			string += `${numberArray[i]} ${options[i]}\n`
		}
		try {
			const msg = await message.channel.send(string)
			for(let i in options) {
				await msg.react(numberArray[i])
			}
		} catch(err) {
			message.channel.send(this.errorMessage("error", "Failed to send message, try reducing length of option titles.", "poll:0"))
		}
	},
	checkSyntax: function(message, args) {
		let options = args.slice(1).join(" ").split(",")
		if(options.length > 1) {
			if(options.length > 10) return "There are over 10 options."
			return true
		} else {
			return "There are not at least two options separated with commas."
		}
  }
})
