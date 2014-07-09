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
* **convert [number] to base [base]**:
  Convert a number to another base. It supports all bases between 2 and 36.
* **afk**:  
  Flags you as afk. If someone mentions your name while you're gone, the bot will notify them that you're away. Once you say something, you'll no longer be flagged as afk.
* **timer**:
  Notify you after a set time. You can specify the time in a pretty natural way, for example:
	* `Set a timer for 1 day and 3 hours`
	* `Timer 10 seconds`
	* `Set timer for 0.5 days, 4 minutes and 55 seconds`

## Contribute:

If you want to contribute to this project, but don't know a lot about programming, or don't feel like programming, you can add random messages.

* **[messages/goodLad](https://github.com/mortie/LadBot/blob/master/messages/goodLad)**:  
  Messages displayed when someone increments {nick}'s ladpoint count.

* **[messages/badLad](https://github.com/mortie/LadBot/blob/master/messages/badLad)**:  
  Messages displayed when someone decrements {nick}'s ladpoint count.

* **[messages/points](https://github.com/mortie/LadBot/blob/master/messages/points)**:  
  Messages displayed when someone wants {nick}'s ladpoint count.

* **[messages/unknownLad](https://github.com/mortie/LadBot/blob/master/messages/unknownLad)**:  
  Messages displayed when someone tries to do somethnig with a lad which doesn't exist, or isn't registered.

* **[messages/modifySelf](https://github.com/mortie/LadBot/blob/master/messages/modifySelf)**:  
  Messages displayed when {nick} tries to modify their own ladpoint count.

* **[messages/aboveGiveLimit](https://github.com/mortie/LadBot/blob/master/messages/aboveGiveLimit)**:  
  Messages displayed when {sender} tries to give too many ladpoints to {nick}.

* **[messages/aboveTakeLimit](https://github.com/mortie/LadBot/blob/master/messages/aboveTakeLimit)**:
  Messages displayed when {sender} tries to take too many ladpoints from {nick}.

* **[messages/badMath](https://github.com/mortie/LadBot/blob/master/messages/badCalc)**:  
  Messages displayed when given a bad {math} string for calc.

* **[messages/afk](https://github.com/mortie/LadBot/blob/master/messages/afk)**:  
  Messages displayed when {nick} goes afk.

* **[messages/back](https://github.com/mortie/LadBot/blob/master/messages/back)**:  
  Messages displayed when {nick} comes back from being afk.

* **[messages/isAfk](https://github.com/mortie/LadBot/blob/master/messages/isAfk)**:  
  Messages displayed when {sender} mentions {nick} while {nick} is afk.

* **[messages/timerStart](https://github.com/mortie/LadBot/blob/master/messages/timerStart)**:  
  Messages displayed when {nick} starts a timer.

* **[messages/timerEnd](https://github.com/mortie/LadBot/blob/master/messages/timerEnd)**:  
  Messages displayed when {nick}'s timer ends.

 Each new line is its own message, and the messages are chosen at random. Feel free to pull request with creative messages!
 
 If you know programming on the other hand, it's basically the same as with any other open source project: add features, clean up code, optimise, etc.
