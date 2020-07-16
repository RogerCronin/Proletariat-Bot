const fetch = require("node-fetch")
const date = require("date-and-time") // I could probably get rid of this library but I don't really want to

module.exports = { // most of this code was taken from Proletariat Bot 3 (ain't broke don't fix)
	adminOnly: true, // make sure to change this after testing!
	// CAPS SO YOU REMEMBER
	// PLEASE REMEMBER
	// YOU DUMMY
	permissions: "",
	serverSpecific: ["523242594860269568", "390264660789690388"],
	enableDM: false,
	name: "lunch",
	title: "lunch <today/tomorrow opt.>",
	description: "Displays the school lunches for the current day or tomorrow, defaulting to today.",
	execute: async (message, args) => {
		const msg = await message.channel.send(bot.loadingMessage())
		let now = new Date() // date object
		if(args[1] == "tomorrow") {
			date.addDays(now, 1)
		}
		now = date.format(now, "MM-DD-YYYY") // now is now a string with format MM-DD-YYYY
		//now = "02-11-2020" // test date
		fetch(`https://api.mealviewer.com/api/v4/school/AppoquiniminkHigh/${now}/${now}/0`)
			.then(res => res.json())
			.then(data => {
				if(!data.menuSchedules[0].menuBlocks[1]) return msg.edit(bot.errorMessage())
				var ref = data.menuSchedules[0].menuBlocks[1].cafeteriaLineList.data[0].foodItemList.data // array containing food items
				let embed = new bot.discord.MessageEmbed()
					.setColor(bot.color)
					.setTitle("MealViewer")
					.setURL("https://schools.mealviewer.com/school/AppoquiniminkHigh")
					.setDescription(`School lunches for ${now}`)
				for(i in ref) { // loops through food items
					if(["Daily Lunch Entrées", "Vegetarian Entrée of the Day", "Milk Variety", "100% Fruit Juice"].contains(ref[i].item_Type)) continue // get rid of unnecessary stuff
					embed.addField(ref[i].item_Type, ref[i].item_Name)
				}
				msg.edit("", embed)
			})
			.catch(() => msg.edit(bot.errorMessage()))
	},
	checkSyntax: (message, args) => {
		if(args[1]) {
			if(args[1] != "today" && args[1] != "tomorrow") return "Second argument must be today or tomorrow."
		}
		if(args[2]) return "More arguments than expected."
		return true
	}
}
