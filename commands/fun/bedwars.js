const fetch = require("node-fetch")

module.exports = {
	adminOnly: false,
	permissions: "",
	serverSpecific: false,
	enableDM: true,
	name: "bedwars",
	title: "bedwars [player]",
	description: "Displays information about player stats in Hypixel's Bed Wars.",
	execute: async (message, args) => { // imported all of this from Proletariat Bot 3 with little changes
		const msg = await message.channel.send(bot.loadingMessage())
		fetch(`https://api.hypixel.net/player?key=${bot.hypixelKey}&name=${args[1]}`, { headers: { "User-Agent": "nodejs:com.proletariat.bot:v4.0.0 (by /u/SaladTheMediocre)" } })
			.then(res => res.json())
			.then(data => {
				if(data.player == null) return msg.edit("That person doesn't exist, fool")
				let ref = data.player.stats.Bedwars //reference
				if(!ref.kills_bedwars) {
					return msg.edit("That person hasn't played BedWars, fool")
				}
				if(data.player.monthlyPackageRank) data.player.newPackageRank = "MVP++" // if they have a monthly rank, set it to MVP++
				let stringObj = {} // master object that holds strings
				stringObj.general = "KDR: " + format(Math.round(ref.kills_bedwars / ref.deaths_bedwars * 100) / 100) //wacky way to round to 2 decimals
				stringObj.general += "\nWR: " + format(Math.round(ref.wins_bedwars / (ref.wins_bedwars + ref.losses_bedwars) * 100)) + "%"
				stringObj.general += "\nOverall Winstreak: " + format(ref.winstreak)
				stringObj.general += "\nLevel: " + format(data.player.achievements.bedwars_level)
				// fours stats
				if(ref.four_four_kills_bedwars) {
					stringObj.fours = "KDR: " + format(Math.round(ref.four_four_kills_bedwars / ref.four_four_deaths_bedwars * 100) / 100)
					stringObj.fours += "\nWR: " + format(Math.round(ref.four_four_wins_bedwars / (ref.four_four_wins_bedwars + ref.four_four_losses_bedwars) * 100)) + "%"
					stringObj.fours += "\nWinstreak: " + format(ref.four_four_winstreak)
				} else {
					stringObj.fours = "This player has not played 4v4v4v4"
				}
				// threes stats
				if(ref.four_three_kills_bedwars) {
					stringObj.threes = "KDR: " + format(Math.round(ref.four_three_kills_bedwars / ref.four_three_deaths_bedwars * 100) / 100)
					stringObj.threes += "\nWR: " + format(Math.round(ref.four_three_wins_bedwars / (ref.four_three_wins_bedwars + ref.four_three_losses_bedwars) * 100)) + "%"
					stringObj.threes += "\nWinstreak: " + format(ref.four_three_winstreak)
				} else {
					stringObj.threes = "This player has not played 3v3v3v3"
				}
				// doubles stats
				if(ref.eight_two_kills_bedwars) {
					stringObj.doubles = "KDR: " + format(Math.round(ref.eight_two_kills_bedwars / ref.eight_two_deaths_bedwars * 100) / 100)
					stringObj.doubles += "\nWR: " + format(Math.round(ref.eight_two_wins_bedwars / (ref.eight_two_wins_bedwars + ref.eight_two_losses_bedwars) * 100)) + "%"
					stringObj.doubles += "\nWinstreak: " + format(ref.eight_two_winstreak)
				} else {
					stringObj.doubles = "This player has not played doubles"
				}
				// solo stats
				if(ref.eight_one_kills_bedwars) {
					stringObj.solo = "KDR: " + format(Math.round(ref.eight_one_kills_bedwars / ref.eight_one_deaths_bedwars * 100) / 100)
					stringObj.solo += "\nWR: " + format(Math.round(ref.eight_one_wins_bedwars / (ref.eight_one_wins_bedwars + ref.eight_one_losses_bedwars) * 100)) + "%"
					stringObj.solo += "\nWinstreak: " + format(ref.eight_one_winstreak)
				} else {
					stringObj.solo = "This player has not played solo"
				}
				let embed = new bot.discord.MessageEmbed()
					.setColor(bot.color)
					.setTitle(data.player.displayname)
					.setThumbnail(`https://cravatar.eu/head/${data.player.displayname}`) // api that gets player heads
					.addField("General", stringObj.general)
					.addField("4v4v4v4", stringObj.fours)
					.addField("3v3v3v3", stringObj.threes)
					.addField("Doubles", stringObj.doubles)
					.addField("Solo", stringObj.solo)
					if(data.player.newPackageRank) embed.setTitle(`[${data.player.newPackageRank}] ${data.player.displayname}`)
				msg.edit("", embed)
			})
			.catch(e => {
					console.log(e)
					msg.edit(bot.errorMessage())
			})
	},
	checkSyntax: (message, args) => {
		if(!args[1]) return "No username provided."
		if(args[2]) return "More arguments than expected."
		return true
	}
}

var format = number => number ? number : 0 // if !number, return 0
