module.exports =
{
	"methods":
	{
		"link": function(msg, sender, api)
		{
			var link = msg.match(/\/r\/\S+/i);

			api.say("http://reddit.com"+link);
		}
	}
}
