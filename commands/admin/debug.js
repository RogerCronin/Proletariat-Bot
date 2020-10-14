const banner = require("banner-framework")
const fetch = require("node-fetch")
const url = require("url")

module.exports = new banner.Command({
  adminOnly: true,
  permissions: "",
  serverSpecific: false,
  aliases: [],
	name: "debug",
	title: "debug",
	description: "Private command only available to bot admins.",
	category: "admin",
	execute: async function(message, args) {
    
	},
	checkSyntax: function(message, args) {
    return true
  }
})
