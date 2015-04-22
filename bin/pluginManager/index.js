var fs = require("fs");
var Api = require("./api.js");
var parseconf = require("../parseconf");

var Plugin = function(conf, name, irc)
{
	console.log("Loading plugin '"+name+"'...");
	var dirName = conf.pluginsDir+"/"+name+"/";

	this.irc = irc;
	this.name = name;
	this.conf = conf;

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
	"exec": function(msg, sender, to)
	{
		var i;
		for (i in this.info.methods)
		{
			var method = this.script.methods[i];
			var regex = this.info.methods[i];

			if (msg.match(regex))
			{
				if (("&#").indexOf(to.substr(0,1)) != -1)
					var dest = to;
				else
					var dest = sender;
				method(msg, sender, new Api(this.conf, this.irc, this.name, dest));
			}
		}
	},

	"init": function(conf, irc, entry)
	{
		if (this.script.init !== undefined)
		{
			this.script.init(new Api(conf, irc, entry));
		}
	}
}

module.exports =
{
	"loadPlugins": function(ref, conf, irc)
	{
		var entries = fs.readdirSync(conf.pluginsDir).filter(function(file)
		{
			return fs.statSync(conf.pluginsDir+'/'+file).isDirectory();
  		});
		entries.forEach(function(entry)
		{
			if (entry[0] !== "." && conf.disabledPlugins.indexOf(entry) === -1)
			{
				try
				{
					var plugin = new Plugin(conf, entry, irc);
					plugin.init(conf, irc, entry);

					ref.push(plugin);
				}
				catch (e)
				{
					console.log(e);
					if (!(e.code === "ENOTDIR" || e.code === "ENOENT"))
						throw e;
				}
			}
		});
	}
}
