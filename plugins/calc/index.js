var math = require("mathjs");

module.exports =
{
	"methods":
	{
		"calc": function(msg, sender, api)
		{
			var mathString = msg.replace(/calc\s+/i, "");
			try
			{
				api.say(math.eval(mathString));
			}
			catch (e)
			{
				api.randomMessage("badCalc",
				{
					"math": mathString
				});
			}
		}
	}
}
