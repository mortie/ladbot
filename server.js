#!/usr/bin/env node
var childProcess = require("child_process");

var child = childProcess.spawn("node", ["bot.js"], {
	cwd: __dirname,
	stdio: ["inherit", "pipe", "inherit"]
});

var pingPending = false;

//Set ping pending to true on an interval, and kill the child
setInterval(function() {
	pingPending = true;

	child.kill("SIGUSR2");

	setTimeout(function() {
		if (pingPending) {
			console.log("Process didn't respond to ping. Exiting.");
			child.kill("SIGKILL");
			process.exit();
		}
	}, 3000);
}, 10000);

//Set ping pending to false whenever process responds with "pong"
child.stdout.on("data", function(d) {
	var str = d.toString().trim();
	if (str === "pong")
		pingPending = false;
	else
		console.log(str);
});

child.on("exit", function() {
	console.log("Child died. Exiting.");
	process.exit();
});
