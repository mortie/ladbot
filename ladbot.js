#!/usr/bin/env node
var fs = require("fs");
var Irc = require("./bin/irc");

var conf = JSON.parse(fs.readFileSync("conf.json"));

function randomMessage(messageFile, args)
{
	var messages = fs.readFileSync(conf.messagesDir+messageFile, "utf8")
	                 .split("\n")
	                 .filter(function(n) { return n != "" } );
	var message = messages[Math.floor(Math.random()*messages.length)];

	var i;
	for (i in args)
	{
		message = message.split("{"+i+"}").join(args[i]);
	}

	return message;
}

var irc = new Irc(conf, function(from, to, msg)
{
	if (msg.match(/[^\s]+ladpoints/))
	{
		var command = msg.replace(/ladpoints(.+)?/, "");
		var rest = msg.replace(/.+ladpoints\s+/, "");
		var tokens = rest.split(/\s/);
		var nick = tokens[0];

		irc.lookup(nick, function(account)
		{
			if (account)
			{
				switch (command)
				{
					case "?":
						irc.say(randomMessage("points",
						{
							"nick": nick,
							"points": irc.users[account]
						}));
						break;
					case "++":
						++irc.users[account];
						irc.say(randomMessage("goodLad",
						{
							"nick": nick
						}));
						irc.writeUsers();
						break;
					case "--":
						--irc.users[account];
						irc.say(randomMessage("badLad",
						{
							"nick": nick
						}));
						irc.writeUsers();
						break;
				}
			}
			else
			{
				irc.say(randomMessage("unknownLad",
				{
					"nick": nick
				}));
			}
		});
	}
});
