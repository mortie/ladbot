module.exports = function(msg, sender, irc)
{
	var names = irc.getNames();
	var str = "";

	var i;
	for (i in names)
	{
		if (i !== irc.conf.nick && i !== sender)
			str += i+" ";
	}

	irc.say(str);
}
