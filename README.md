LadBot
======

A bot for keeping track of users' ladpoints in an IRC channel. It's written in node.js, and uses [Martyn Smith's node-irc module](https://github.com/martynsmith/node-irc).

Ladpoints are intended to be given to people when they do something great. When they do something stupid, you take away some of their ladpoints.

### Use:

* **?ladpoints [user]**:  
  Display the ladpoints for a user.
* **++ladpoitns [user]**:  
  Increment a user's ladpoint count.
* **--ladpoints [user]**:  
  Decrement a user's ladpoint count.
* **ladpoints += [amount] [user]**:  
  Increase [user]'s ladpoints by [amount].
* **ladpointns -= [amount] [user]**:  
  Decrease [user]'s ladpoints by [amount].

Only users who are registered and identified with nickserv can have ladpoints.

In addittion to ladpoints, it has some useful utilities:

* **calc [math expression]**:  
  Calculate a math expression. Uses [mathjs](http://mathjs.org).
* **[number] to base [base]** or **[number] from [base] to [base]:
  Convert a number to another base. It supports all bases between 2 and 36.
* **afk**:  
  Flags you as afk. If someone mentions your name while you're gone, the bot will notify them that you're away. Once you say something, you'll no longer be flagged as afk.
* **timer**:
  Notify you after a set time. You can specify the time in a pretty natural way, for example:
	* `Set a timer for 1 day and 3 hours`
	* `Timer 10 seconds`
	* `Set timer for 0.5 days, 4 minutes and 55 seconds`

## Contribute:

If you want to contribute to this project, but don't know a lot about programming, or don't feel like programming, you can add messages which the bot will say. Each plugin in the [plugin directory](https://github.com/mortie/LadBot/tree/master/plugins) has a "messages" folder, in which almost all the strings the bot will ever say are stored.

If you know programming on the other hand, it's basically the same as ith any other open source project: add features, clean up code, optimise, etc.
