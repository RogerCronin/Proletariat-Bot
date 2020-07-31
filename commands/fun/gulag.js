module.exports = {
	adminOnly: true,
	permissions: "",
	serverSpecific: false,
	enableDM: false,
	name: "gulag",
	title: "gulag <@[username]>",
	description: "Sends someone to gulag, i.e. that user can't use bot commands anymore.",
	execute: (message, args) => {
		let mention = message.mentions.users.first()
		if(bot.db.json[mention.id] === undefined) bot.db.json[mention.id] = false
		bot.db.json[mention.id] = bot.db.json[mention.id] ? false : true // switcheroo
		bot.db.write()
		if(bot.db.json[mention.id]) message.channel.send(`${mention.username} has been sent to gulag`)
		else message.channel.send(`${mention.username} has returned from gulag`)
	},
	checkSyntax: (message, args) => {
		if(args[2]) return "More arguments than expected."
		if(!args[1]) return "User mention required."
		if(!bot.getUserMention(args[1])) return "Malformed user mention."
		return true
	}
}
