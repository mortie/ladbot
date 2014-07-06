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
			ladCommands(command, nick, account, from);
		});
	}
	else if (msg.match(/ladpoints\s+[\+\-]\=\s+\d+\s+[^\s]+/))
	{
		//ladpoints {command} {amount} {nick}
		var command = msg.replace(/ladpoints\s+/, "")
		                 .replace(/\s+\d+\s+[^\s]+/, "")
		                 .trim();
		var amount = +msg.replace(/ladpoints\s+[\+\-]\=\s+/, "")
		                .replace(/\s+[^\s]+/, "")
		                .trim();
		var nick = msg.replace(/ladpoints\s+[\+\-]\=\s+\d+\s+/, "")
		              .trim();

		irc.lookup(nick, function(account)
		{
			ladCommands(command, nick, account, from, amount);
		});
	}
	else if (msg == "lads")
	{
		var names = irc.getNames();
		var str = "";

		var i;
		for (i in names)
		{
			if (i !== conf.nick)
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
			irc.say(randomMessage("aboveAmountLimit",
			{
				"nick": nick,
				"sender": sender,
				"amount": amount
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

