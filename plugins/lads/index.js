var conf;

module.exports = 
{
	"methods":
	{
		"lads": function(msg, sender, irc)
		{
			var names = irc.getNames();
			var str = "";

			var i;
			for (i in names)
			{
				if (i !== conf.nick && i !== sender)
					str += i+" ";
			}

			irc.say(str);
		}
	},

	"init": function(pConf, irc)
	{
		conf = pConf;
	}
}
