var http = require("http");

module.exports =
{
	"methods":
	{
		"shorten": function(msg, sender, api)
		{
			var url = msg.split(/\s+/)[0];

			//don't shorten short links
			if (url.length < 25)
				return;

			http.get(
			{
				"method": "GET",
				"host": "xeo.la",
				"path": "/url/?url="+url
			},
			function(res)
			{
				var str = "";

				res.on("data", function(data)
				{
					str += data;
				});

				res.on("end", function()
				{
					api.say(str);
				});
			});
		}
	}
}
