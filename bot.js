#!/usr/bin/env node
var fs = require("fs");
var Irc = require("./bin/irc");
var conf = JSON.parse(fs.readFileSync("conf.json"));
var pluginManager = require("./bin/pluginManager");

var plugins = [];

//initiate IRC
var irc = new Irc(conf, function(sender, to, msg)
{
	plugins.forEach(function(plugin)
	{
		plugin.exec(msg, sender);
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

		console.log("reload complete");
		break;
	}
});
