var irc = require("irc");
var fs = require("fs");

module.exports = function(conf, callback)
{
	this._conf = conf;

	//instantiate an IRC client
	this._client = new irc.Client(this._conf.server, this._conf.nick, 
	{
		"channels": [conf.channel]
	});

	//do things on message
	this._client.on("message", function(from, to, msgText)
	{
		callback(from, to, msgText);
	});

	this._client.on("error", function(){});

	this.on = this._client.on;
}

module.exports.prototype =
{
	"say": function(txt)
	{
		this._client.say(this._conf.channel, txt);
	},

	"randomMessage": function(messageFile, args)
	{
		var messages = fs.readFileSync(messageFile, "utf8")
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
		this._client.whois(nick, function(info)
		{
			callback(info.account);
		});
	},

	"getNames": function()
	{
		return this._client.chans[this._conf.channel].users;
	},
}
