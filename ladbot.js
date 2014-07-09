#!/usr/bin/env node
var fs = require("fs");
var math = require("mathjs");
var Irc = require("./bin/irc");
var timer = require("./bin/timer");
var conversion = require("./bin/conversion");

var conf = JSON.parse(fs.readFileSync("conf.json"));

var irc = new Irc(conf, function(sender, to, msg)
{

	//?ladpoints
	//++ladpoints
	//--ladpoints
	if (msg.match(/^[^\s]+ladpoints/i))
	{
		var command = msg.replace(/ladpoints(.+)?/i, "");
		var rest = msg.replace(/.+ladpoints\s+/i, "");
		var tokens = rest.split(/\s/i);
		var nick = tokens[0];

		irc.lookup(nick, function(account)
		{
			ladCommands(command, nick, account, sender);
		});
	}

	//ladpoints += [amount] [nick]
	//ladpoints -= [amount] [nick]
	else if (msg.match(/^ladpoints\s+(\-|\+)\=\s+\d+\s+[^\s]+/i))
	{
		var command = msg.replace(/ladpoints\s+/i, "")
		                 .replace(/\s+\d+\s+[^\s]+/i, "")
		                 .trim();
		var amount = +msg.replace(/ladpoints\s+(\-|\+)\=\s+/i, "")
		                .replace(/\s+[^\s]+/i, "")
		                .trim();
		var nick = msg.replace(/ladpoints\s+(\+|\-)\=\s+\d+\s+/i, "")
		              .trim();

		irc.lookup(nick, function(account)
		{
			ladCommands(command, nick, account, sender, amount);
		});
	}

	//calc [expresion]
	else if (msg.match(/^calc.+/i))
	{
		var mathString = msg.replace(/calc\s+/i, "");
		try
		{
			irc.say(math.eval(mathString));
		}
		catch (e)
		{
			irc.say(randomMessage("badCalc",
			{
				"math": mathString
			}));
		}
	}

	//convert [num] to base [base]
	else if (msg.match(/[^\d]+to\s+base[^\d]+\d+/i))
	{
		var parsed = conversion.base.parse(msg);

		try
		{
			var result = conversion.base.toBase(parsed.base, parsed.number);
		}
		catch (e)
		{
			irc.say(randomMessage("badBaseConvert",
			{
				"nick": sender,
				"number": parsed.number,
				"base": parsed.base
			}));
		}

		irc.say(result);
	}

	//afk
	else if (msg.match(/^afk/i))
	{
		irc.say(randomMessage("afk",
		{
			"nick": sender 
		}));

		irc.addAfk(sender);
	}

	//back from afk
	else if (irc.isAfk(sender))
	{
		irc.say(randomMessage("back",
		{
			"nick": sender
		}));

		irc.removeAfk(sender);
	}

	//message contains afk user
	else if (irc.containsAfkUser(msg))
	{
		var u = irc.getAfkUsers(msg);

		var i;
		for (i in u)
		{
			irc.say(randomMessage("isAfk",
			{
				"nick": u[i],
				"sender": sender
			}));
		}
	}

	//set timer [time]
	else if (msg.match(/^(timer|set.+timer).+(second|minute|hour|day)/i))
	{
		var duration = timer.parseString(msg);
		var prettyDuration = timer.prettyDuration(duration);

		irc.say(randomMessage("timerStart",
		{
			"nick": sender,
			"duration": prettyDuration
		}));

		timer.setTimer(duration, function()
		{
			irc.say(randomMessage("timerEnd",
			{
				"nick": sender,
				"duration": prettyDuration
			}));
		}.bind(sender, prettyDuration));
	}

	//lads
	else if (msg.match(/^lads$/i))
	{
		var names = irc.getNames();
		var str = "";

		var i;
		for (i in names)
		{
			if (i !== conf.nick && i !== sender)
				str += i+" ";
		}

		irc.say(str);
	}
});

function ladCommands(command, nick, account, sender, amount)
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
			modifyPointCount("badLad", nick, account, sender, 1);
			break;
		case "--":
			modifyPointCount("badLad", nick, account, sender, -1);
			break;
		case "+=":
			modifyPointCount("goodLad", nick, account, sender, amount);
			break;
		case "-=":
			modifyPointCount("badLad", nick, account, sender, -amount);
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
}

function modifyPointCount(operation, nick, account, sender, amount)
{
	if (nick !== sender)
	{
		if (Math.abs(amount) > conf.amountLimit)
		{
			if (amount < 0)
				var message = "aboveTakeLimit";
			else
				var message = "aboveGiveLimit";

			irc.say(randomMessage(message,
			{
				"nick": nick,
				"sender": sender,
				"amount": Math.abs(amount)
			}));
		}
		else
		{
			irc.users[account] += amount;

			irc.say(randomMessage(operation,
			{
				"nick": nick,
				"sender": sender
			}));
			irc.writeUsers();
		}
	}
	else
	{
		irc.say(randomMessage("modifySelf",
		{
			"nick": nick
		}));
	}
}

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
