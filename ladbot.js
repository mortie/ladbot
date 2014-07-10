#!/usr/bin/env node
var fs = require("fs");
var Irc = require("./bin/irc");
var commands = require("./bin/commands");

var conf = JSON.parse(fs.readFileSync("conf.json"));

var irc = new Irc(conf, function(sender, to, msg)
{
	var i;
	for (i in commands)
	{
		var command = commands[i];

		//if command should run, aka regex match
		if (command.regex !== undefined
		&&  msg.match(command.regex))
		{
			command(msg, sender, irc);
		}
	}
});

var i;
for (i in commands)
{
	var command = commands[i];

	if (command.init)
		command.init(irc, conf);
}
