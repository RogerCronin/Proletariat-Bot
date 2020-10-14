const banner = require("banner-framework")
const fetch = require("node-fetch")

module.exports = new banner.Command({
	name: "translate",
	title: "translate <lang:[2 letter language code] opt.> [text..]",
	description: "Translates an English message to Russian or a non-English phrase into English. Specify a different language with `lang:xx`. Read ISO 639-1 for list of language codes.",
	category: "general",
	execute: async function(message, args) {
		const msg = await message.channel.send(bot.loadingMessage())
		const translate = async (translationText, targetLanguage) => { // edits message to translate translationText into targetLanguage
			try {
				let res = await fetch(`https://translate.googleapis.com/translate_a/t?client=dict-chrome-ex&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURI(translationText)}&ie=UTF8`)
				let data = await res.json()
				if(!data.alternative_translations) return msg.edit(this.errorMessage("error", "Error in translating text.", "translation:0"))
				let text = ""
				for(sentence of data.sentences) {
					text += (sentence.trans || "").trim() + " "
				}
				let embed = new bot.discord.MessageEmbed()
					.setColor(message.member.displayColor)
					.setAuthor(message.author.username, message.author.avatarURL())
					.setDescription(text)
				msg.edit("", embed)
			} catch(err) {
				console.error(err)
				msg.edit(this.errorMessage("error", "Error in translating and displaying translated text.", "translate:1"))
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
				let res = await fetch(`https://translate.googleapis.com/translate_a/t?client=dict-chrome-ex&sl=auto&tl="en"&dt=t&q=${encodeURI(translationText)}&ie=UTF8`) // does checking
				let data = await res.json()
				if(data.src == "en") { // if its english, set translation language to russian, otherwise set it to english
					targetLanguage = "ru"
				} else {
					targetLanguage = "en"
				}
				translate(translationText, targetLanguage) // translates
			} catch(err) {
				console.error(err)
				msg.edit(this.errorMessage("error", "Error in determining source language.", "translate:1"))
			}
		}
	},
	checkSyntax: function(message, args) {
    if(!args[1]) return "No text provided."
		if(args[1].startsWith("lang:")) {
      if(!args[2]) return "No text provided."
			if(!args[1].match(/lang:[a-z]{2}$/m) && args.length > 2) {
				return "Incorrectly formatted ISO 639-1 code."
			}
		}
		return true
  }
})
