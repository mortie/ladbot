var afkUsers = [];

module.exports =
{
	"start": function(msg, sender, irc)
	{
		irc.randomMessage("afk",
		{
			"nick": sender
		});

		if (afkUsers.indexOf(sender) === -1)
			afkUsers.push(sender);
	},

	"back": function(msg, sender, irc)
	{
		var i = afkUsers.indexOf(sender);
		if (i !== -1)
		{
			afkUsers = afkUsers.slice(i, 1);

			irc.randomMessage("back",
			{
				"nick": sender
			});
		}
	},

	"messageContainsUser": function(msg, sender, irc)
	{
		var u = getAfkUsers(msg);

		if (u)
		{
			var u = getAfkUsers(msg);

			var i;
			for (i in u)
			{
				irc.randomMessage("isAfk",
				{
					"nick": u[i],
					"sender": sender
				});
			}
		}
	},

	"init": function(irc, conf)
	{
		irc.client.on("quit", function(nick)
		{
			var i = afkUsers.indexOf(nick);

			if (i !== -1)
				afkUsers.splice(i, 1);
		});
	}
}

function getAfkUsers(msg)
{
	var u = [];

	var i;
	for (i in afkUsers)
	{
		if (msg.match(afkUsers[i]))
			u.push(afkUsers[i]);
	}

	return u;
}
