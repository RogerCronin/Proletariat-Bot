const banner = require("banner-framework")
const url = require("url")
const fetch = require("node-fetch")
const htmlParser = require("node-html-parser")

module.exports = new banner.Command({
	name: "download",
	title: "download [twitter url/reddit url]",
	description: "Downloads a video from the Twitter or Reddit URL provided courteous of RipSave and SaveTweetVid.",
	category: "general",
	execute: async function(message, args) {
    const msg = await message.channel.send(bot.loadingMessage())
		if(Array.from(args[1].matchAll(/(?:https:\/\/)(?:www\.)?(twitter|reddit)/g))[0][1] == "reddit") { // I love regex
			try {
				// post url to /getlink
				let params = new url.URLSearchParams()
				params.append("url", args[1])
				let res = await fetch("https://ripsave.com/getlink", { method: "post", body: params })
				let data = await res.json()
				let parsedHTML = htmlParser.parse(data.data)
				// get the download link information
				let link = parsedHTML.querySelector(".downloadTable").childNodes[3].childNodes[1].childNodes[5].firstChild.getAttribute("href")
				if(link.startsWith("/")) { // if video has audio
					res = await fetch(`https://ripsave.com${parsedHTML.querySelector(".downloadTable").childNodes[3].childNodes[1].childNodes[5].firstChild.getAttribute("href")}`)
					data = await res.json()
					// make an embed with the download as a link
					let embed = new bot.discord.MessageEmbed()
						.setColor(bot.color)
						.setTitle(data.data.t)
						.setURL(`https://ripsave.com/download?s=reddit&f=${encodeURIComponent(data.data.f)}&t=${encodeURIComponent(data.data.t)}`)
					msg.edit("", embed) // done
				} else {
					let embed = new bot.discord.MessageEmbed()
						.setColor(bot.color)
						.setTitle(Array.from(args[1].matchAll(/reddit.com\/r\/.*\/comments\/.{6}\/(\w*)\//g))[0][1].replace(/_/g, " ")[0].toUpperCase() + Array.from(args[1].matchAll(/reddit.com\/r\/.*\/comments\/.{6}\/(\w*)\//g))[0][1].replace(/_/g, " ").slice(1)) // I'm so sorry
						.setURL(link)
					msg.edit("", embed)
				}
			} catch(e) { // misc catch because I can't be bothered
				console.error(e)
				msg.edit(this.errorMessage("error", "Error fetching Reddit content.", "download:0"))
			}
		} else {
			try {
				let params = new url.URLSearchParams()
				params.append("url", args[1])
				let res = await fetch("https://www.savetweetvid.com/downloader", { method: "post", body: params })
				let data = await res.text()
				let parsedHTML = htmlParser.parse(data)
				let vidURL = parsedHTML.querySelector(".page-content").childNodes[1].childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[7].childNodes[1].getAttribute("href")
				let embed = new bot.discord.MessageEmbed()
					.setColor(bot.color)
					.setTitle(`Tweet by ${parsedHTML.querySelector("h5").firstChild.firstChild.rawText.trim()}`)
					.setURL(vidURL)
				msg.edit("", embed)
				msg.channel.send(vidURL)
			} catch(e) {
        console.error(e)
				msg.edit(this.errorMessage("error", "Error fetching Twitter content.", "download:1"))
			}
		}
	},
	checkSyntax: function(message, args) {
    if(!args[1]) return "Expected URL."
		if(args[2]) return "More arguments than expected."
		try {
			let inputUrl = new url.URL(args[1])
			if(inputUrl.hostname == "www.reddit.com" || inputUrl.hostname == "twitter.com") return true
		} catch {} // error handling done outside of try / catch
		return "Invalid Reddit or Twitter share link."
  }
})
