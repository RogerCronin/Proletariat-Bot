var dabs = {}

module.exports = {
	adminOnly: false,
	permissions: "",
	serverSpecific: false,
	enableDM: true,
	name: "dab",
	title: "dab",
	description: "Dabs for a while, I guess. <o/",
	execute: async (message, args) => {
		if(dabs[message.guild.id]) clearInterval(dabs[message.guild.id])
		const msg = await message.channel.send("<o/")
		let facing = true
		let count = 0
		dabs[message.guild.id] = setInterval(async () => {
			count++
			if(count == 2400) clearInterval(dabs[message.guild.id])
			if(facing) {
				msg.edit("\\o>") // escapes \ character
				facing = false
			} else {
				msg.edit("<o/")
				facing = true
			}
		}, 1500)
	},
	checkSyntax: (message, args) => args[1] ? "More arguments than expected." : true
}
