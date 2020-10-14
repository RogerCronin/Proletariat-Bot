const banner = require("banner-framework")
const { execSync } = require("child_process")

module.exports = new banner.Command({
	adminOnly: true,
	serverSpecific: ["523242594860269568"],
	name: "update",
	title: "update",
	description: "Updates the bot to the latest version.",
	category: "admin",
	execute: async function(message, args) {
		console.log(1)
		if(message.channel.id != "765996274721751040") return message.channel.send(this.errorMessage("error", "This command can only be executed in the bot-logs channel.", "update:0"))
		console.log(2)
		const msg_1 = await message.channel.send("❔ Pull latest version from GitHub")
		console.log(3)
		console.log(execSync("git pull").toString())
		console.log(4)
		await msg_1.edit("✔️ Pull latest version from GitHub")
		console.log(5)
		const msg_2 = await message.channel.send("❔ Restart bot")
		console.log(6)
		//console.log(execSync("pm2 restart Proletariat-Bot"))
	},
	checkSyntax: function(message, args) {
		console.log("check")
		if(message.author.id != "316947582670602240") return "You don't have proper credentials!"
		return true
	}
})
