module.exports = {
	adminOnly: false,
	permissions: "",
	serverSpecific: false,
	enableDM: true,
	name: "download",
	aliases: [],
	title: "download [twitter url/reddit url]",
	description: "Downloads a video from the Twitter or Reddit URL provided.",
	execute: (message, args) => {
		if(Array.from(args[1].matchAll(/(?:https:\/\/)(?:www\.)?(twitter|reddit)/g))[0][1] == "reddit") {
			message.channel.send("rebit")
		} else {
			message.channel.send("twider")
		}
	},
	checkSyntax: (message, args) => {
		if(!args[1]) return "Expected URL."
		let urlMatch = Array.from(args[1].matchAll(/(?:https:\/\/)(?:www\.)?(twitter|reddit)/g))
		if(urlMatch.length) return true
		return "Invalid Reddit or Twitter URL."
	}
}
