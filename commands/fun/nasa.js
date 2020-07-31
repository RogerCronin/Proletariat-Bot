const fetch = require("node-fetch")

module.exports = {
	adminOnly: false,
	permissions: "",
	serverSpecific: false,
	enableDM: true,
	name: "nasa",
	title: "nasa <apod/mars>",
	description: "Fetches you the NASA Astronomy Picutre Of the Day or a photo taken by a Mars rover. Might add in an interface to get photos from the Mars Rovers if I feel like it.",
	execute: async (message, args) => {
		const msg = await message.channel.send(bot.loadingMessage())
		if(args[1] == "apod") {
			try {
				let res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${bot.nasaKey}`)
				let data = await res.json()
				let embed = new bot.discord.MessageEmbed()
					.setColor(bot.color)
					.setTitle(data.title)
					.setDescription(data.explanation.replace(/\|/g, "｜"))
					.setImage(data.hdurl)
				msg.edit("", embed)
			} catch(err) {
				console.error(error)
				msg.edit(bot.errorMessage())
			}
		} else {
			marsRequest(msg)
		}
	},
	checkSyntax: (message, args) => {
		if(!args[1]) return "No second argument."
		if(!["apod", "mars"].includes(args[1])) return "Unexpected second argument."
		if(args[2]) return "More arguments than expected."
		return true
	}
}

async function marsRequest(msg) {
	let sol = Math.floor(Math.random() * 2540)
	try {
		let res = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${sol}&camera=fhaz&api_key=${bot.nasaKey}`)
		let data = await res.json()
		let image = data.photos[Math.floor(Math.random() * data.photos.length)]
		if(!image) marsRequest(msg) // if it fails for some reason, just call the function again! good coding standards!
		// potential error here if you're unlucky enough to hit an error for 11034 times in a row
		let embed = new bot.discord.MessageEmbed()
			.setColor(bot.color)
			.setTitle(image.earth_date)
			.setImage(image.img_src)
		msg.edit("", embed)
	} catch(err) {
		console.log(err)
		msg.edit(bot.errorMessage())
	}
}
