const fetch = require("node-fetch")

module.exports = {
	adminOnly: false,
	permissions: "",
	serverSpecific: false,
	enableDM: true,
	name: "translate",
	title: "translate <lang:[2 letter language code] opt.> [text..]",
	description: "Translates an English message to Russian or a non-English phrase into English. Specify a different language with `lang:xx`. Read ISO 639-1 for list of language codes.",
	execute: async (message, args) => {
		const msg = await message.channel.send(bot.loadingMessage())
		const translate = async (translationText, targetLanguage) => { // edits message to translate translationText into targetLanguage
			try {
				let res = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${bot.yandexKey}&text=${encodeURI(translationText)}&lang=${targetLanguage}`)
				let data = await res.json()
				if(!data.text) return msg.edit(bot.errorMessage())
				let embed = new bot.discord.MessageEmbed()
					.setColor(message.member.displayColor)
					.setAuthor(message.author.username, message.author.avatarURL())
					.setDescription(data.text)
				msg.edit("", embed)
			} catch(err) {
				console.error(err)
				msg.edit(bot.errorMessage())
			}
		}
		let translationText = ""
		let targetLanguage = ""
		if(args[1].startsWith("lang:")) { // if lang: is used
			targetLanguage = args[1].slice(5)
			args.splice(0, 2)
			translate(bot.messageReconstruct(args), targetLanguage) // translates
		} else { // otherwise check if it's in English or Russian
			args.shift()
			translationText = bot.messageReconstruct(args)
			try {
				let res = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/detect?key=${bot.yandexKey}&text=${encodeURI(translationText)}`) // does checking
				let data = await res.json()
				if(data.lang == "en") { // if its english, set translation language to russian, otherwise set it to english
					targetLanguage = "ru"
				} else {
					targetLanguage = "en"
				}
				translate(translationText, targetLanguage) // translates
			} catch(err) {
				console.error(err)
				msg.edit(bot.errorMessage())
			}
		}
	},
	checkSyntax: (message, args) => {
		if(!args[1]) return "No text provided."
		if(args[1].startsWith("lang:")) {
			if(!args[1].match(/lang:[a-z]{2}$/m) && args.length > 2) {
				return "Incorrectly formatted ISO 639-1 code."
			}
		}
		return true
	}
}
