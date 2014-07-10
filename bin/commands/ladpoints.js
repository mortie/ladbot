var fs = require("fs");

var users;
var conf;

module.exports =
{
	"prefix": function(msg, sender, irc)
	{
		var command = msg.replace(/ladpoints(.+)?/i, "");
		var rest = msg.replace(/.+ladpoints\s+/i, "");
		var tokens = rest.split(/\s/i);
		var nick = tokens[0];

		irc.lookup(nick, function(account)
		{
			ladCommands(command, nick, account, sender, null, irc);
		});
	},

	"infix": function(msg, sender, irc)
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
			ladCommands(command, nick, account, sender, amount, irc);
		});
	},

	"init": function(irc, pConf)
	{
		conf = pConf;
		try {
			users = JSON.parse(fs.readFileSync(conf.usersFile));
		}
		catch (e)
		{
			users = {};
		}

		//build list of currently online people
		irc.client.on("names", function(channel, names)
		{
			var i;
			for (i in names)
			{
				irc.lookup(i, function(account)
				{
					if (account !== undefined && users[account] === undefined)
						users[account] = 0;
				});
			}
		});

		//handle new joins
		irc.client.on("join", function(channel, name)
		{
			irc.lookup(name, function(account)
			{
				if (account !== undefined && users[account] === undefined)
					users[account] = 0;
			});
		});
	}
}

function ladCommands(command, nick, account, sender, amount, irc)
{
	if (account)
	{
		switch (command)
		{
		case "?":
			irc.randomMessage("points",
			{
				"nick": nick,
				"points": users[account]
			});
			break;
		case "++":
			modifyPointCount("badLad", nick, account, sender, 1, irc);
			break;
		case "--":
			modifyPointCount("badLad", nick, account, sender, -1, irc);
			break;
		case "+=":
			modifyPointCount("goodLad", nick, account, sender, amount, irc);
			break;
		case "-=":
			modifyPointCount("badLad", nick, account, sender, -amount, irc);
			break;
		}
	}
	else
	{
		irc.randomMessage("unknownLad",
		{
			"nick": nick
		});
	}
}

function modifyPointCount(operation, nick, account, sender, amount, irc)
{
	if (nick !== sender)
	{
		if (Math.abs(amount) > conf.amountLimit)
		{
			if (amount < 0)
				var message = "aboveTakeLimit";
			else
				var message = "aboveGiveLimit";

			irc.randomMessage(message,
			{
				"nick": nick,
				"sender": sender,
				"amount": Math.abs(amount)
			});
		}
		else
		{
			users[account] += amount;

			irc.randomMessage(operation,
			{
				"nick": nick,
				"sender": sender
			});
			writeUsers();
		}
	}
	else
	{
		irc.randomMessage("modifySelf",
		{
			"nick": nick
		});
	}
}

function writeUsers()
{
	fs.writeFile(conf.usersFile,
	             JSON.stringify(users));
}
