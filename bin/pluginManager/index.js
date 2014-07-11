var fs = require("fs");

var Plugin = function(path)
{
	this.info = JSON.parse(fs.readFileSync(path+"info.json"));
	var i;
	for (i in this.info.methods)
	{
		this.info.methods[i] = new RegExp(this.info.methods[i], "i");
	}

	this.script = require("../../"+path);
}

Plugin.prototype =
{
	"exec": function(msg, sender, irc)
	{
		var i;
		for (i in this.info.methods)
		{
			var method = this.script.methods[i];
			var regex = this.info.methods[i];

			if (msg.match(regex))
				method(msg, sender, irc);
		}
	},

	"init": function(conf, irc)
	{
		if (this.script.init !== undefined)
		{
			this.script.init(conf, irc);
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
			var plugin = new Plugin(conf.pluginsDir+entry+"/");
			plugin.init(conf, irc);

			ref.push(plugin);
		});
	}
}
