var fs = require("fs");
var Api = require("./api.js");
var parseconf = require("../parseconf");

var Plugin = function(pluginsDir, name, api)
{
	console.log("Loading plugin '"+name+"'...");

	var dirName = pluginsDir+"/"+name+"/";

	this.api = api;
	this.name = name;

	this.info = 
	{
		"methods": parseconf(fs.readFileSync(dirName+"methods.cnf").toString())
	};

	var i;
	for (i in this.info.methods)
	{
		this.info.methods[i] = new RegExp(this.info.methods[i], "i");
	}

	var fileName = "../../"+dirName;

	delete require.cache[require.resolve(fileName)];
	this.script = require(fileName);
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
					var plugin = new Plugin(conf.pluginsDir, entry, new Api(conf, irc, entry));
					plugin.init();

					ref.push(plugin);
				}
				catch (e)
				{
					if (!(e.code === "ENOTDIR" || e.code === "ENOENT"))
						throw e;
				}
			}
		});
	}
}
