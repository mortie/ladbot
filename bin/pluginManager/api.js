var fs = require("fs");
var http = require("http");
var request = require("request");

module.exports = function(conf, irc, name)
{
	this.conf = conf;
	this.irc = irc;
	this.name = name;
	this.on = irc.on;
}

module.exports.prototype =
{
	"setLocation": function(dest)
	{
		this.irc.setLocation(dest);
	},

	"say": function(text)
	{
		console.log("Plugin "+this.name+": "+text);
		this.irc.say(text);
	},

	"randomMessage": function(messageFile, args)
	{
		this.irc.randomMessage(this.conf.pluginsDir+this.name+"/messages/"+messageFile, args);
	},

	"lookup": function(nick, callback)
	{
		this.irc.lookup(nick, callback);
	},

	"getNames": function(chan)
	{
		return this.irc.getNames(chan);
	},

	"writeFile": function(file, data, callback)
	{
		fs.writeFile(this.conf.pluginsDir+this.name+"/"+file, data, callback);
	},

	"writeFileSynC": function(file, data)
	{
		return fs.writeFileSync(this.conf.pluginsDir+this.name+"/"+file, data);
	},

	"readFile": function(file, callback)
	{
		fs.readFile(this.conf.pluginsDir+this.name+"/"+file, callback);
	},

	"readFileSync": function(file)
	{
		return fs.readFileSync(this.conf.pluginsDir+this.name+"/"+file);
	},

	"request": request
}
