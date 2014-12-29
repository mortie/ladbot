var fs = require("fs");
var Api = require("./api.js");

var Plugin = function(dirName, api)
{
	this.api = api;

	this.info = JSON.parse(fs.readFileSync(dirName+"info.json"));
	var i;
	for (i in this.info.methods)
	{
		this.info.methods[i] = new RegExp(this.info.methods[i], "i");
	}

	this.script = require("../../"+dirName);
}

Plugin.prototype =
{
	"exec": function(msg, sender, api)
	{
		var i;
		for (i in this.info.methods)
		{
			var method = this.script.methods[i];
			var regex = this.info.methods[i];

			if (msg.match(regex))
				method(msg, sender, this.api);
		}
	},

	"init": function()
	{
		if (this.script.init !== undefined)
		{
			this.script.init(this.api);
		}
	}
}

module.exports =
{
	"loadPlugins": function(ref, conf, irc)
	{
		var entries = fs.readdirSync(conf.pluginsDir);
		entries.forEach(function(entry)
		{
			if (entry[0] !== "." && conf.disabledPlugins.indexOf(entry) === -1)
			{
				try
				{
					var plugin = new Plugin(conf.pluginsDir+entry+"/", new Api(conf, irc, entry));
					plugin.init();

					ref.push(plugin);
				}
				catch (e)
				{
					if (e.code !== "ENOTDIR")
						throw e;
				}
			}
		});
	}
}
