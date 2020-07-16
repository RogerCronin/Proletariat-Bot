module.exports = async message => { // I also copied this directly from Proletariat Bot 3
	if(message.content.toLowerCase().includes("aita?") || message.content.toLowerCase().includes("am i the asshole?")) {
		var msg
		if(Math.random() > .5) {
			msg = await message.channel.send("NTA, " + bot.information.assholeMessagesN[Math.floor(Math.random() * bot.information.assholeMessagesN.length)])
		} else {
			msg = await message.channel.send("YTA, " + bot.information.assholeMessagesA[Math.floor(Math.random() * bot.information.assholeMessagesA.length)])
		}
		await new Promise(r => setTimeout(r, 2000))
		msg.react("731535251591135263")
		await new Promise(r => setTimeout(r, 1000))
		msg.edit(msg.content + "\nEDIT: Thanks for the gold kind stranger!")
	}
}