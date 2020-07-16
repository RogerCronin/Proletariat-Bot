const syllable = require("syllable")

module.exports = message => { // I copied this code directly from Proletariat Bot 3, idk if it works very well
	var array = message.content.replace(/\n/g, " ").split(" ") // get rid of linebreaks
	var haiku = { // object storing the lines
		first: [0, ""],
		second: [0, ""],
		third: [0, ""]
	}
	for(i = 0; i < array.length; i++) {
		if(haiku.first[0] != 5) { // if the first line doesn't have five, start filling it with words
			haiku.first[0] += syllable(array[i]) // if the first line goes over 5 it won't be sent as a haiku, don't worry
			haiku.first[1] += array[i] + " "
		} else if(haiku.second[0] != 7) { // same with second line except it's 7 syllables instead of 5
			haiku.second[0] += syllable(array[i])
			haiku.second[1] += array[i] + " "
		} else { // otherwise third line
			haiku.third[0] += syllable(array[i])
			haiku.third[1] += array[i] + " "
		}
	}
	var string = `${haiku.first[1]}\n${haiku.second[1]}\n${haiku.third[1]}` // haiku format
	if(syllable(haiku.first) == 5 && syllable(haiku.second) == 7 && syllable(haiku.third) == 5) message.channel.send(`bruh you just made a haiku\n\`\`\`${string}\`\`\``) //if the resulting product is a haiku, send it in chat
}