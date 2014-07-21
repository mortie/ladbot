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
