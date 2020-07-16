module.exports = {
	adminOnly: false,
	permissions: "",
	serverSpecific: false,
	enableDM: false,
	name: "generate",
	title: "generate <@[username]> <#[text channel] opt.>",
	description: "Generates a message the person you pinged could've said through a simple A.I. Based on conversations found in the specified channel, defaulting to the channel the command was sent in.",
	execute: async (message, args) => {
		//running = true
		const maxMessages = 100 // in 100s, i.e. maxMessages = 100 gathers 10000 messages
		let user = message.mentions.users.first()
		let channel
		if(args[2]) {
			channel = bot.getChannelMention(args[2])
		} else {
			channel = message.channel
		}
		const msg = await message.channel.send("Loading...")
		let messages = []
		let lastID = channel.lastMessageID
		let messageCount = 0
		for(let i = 0; i < maxMessages; i++) { // fun fact! the "let" in the for loop fixed a bug found in p!generate for over a year
			try {
				let msgs = await channel.messages.fetch({ limit: 100, before: lastID })
				msgs = msgs.filter(m => m.author.id == user.id)
				messageCount += msgs.size
				messages[i] = msgs
				lastID = messages[i].last().id
			} catch(e) {
				console.log(e)
				break // ran out of messages to dab
			}
			if(i % 10 == 0) {
				msg.edit(`Loading... ${messageCount} messages fetched so far`)
			}
		}
		let totalString = "" // will eventually concat into every single message
		for(i of messages) {
			i.forEach(m => {
				totalString += `${m.content} ((done${bot.unicodeSecret})) ` // sentence end marker
			})
		}
		msg.edit(`Loading... Finished fetching ${messageCount} messages`)
		let chain = buildMarkovChain(totalString)
		let string = generateMarkovChain(chain)
		if(!string) return msg.edit(bot.errorMessage())
		let embed = new bot.discord.MessageEmbed()
			.setColor(message.guild.member(user).displayColor)
			.setAuthor(user.username, user.avatarURL())
			.setDescription(string)
		msg.edit(`\`Generated with ${messageCount} messages from ${user.username}\``, embed)
	},
	checkSyntax: (message, args) => {
		if(!args[1]) return "User mention required."
		if(!bot.getUserMention(args[1])) return "Malformed user mention."
		if(args[2]) {
			if(!bot.getChannelMention(args[2])) return "Malformed channel mention."
		}
		if(args[3]) return "More arguments than expected."
		return true
	}
}

function buildMarkovChain(list) {
	list = list.split(" ")
	let chain = {}
	for(i = 0; i < list.length; i++) {
		let word = list[i].toLowerCase().replace(/(\.|,|!|\?|:|;|\*)$/g, "") // tidy up
		if(!chain[word]) chain[word] = [] // if new word is encountered, define it to avoid error
		if(list[i + 1]) { // if not edge case
			chain[word].push(list[i + 1].toLowerCase().replace(/(\.|,|!|\?|:|;|\*)$/g, "")) // push to chain[word]
		}
	}
	delete chain[""] // cleanup
	delete chain["((done" + bot.unicodeSecret + "))"]
	return chain
}

function generateMarkovChain(markov, start = Object.keys(markov)[Math.floor(Math.random() * Object.keys(markov).length)]) {
	let string = start + " "
	let lastWord = start
	let word
	for(i = 0; i < 30; i++) {
		try {
			word = nextWord(markov, lastWord)
			if(word == "((done" + bot.unicodeSecret + "))") break
			string += word + " "
			lastWord = word
		} catch {
			return false
		}
	}
	return string
}

var nextWord = (markov, lastWord) => markov[lastWord][Math.floor(Math.random() * markov[lastWord].length)]
