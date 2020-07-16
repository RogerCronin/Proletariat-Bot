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
		var translate = (translationText, targetLanguage) => { // edits message to translate translationText into targetLanguage
			fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${bot.yandexKey}&text=${encodeURI(translationText)}&lang=${targetLanguage}`)
				.then(res => res.json())
				.then(data => {
					if(!data.text) return msg.edit(bot.errorMessage())
					let embed = new bot.discord.MessageEmbed()
						.setColor(message.member.displayColor)
						.setAuthor(message.author.username, message.author.avatarURL())
						.setDescription(data.text)
					msg.edit("", embed)
				})
				.catch(err => msg.edit(bot.errorMessage()))
		}
		let translationText = ""
		let targetLanguage = ""
		if(args[1].startsWith("lang:")) { // if lang: is used
			for(i = 2; i < args.length; i++) {
				translationText += args[i] + " " // skip over it when formatting the text to translate
			}
			targetLanguage = args[1].slice(5)
			translate(translationText, targetLanguage) // translates
		} else { // otherwise check if it's in English or Russian
			for(i = 1; i < args.length; i++) {
				translationText += args[i] + " "
			}
			fetch(`https://translate.yandex.net/api/v1.5/tr.json/detect?key=${bot.yandexKey}&text=${encodeURI(translationText)}`) // does checking
				.then(res => res.json())
				.then(data => {
					if(data.lang == "en") { // if its english, set translation language to russian, otherwise set it to english
						targetLanguage = "ru"
					} else {
						targetLanguage = "en"
					}
					translate(translationText, targetLanguage) // translates
				})
				.catch(err => msg.edit(bot.errorMessage()))
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
