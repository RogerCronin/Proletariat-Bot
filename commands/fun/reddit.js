const snoowrap = require("snoowrap")

module.exports = {
	adminOnly: false,
	permissions: "",
	serverSpecific: false,
	enableDM: true,
	name: "reddit",
	title: "reddit <hot/new/top opt.> [subreddit name]",
	description: "Fetches a Reddit post for you like a good bot. If you forget to add in the first parameter it'll default to hot. \`top\` gets the top post of the month.",
	execute: async (message, args) => {
		const msg = await message.channel.send(bot.loadingMessage())
		let sort = "hot"
		let subreddit
		if(["hot", "new", "top"].includes(args[1])) {
			sort = args[1]
			subreddit = args[2].startsWith("r/") ? args[2].slice(2) : args[2]
		} else {
			subreddit = args[1].startsWith("r/") ? args[1].slice(2) : args[1]
		}
		let redditWrap = new snoowrap({
			userAgent: "nodejs:com.proletariat.bot:v4.0.0 (by /u/SaladTheMediocre)",
			clientId: bot.redditID,
			clientSecret: bot.redditSecret,
			username: "SaladTheMediocre", // hey that's me
			password: bot.redditPassword
		})
		var handleListing = listing => {
			let nsfwFlag = false
			if(!listing.length) { // if the subreddit doesn't exist
				return msg.edit("Dude, this subreddit doesn't exist")
			}
			while(listing[0].stickied) { listing.shift() } // removes stickied posts, dunno if this is a good idea
			let embed = new bot.discord.MessageEmbed()
				.setColor(bot.color)
				.setTitle(listing[0].title.length > 256 ? listing[0].title.substring(0, 251) + " ..." : listing[0].title)
				.setDescription(`[u/${listing[0].author.name}](https://reddit.com/u/${listing[0].author.name}/)`)
				.addField("Links", `[${listing[0].subreddit_name_prefixed}](https://reddit.com/${listing[0].subreddit_name_prefixed}/)
[Post](https://reddit.com${listing[0].permalink})
`)
			if(listing[0].selftext) {
				embed.addField("Textpost", listing[0].selftext.length < 1024 ? listing[0].selftext : listing[0].selftext.substring(0, 1019) + " ...")
			} else if(listing[0].media) { // if there's an image, display it
				if(listing[0].over_18) {
					nsfwFlag = true
				} else {
					embed.setImage(listing[0].url)
				}
			} else if(!listing[0].is_self) { // if it's a linkpost, link it
				let extension = listing[0].url.substr(-4)
				if([".png", ".jpg", ".jpeg", ".gif"].includes(extension)) // if link is an image
					if(listing[0].over_18) {
						nsfwFlag = true
					} else {
						embed.setImage(listing[0].url)
					}
				} else { // otherwise
					embed.addField("Linkpost", `[${listing[0].url}](${listing[0].url})`)
				}
				msg.edit("", embed)
				if(nsfwFlag) { // naughty
					message.channel.send(new bot.discord.MessageAttachment(listing[0].url, "SPOILER_image" + listing[0].url.substr(-4)))
				}
			}
		subreddit = redditWrap.getSubreddit(subreddit)
		switch(sort) {
			case "hot":
				subreddit.getHot().then(listing => {
					handleListing(listing)
				})
				break
			case "new":
				subreddit.getNew().then(listing => {
					handleListing(listing)
				})
				break
			case "top":
				subreddit.getTop({time: "month"}).then(listing => {
					handleListing(listing)
				})
				break
		}
	},
	checkSyntax: (message, args) => {
		if(["hot", "new", "top"].includes(args[1])) {
			if(!args[2]) return "No subreddit name."
			if(args[3]) return "More arguments than expected."
		} else {
			if(!args[1]) return "No sort argument / subreddit name."
			if(args[2]) return "More arguments than expected."
		}
		return true
	}
}
