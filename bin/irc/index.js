var irc = require("irc");
var fs = require("fs");

module.exports = function(conf, callback)
{
	this.conf = conf;

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

	//handle new joins
	this.client.on("join", function(channel, name)
	{
		this.lookup(name, function(account)
		{
			if (account !== undefined && this.users[account] === undefined)
				this.users[account] = 0;
		}.bind(this));
	}.bind(this));

	//build list of currently online people
	this.client.on("names", function(channel, names)
	{
		var i;
		for (i in names)
		{
			this.lookup(i, function(account)
			{
				if (account !== undefined && this.users[account] === undefined)
					this.users[account] = 0;
			}.bind(this));
		}
	}.bind(this));

	this.client.on("error", function(){});
}

module.exports.prototype =
{
	"say": function(txt)
	{
		this.client.say(this.conf.channel, txt);
	},

	"writeUsers": function()
	{
		fs.writeFile(this.conf.usersFile,
		             JSON.stringify(this.users));
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
	}
}
