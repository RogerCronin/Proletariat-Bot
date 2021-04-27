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
		if(message.channel.id != "765996274721751040") return message.channel.send(this.errorMessage("error", "This command can only be executed in the bot-logs channel.", "update:0"))
		const msg_1 = await message.channel.send("❔ Pull latest version from GitHub")
		if(execSync("git pull").toString().startsWith("Already up to date")) {
			await msg_1.edit("✅ Pull latest version from GitHub")
			return message.channel.send("Already up to date! No need to restart.")
		}
		await msg_1.edit("✅ Pull latest version from GitHub")
		const msg_2 = await message.channel.send("❔ Install packages")
		execSync("npm install")
		msg_2.edit("✅ Install packages")
		const msg_3 = await message.channel.send("❔ Restart bot")
		execSync("pm2 restart Proletariat-Bot") // kills process
	},
	checkSyntax: function(message, args) {
		if(args[1]) return "More arguments than expected."
		if(message.author.id != "316947582670602240") return "You don't have proper credentials!"
		return true
	}
})
