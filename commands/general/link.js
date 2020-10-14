const banner = require("banner-framework")

module.exports = new banner.Command({
	aliases: ["invite", "links"],
	name: "link",
	title: "link",
	description: "Nab an invite link to spread Communism all across Discord!",
	category: "general",
	execute: function(message, args) {
		let embed = new bot.discord.MessageEmbed()
			.setColor(bot.color)
			.setTitle("Links")
			.setDescription("Thanks for you interest in Proletariat Bot!")
			.addFields(
				{ name: "Invite Link", value: "[Click here](https://discord.com/api/oauth2/authorize?client_id=513455833703645184&permissions=388160&scope=bot)", inline: true },
				{ name: "GitHub Link", value: "[Click here](https://github.com/RogerCronin/Proletariat-Bot)", inline: true }
			)
		message.channel.send(embed)
	},
	checkSyntax: (message, args) => args[1] ? "More arguments than expected." : true
})
