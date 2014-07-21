var conf;

module.exports = 
{
	"methods":
	{
		"lads": function(msg, sender, api)
		{
			var names = api.getNames();
			var str = "";

			var i;
			for (i in names)
			{
				if (i !== api.conf.nick && i !== sender)
					str += i+" ";
			}

			api.say(str);
		}
	}
}
