const url = require("url")
const fetch = require("node-fetch")
const htmlParser = require("node-html-parser")

module.exports = {
	adminOnly: false,
	permissions: "",
	serverSpecific: false,
	enableDM: true,
	name: "download",
	aliases: [],
	title: "download [twitter url/reddit url]",
	description: "Downloads a video from the Twitter or Reddit URL provided courteous of RipSave.",
	execute: async (message, args) => {
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
				res = await fetch(`https://ripsave.com${parsedHTML.querySelector(".downloadTable").childNodes[3].childNodes[1].childNodes[5].firstChild.getAttribute("href")}`)
				data = await res.json()
				// make an embed with the download as a link
				let embed = new bot.discord.MessageEmbed()
					.setColor(bot.color)
					.setTitle(data.data.t)
					.setURL(`https://ripsave.com/download?s=reddit&f=${encodeURIComponent(data.data.f)}&t=${encodeURIComponent(data.data.t)}`)
				msg.edit("", embed) // done
			} catch { // misc catch because I can't be bothered
				msg.edit(bot.errorMessage())
			}
		} else {
			try {
				let params = new url.URLSearchParams()
				params.append("url", args[1])
				let res = await fetch("https://www.savetweetvid.com/downloader", { method: "post", body: params })
				let data = await res.text()
				let parsedHTML = htmlParser.parse(data)
				let embed = new bot.discord.MessageEmbed()
					.setColor(bot.color)
					.setTitle(`Tweet by ${parsedHTML.querySelector("h5").firstChild.firstChild.rawText.trim()}`)
					.setURL(parsedHTML.querySelector(".page-content").childNodes[1].childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[7].childNodes[1].getAttribute("href"))
				msg.edit("", embed)
			} catch {
				msg.edit(bot.errorMessage())
			}
		}
	},
	checkSyntax: (message, args) => {
		if(!args[1]) return "Expected URL."
		if(args[2]) return "More arguments than expected."
		try {
			let inputUrl = new url.URL(args[1])
			if(inputUrl.hostname == "www.reddit.com" || inputUrl.hostname == "twitter.com") return true
		} catch {} // error handling done outside of try / catch
		return "Invalid Reddit or Twitter share link."
	}
}
