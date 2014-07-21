var afkUsers = [];

module.exports =
{
	"methods":
	{
		"start": function(msg, sender, api)
		{
			api.randomMessage("start",
			{
				"nick": sender
			});

			if (afkUsers.indexOf(sender) === -1)
			{
				var i = afkUsers.indexOf(undefined);
				if (i === -1)
					afkUsers.push(sender);
				else
					afkUsers[i] = sender;
			}
		},

		"end": function(msg, sender, api)
		{
			var i = afkUsers.indexOf(sender);
			if (i !== -1)
			{
				afkUsers[i] = undefined;

				api.randomMessage("end",
				{
					"nick": sender
				});
			}
		},

		"messageContainsUser": function(msg, sender, api)
		{
			var u = getAfkUsers(msg);

			if (u)
			{
				var u = getAfkUsers(msg);

				var i;
				for (i in u)
				{
					api.randomMessage("isAfk",
					{
						"nick": u[i],
						"sender": sender
					});
				}
			}
		}
	},

	"init": function(api)
	{
		api.on("quit", function(nick)
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
		if (afkUsers[i] !== undefined && msg.match(afkUsers[i]))
			u.push(afkUsers[i]);
	}

	return u;
}
