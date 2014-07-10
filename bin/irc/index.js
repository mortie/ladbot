var irc = require("irc");
var fs = require("fs");

module.exports = function(conf, callback)
{
	this.conf = conf;
	this.afkUsers = [];

	try {
		this.users = JSON.parse(fs.readFileSync(this.conf.usersFile));
	}
	catch (e)
	{
		this.users = {};
	}
	
	//instantiate an IRC client
	this.client = new irc.Client(this.conf.server, this.conf.nick, 
	{
		"channels": [conf.channel]
	});

	//do things on message
	this.client.on("message", function(from, to, msgText)
	{
		callback(from, to, msgText);
	});

	this.client.on("error", function(){});
}

module.exports.prototype =
{
	"say": function(txt)
	{
		this.client.say(this.conf.channel, txt);
	},

	"randomMessage": function(messageFile, args)
	{
		var messages = fs.readFileSync(this.conf.messagesDir+messageFile, "utf8")
						 .split("\n")
						 .filter(function(n) { return n != "" } );
		var message = messages[Math.floor(Math.random()*messages.length)];

		var i;
		for (i in args)
		{
			message = message.split("{"+i+"}").join(args[i]);
		}

		this.say(message);
	},

	"lookup": function(nick, callback)
	{
		this.client.whois(nick, function(info)
		{
			callback(info.account);
		});
	},

	"getNames": function()
	{
		return this.client.chans[this.conf.channel].users;
	},
}
