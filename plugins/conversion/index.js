var http = require("http");

var charMap = ["0", "1", "2", "3", "4", "5",
               "6", "7", "8", "9", "A", "B",
               "C", "D", "E", "F", "G", "H",
               "I", "J", "K", "L", "M", "N",
               "O", "P", "Q", "R", "S", "T",
               "U", "V", "W", "X", "Y", "Z"];


module.exports =
{
	"methods":
	{
		"base": function(msg, sender, api)
		{
			var parsed = parseBase(msg);

			try
			{
				var result = toBase(parsed.fromBase, parsed.toBase, parsed.number);
			}
			catch (e)
			{
				api.randomMessage("badBaseConvert",
				{
					"nick": sender,
					"number": parsed.number,
					"fromBase": parsed.fromBase,
					"toBase": parsed.toBase
				});
			}

			api.say(result);
		},

		"currency": function(msg, sender, api)
		{
			var tokens = msg.split(/\s+/);

			var fromCurrencyNext = true;

			var fromCurrency;
			var toCurrency;
			var amount = 1;
			tokens.forEach(function(token)
			{
				if (token.match(/[A-Z]{1,4}/))
					if (fromCurrencyNext)
						fromCurrency = token;
					else
						toCurrency = token;
				else if (token.match("to"))
					fromCurrencyNext = false;
				else if (token.match(/[0-9]+(\.[0-9]+)?/))
					amount = parseFloat(token);
			});

			http.request(
			{
				"host": "www.freecurrencyconverterapi.com",
				"path": "/api/convert?q="+fromCurrency+"-"+toCurrency+"&compact=y"
			},
			function(response)
			{
				var str = "";
				response.on("data", function(data)
				{
					if (data)
						str += data;
				});

				response.on("end", function()
				{
					var result = amount*JSON.parse(str)[fromCurrency+"-"+toCurrency].val;
					api.randomMessage("currencyConvert",
					{
						"from": fromCurrency,
						"to": toCurrency,
						"input": amount,
						"result": parseFloat(result).toFixed(2)
					});
				});
			}).end();
		}
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
