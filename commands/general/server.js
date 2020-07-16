const fetch = require("node-fetch")
const url = require("url")

module.exports = {
	adminOnly: false,
	permissions: "",
	serverSpecific: false,
	enableDM: true,
	name: "server",
	title: "server [Minecraft server IP address]",
	description: "Displays information about a specific Minecraft server.",
	execute: async (message, args) => {
		const msg = await message.channel.send(bot.loadingMessage())
		fetch(`https://mcapi.us/server/status?ip=${args[1]}`) // fetches server info
			.then(res => res.json())
			.then(data => {
				let status = "Offline"
				if(data.online) status = "Online"
				if(data.favicon) { // if favicon exists, upload base64 string to imgBB because Discord doesn't support image urls that long
					const params = new URLSearchParams()
					params.append("image", data.favicon.slice(22)) // add base64 data
					fetch(`https://api.imgbb.com/1/upload?key=${bot.imgBBKey}`, { method: "post", body: params }) // send the request
						.then(res => res.json())
						.then(json => { // boom, embed time
							let embed = new bot.discord.MessageEmbed()
								.setColor(bot.color)
								.setTitle(args[1])
								.setThumbnail(json.data.image.url)
								.setDescription(`${status}\n*${data.players.now}/${data.players.max}*`)
							msg.edit("", embed)
						})
						.catch(err => msg.edit(bot.errorMessage()))
				} else {
					let embed = new bot.discord.MessageEmbed() // normal embed without favicon
						.setColor(bot.color)
						.setTitle(args[1])
						.setDescription(`${status}\n*${data.players.now}/${data.players.max}*`)
					msg.edit("", embed)
				}
			})
			.catch(err => msg.edit(bot.errorMessage()))
	},
	checkSyntax: (message, args) => {
		if(!args[1]) return "No Minecraft server IP address provided."
		if(args[2]) return "More arguments than expected."
		return true
	}
}
