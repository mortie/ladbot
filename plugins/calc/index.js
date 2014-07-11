var math = require("mathjs");

module.exports =
{
	"methods":
	{
		"calc": function(msg, sender, irc)
		{
			var mathString = msg.replace(/calc\s+/i, "");
			try
			{
				irc.say(math.eval(mathString));
			}
			catch (e)
			{
				irc.randomMessage("badCalc",
				{
					"math": mathString
				});
			}
		}
	}
}
