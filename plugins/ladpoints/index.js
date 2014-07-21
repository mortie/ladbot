var users;

module.exports =
{
	"methods":
	{
		"prefix": function(msg, sender, api)
		{
			var command = msg.replace(/ladpoints(.+)?/i, "");
			var rest = msg.replace(/.+ladpoints\s+/i, "");
			var tokens = rest.split(/\s/i);
			var nick = tokens[0];

			api.lookup(nick, function(account)
			{
				ladCommands(command, nick, account, sender, null, api);
			});
		},

		"infix": function(msg, sender, api)
		{
			var command = msg.replace(/ladpoints\s+/i, "")
			                 .replace(/\s+\d+\s+[^\s]+/i, "")
							 .trim();
			var amount = +msg.replace(/ladpoints\s+(\-|\+)\=\s+/i, "")
			                 .replace(/\s+[^\s]+/i, "")
			                 .trim();
			var nick = msg.replace(/ladpoints\s+(\+|\-)\=\s+\d+\s+/i, "")
			              .trim();

			api.lookup(nick, function(account)
			{
				ladCommands(command, nick, account, sender, amount, api);
			});
		}
	},

	"init": function(api)
	{
		try {
			users = JSON.parse(api.readFileSync("users.json"));
		}
		catch (e)
		{
			users = {};
		}

		//build list of currently online people
		api.on("names", function(channel, names)
		{
			var i;
			for (i in names)
			{
				api.lookup(i, function(account)
				{
					if (account !== undefined && users[account] === undefined)
						users[account] = 0;
				});
			}
		});

		//handle new joins
		api.on("join", function(channel, name)
		{
			api.lookup(name, function(account)
			{
				if (account !== undefined && users[account] === undefined)
					users[account] = 0;
			});
		});
	}
}

function ladCommands(command, nick, account, sender, amount, api)
{
	if (account)
	{
		switch (command)
		{
		case "?":
			api.randomMessage("points",
			{
				"nick": nick,
				"points": users[account]
			});
			break;
		case "++":
			modifyPointCount("goodLad", nick, account, sender, 1, api);
			break;
		case "--":
			modifyPointCount("badLad", nick, account, sender, -1, api);
			break;
		case "+=":
			modifyPointCount("goodLad", nick, account, sender, amount, api);
			break;
		case "-=":
			modifyPointCount("badLad", nick, account, sender, -amount, api);
			break;
		}
	}
	else
	{
		api.randomMessage("unknownLad",
		{
			"nick": nick
		});
	}
}

function modifyPointCount(operation, nick, account, sender, amount, api)
{
	if (nick !== sender)
	{
		if (Math.abs(amount) > 10)
		{
			if (amount < 0)
				var message = "aboveTakeLimit";
			else
				var message = "aboveGiveLimit";

			api.randomMessage(message,
			{
				"nick": nick,
				"sender": sender,
				"amount": Math.abs(amount)
			});
		}
		else
		{
			users[account] += amount;

			api.randomMessage(operation,
			{
				"nick": nick,
				"sender": sender
			});
			writeUsers(api);
		}
	}
	else
	{
		api.randomMessage("modifySelf",
		{
			"nick": nick
		});
	}
}

function writeUsers(api)
{
	api.writeFile("users.json",
	             JSON.stringify(users));
}
