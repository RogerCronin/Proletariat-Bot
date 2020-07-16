const fetch = require("node-fetch")

module.exports = {
	adminOnly: false,
	permissions: "",
	serverSpecific: ["523242594860269568", "390264660789690388"],
	enableDM: false,
	name: "weather",
	title: "weather <current/today/tomorrow opt.>",
	description: "Gets the weather report for today or tomorrow, or the current conditions outside. Defaults to current.",
	execute: async (message, args) => {
		const msg = await message.channel.send(bot.loadingMessage())
		if(args[1] == "today" || args[1] == "tomorrow") {
			fetch("https://api.weather.gov/gridpoints/PHI/32,49/forecast", { headers: { "User-Agent": "nodejs:com.proletariat.bot:v4.0.0 (by /u/SaladTheMediocre)" } })
				.then(res => res.json())
				.then(data => {
					var ref = data.properties.periods // array of all forecasts
					// here change ref from array of all to particular index
					if(args[1] == "today") { // if today, get latest forecast
						ref = ref[0]
					} else { // if tomorrow, determine which index is for tomorrow
						if(ref[0].isDaytime) {
							ref = ref[2] // isDaytime is true, so [0] = today, [1] = tonight, [2] = tomorrow
						} else {
							ref = ref[1] // isDaytime is false, so [0] = tonight, [1] = tomorrow
						}
					}
					let embed = new bot.discord.MessageEmbed()
						.setColor(bot.color)
						.setTitle(ref.name)
						.setDescription(ref.detailedForecast)
						.setThumbnail(ref.icon)
						.setURL("https://forecast.weather.gov/MapClick.php?lat=39.45147990000004&lon=-75.71682999999996#.XLeIwuhKiUk")
					msg.edit("", embed)
				})
				.catch(err => {
					console.log(err)
					msg.edit(bot.errorMessage())
				})
		} else { // p!weather current
			fetch("https://api.weather.gov/stations/KILG/observations/latest", { headers: { "User-Agent": "nodejs:com.proletariat.bot:v4.0.0 (by /u/SaladTheMediocre)" } })
				.then(res => res.json())
				.then(data => {
					var ref = data.properties
					let string = ""
					if(ref.temperature.value) string += `Temperature - ${format(ref.temperature)}°F
`
					if(ref.relativeHumidity.value) string += `Humidity - ${format(ref.relativeHumidity)}%
`
					if(ref.windSpeed.value && ref.windDirection.value) string += `Wind Speed - ${format(ref.windDirection)} ${format(ref.windSpeed)} mph
`
					if(ref.dewpoint.value) string += `Dewpoint - ${format(ref.dewpoint)}°F
`
					if(ref.visibility.value) string += `Visibility - ${format(ref.visibility)} miles
`
					if(ref.windChill.value) string += `Wind Chill - ${format(ref.windChill)}°F
`
					if(ref.heatIndex.value) string += `Heat Index - ${format(ref.heatIndex)}°F
`
					let embed = new bot.discord.MessageEmbed()
						.setColor(bot.color)
						.setTitle("Current Weather")
						.setThumbnail(ref.icon)
						.setURL("https://forecast.weather.gov/MapClick.php?lat=39.45147990000004&lon=-75.71682999999996#.XLeIwuhKiUk")
						.setDescription(string)
					msg.edit("", embed)
					console.log(ref)
				})
				.catch(err => {
					console.log(err)
					msg.edit(bot.errorMessage())
				})
		}
	},
	checkSyntax: (message, args) => {
		if(args[2]) return "More arguments than expected."
		if(args[1]) {
			if(!["current", "today", "tomorrow"].includes(args[1])) return "Unexpected second argument."
		}
		return true
	}
}

function format(ref) {
	switch(ref.unitCode) {
		case "unit:degC":
			return Math.floor(9/5 * ref.value + 32) // Celsius to Fahrenheit
		case "unit:degree_(angle)":
			return ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"][Math.round((ref.value % 360 + 360) % 360 / 45)] // jank way I found from messing around on js.do
		case "unit:km_h-1":
			return Math.floor(ref.value / 1.609) // kmh to mph
		case "unit:m":
			return Math.floor((ref.value / 1609) * 100) / 100 // m to mi
		case "unit:percent":
			return Math.floor(ref.value) // chop the decimal
	}
}
