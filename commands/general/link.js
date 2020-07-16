module.exports = {
	adminOnly: false,
	permissions: "",
	serverSpecific: false,
	enableDM: true,
	name: "link",
	title: "link",
	description: "Nab an invite link to spread Communism all across Discord!",
	execute: (message, args) => message.channel.send("Have fun and stay safe\nhttps://discord.com/api/oauth2/authorize?client_id=513455833703645184&permissions=388160&scope=bot\n\nOh and here's a link to the code\nGITHUB_LINK"),
	checkSyntax: (message, args) => args[1] ? "More arguments than expected" : true
}
