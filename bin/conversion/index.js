var charMap = ["0", "1", "2", "3", "4", "5",
               "6", "7", "8", "9", "A", "B",
               "C", "D", "E", "F", "G", "H",
               "I", "J", "K", "L", "M", "N",
               "O", "P", "Q", "R", "S", "T",
               "U", "V", "W", "X", "Y", "Z"]

module.exports =
{
	"base":
	{
		"parse": function(str)
		{
			var baseNext = false;
			var tokens = str.split(/\s+/);
			var base = 10;
			var num = 0;

			var i;
			for (i in tokens)
			{
				var token = tokens[i];

				if (baseNext && token.match(/^\d+$/))
					base = +token;
				else if (token.match(/^\d+$/))
					num = +token;
				else if (token.match(/^base$/i))
					baseNext = true;
			}

			var ret =
			{
				"base": base,
				"number": num
			}

			return ret;
		},

		"toBase": function(base, num)
		{
			if (base > 36 || base < 2)
				throw new Error("Base out of bounds");

			var i;
			var reverseCharCodes = [];

			while (num > 0)
			{
				reverseCharCodes.push(num % base);
				num = Math.floor(num/base);
			}

			var digitString = "";
			for (i in reverseCharCodes)
			{
				digitString = charMap[reverseCharCodes[i]]+digitString;
			}

			return digitString;
		}
	}
}
