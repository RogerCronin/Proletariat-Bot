module.exports = {
	adminOnly: false,
	permissions: "",
	serverSpecific: false,
	enableDM: true,
	name: "random",
	title: "random [options 1], [option 2], ..",
	description: "Randomly chooses an option. Options are separated with commas.",
	execute: async (message, args) => {
		let options = message.content.slice(9).split(",").filter(i => i)
		/*
		* message.content.slice(9) removes the "p!random "
		* split(",") makes it an array, spliting on the commas (i.e. makes array of options)
		* filter(i => i) removes empty indecies because when i = "" (empty) it casts to false, meaning filter() removes it
		*/
		for(i in options) { // removes whitespace from all elements
			options[i] = options[i].trim()
		}
		message.channel.send(`I choose ${options[Math.floor(Math.random() * options.length)]}!`) // randomly choose one
	},
	checkSyntax: (message, args) => {
		if(message.content.slice(9).split(",").filter(i => i).length > 1) return true // haha yes, readable code
		return "There are not at least two options separated with commas."
	}
}