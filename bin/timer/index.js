module.exports =
{
	"setTimer": function(string, callback)
	{
		setTimeout(callback, this.stringToMilliseconds(string));
	},

	"stringToMilliseconds": function(str)
	{
		var tokens = str.split(/\s+/);
		var currentNumber = 0;
		var total = 0;

		var i;
		for (i in tokens)
		{
			var token = tokens[i];

			if (token.match(/\d+/))
				currentNumber = +token;
			else if (token.match(/second/i))
				total += currentNumber*1000;
			else if (token.match(/minute/i))
				total += currentNumber*1000*60;
			else if (token.match(/hour/i))
				total += currentNumber*1000*60*60;
			else if (token.match(/day/i))
				total += currentNumber*1000*60*60*24;
		}

		return total;
	}
}
