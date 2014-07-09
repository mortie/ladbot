module.exports =
{
	"setTimer": function(msec, callback)
	{
		setTimeout(callback, msec);
	},

	"parseString": function(str)
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
	},

	"prettyDuration": function(msec)
	{
		var x;

		x = msec / 1000
		var seconds = Math.floor(x % 60);

		x /= 60
		var minutes = Math.floor(x % 60);

		x /= 60
		var hours = Math.floor(x % 24);

		x /= 24
		var days = Math.floor(x);

		var str = "";
		if (days > 0)    str += timeStringPart(days, "day");
		if (hours > 0)   str += timeStringPart(hours, "hour");
		if (minutes > 0) str += timeStringPart(minutes, "minute");
		if (seconds > 0) str += timeStringPart(seconds, "second");

		return str.substring(0, str.length-1);
	}
}

function timeStringPart(time, unit)
{
	if (time === 1)
		return time+" "+unit+" ";
	else
		return time+" "+unit+"s ";
}
