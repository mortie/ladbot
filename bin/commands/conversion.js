var charMap = ["0", "1", "2", "3", "4", "5",
               "6", "7", "8", "9", "A", "B",
               "C", "D", "E", "F", "G", "H",
               "I", "J", "K", "L", "M", "N",
               "O", "P", "Q", "R", "S", "T",
               "U", "V", "W", "X", "Y", "Z"]


module.exports =
{
	"base": function(msg, sender, irc)
	{
		var parsed = parseBase(msg);

		try
		{
			var result = toBase(parsed.fromBase, parsed.toBase, parsed.number);
		}
		catch (e)
		{
			console.log(e);
			irc.randomMessage("badBaseConvert",
			{
				"nick": sender,
				"number": parsed.number,
				"fromBase": parsed.fromBase,
				"toBase": parsed.toBase
			});
		}

		irc.say(result);
	}
}

function parseBase(str)
{
	var nextBase = "";
	var next = "";

	var tokens = str.split(/\s+/);
	var fromBase = 10;
	var toBase = 10;
	var num = 0;

	var i;
	for (i in tokens)
	{
		var token = tokens[i];

		if (token.match(/^\d+$/))
		{
			if (nextBase == "from")
				fromBase = +token;
			else if (nextBase == "to")
				toBase = +token;
			else
				num = +token;
		}
		else if (token.match(/^from$/i))
		{
			next = "from";
		}
		else if (token.match(/^to$/i))
		{
			next = "to";
		}
		else if (token.match(/^base$/i))
		{
			if (next == "from")
				nextBase = "from";
			else if (next == "to")
				nextBase = "to";
		}
	}

	var ret =
	{
		"fromBase": fromBase,
		"toBase": toBase,
		"number": num
	}

	return ret;
}

function toBase(fromBase, toBase, num)
{
	num = parseInt(num, fromBase);

	if (toBase > 36 || toBase < 2)
		throw new Error("Base out of bounds");

	var i;
	var reverseCharCodes = [];

	do
	{
		reverseCharCodes.push(num % toBase);
		num = Math.floor(num/toBase);
	}
	while (num > 0);

	var digitString = "";
	for (i in reverseCharCodes)
	{
		digitString = charMap[reverseCharCodes[i]]+digitString;
	}

	return digitString; 
}
