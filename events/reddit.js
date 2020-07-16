module.exports = message => {
	let subMatch = Array.from(message.content.matchAll(/(^| )(r\/[\w]+[^ .,!?;:"'])/gm))
	let userMatch = Array.from(message.content.matchAll(/(^| )(u\/[\w]+[^ .,!?;:"'])/gm))
	let string = ""
	for(s in subMatch) {
		string += `[${subMatch[s][2]}](https://www.reddit.com/${subMatch[s][2]}/\n\n)
` // I guess you can't use \n in template strings?
	}
	for(u in userMatch) {
		string += `[${userMatch[u][2]}](https://www.reddit.com/${userMatch[u][2]}/\n\n)
` // ew, ugly code
	}
	if(string) {
		let embed = new bot.discord.MessageEmbed()
			.setColor(bot.color)
			.setTitle("Here are your links kiddo")
			.setDescription(string)
		message.channel.send(embed)
	}
}