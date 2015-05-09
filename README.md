LadBot NodeJS IRC Bot
======

LadBot is an IRC bot framework. It's written in node.js, and uses [Martyn Smith's node-irc module](https://github.com/martynsmith/node-irc).

#### Supports:
+ Custom Easy to Build Plugins
+ Multiple Channels
+ Changing IRC Port
+ IRC over SSL
+ IRC SASL Authentication
+ Configurable Timeout
+ Plugin Disabling via Config
+ RAW IRC Commands on-join
+ Many other functionalities via Plugins


#### Config:

Things inside the configuration file are pretty straight forward, the only thing that might not be obvious is that a key starting with `_` is `disabled`. Remove the `_` to enable the config option again.

#### Using SASL:

To Enable SASL, configure the options:
+ options.sasl: true
+ options.userName: *username*
+ options.password: *password*
