module.exports =
{
	"methods":
	{
		"google": function(msg, sender, api)
		{
			var query = msg.replace(/google\s+"/i, "");
			query = query.substring(0, query.lastIndexOf("\""));

			var url = "http://google.com/search?q="+query.replace(/\ /g, "+");
			api.say(url);
		}
	}
}
