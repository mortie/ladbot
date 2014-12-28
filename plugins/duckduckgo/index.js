module.exports =
{
	"methods":
	{
		"duck": function(msg, sender, api)
		{
			var query = msg.replace(/duck\s+"/i, "");
			query = query.substring(0, query.lastIndexOf("\""));

			var url = "http://duckduckgo.com/?q="+query.replace(/\ /g, "+");
			api.say(url);
		}
	}
}
