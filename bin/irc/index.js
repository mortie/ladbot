var irc = require("irc");
var fs = require("fs");

module.exports = function(conf, callback)
{
	this._conf = conf;
	this.dest = this._conf.channel;
	var registered = false;

	console.log("Connecting to "+conf.options.channels.join()+"@"+conf.server+" ...");

	//instantiate an IRC client
	this._client = new irc.Client(conf.server, conf.nick, conf.options);

	//say when connected
	this._client.on("registered", function(message)
	{
		console.log("Connected!");
		registered = true;
	});

	//time out connection
	setTimeout(function()
	{
		if (!registered)
		{
			console.log("Connection timed out.");
			process.exit();
		}
	}, conf.timeOut);

	//do things on message
	this._client.on("message", function(from, to, msgText)
	{
		callback(from, to, msgText);
	});

	this._client.on("error", function(err)
	{
		console.log("Error: "+err.args[2]+" ("+err.command+")");
	});

	this.on = this._client.on;
}

module.exports.prototype =
{
	"setLocation": function(dest)
	{
		this.dest = dest;
	},

	"say": function(txt)
	{
		this._client.say(this.dest, txt);
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

	"getNames": function(chan)
	{
		return this._client.chans[chan.toLowerCase()].users;
	},
}
