#!/usr/bin/env node
var fs = require("fs");
var domain = require("domain");
var Irc = require("./bin/irc");
var conf = JSON.parse(fs.readFileSync("conf.json"));
var pluginManager = require("./bin/pluginManager");

var plugins = [];

//initiate IRC
var irc = new Irc(conf, function(sender, to, msg)
{
	plugins.forEach(function(plugin)
	{
		try
		{
			plugin.exec(msg, sender, to);
		}
		catch (err)
		{
			console.log("Error from plugin '"+plugin.name+"': "+err);
		}
	});
});

pluginManager.loadPlugins(plugins, conf, irc);

process.stdin.resume();
process.stdin.setEncoding("utf8");
process.stdin.on("data", function(line)
{
	var tokens = line.split(/\s+/);
	var command = tokens[0];

	switch (command)
	{
	case "reload":
		var conf = JSON.parse(fs.readFileSync("conf.json"));
		plugins = [];
		pluginManager.loadPlugins(plugins, conf, irc);

		console.log("Reload complete.");
		break;
	default:
		console.log("Unknown command: "+command+".");
	}
});

//don't crash on unhandled exception
var d = domain.create();
d.on("error", function(err)
{
	console.log(err);
});

//again, don't crash!
process.on("uncaughtException", function(err)
{
	console.log(err);
});
