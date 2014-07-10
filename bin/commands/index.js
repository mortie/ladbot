var e = module.exports;

e.ladpoints = require("./ladpoints.js");

//?ladpoints
//++ladpoints
//--ladpoints
e.ladpoints_prefix = e.ladpoints.prefix;
e.ladpoints_prefix.regex = /^[^\s]+ladpoints/i

//ladpoints += [amount] [nick]
//	//ladpoints -= [amount] [nick]
e.ladpoints_infix = e.ladpoints.infix;
e.ladpoints_infix.regex = /^ladpoints\s+(\-|\+)\=\s+\d+\s+[^\s]+/i;


//calc [expression]
e.calc = require("./calc.js");
e.calc.regex = /^calc.+/i;


e.conversion = require("./conversion.js");

//convert [num] to base [base]
e.conversion_base = e.conversion.base;
e.conversion_base.regex = /.+to\s+base.+\d+/i;


e.afk = require("./afk.js");

//afk
e.afk_start = e.afk.start;
e.afk_start.regex = /^afk/i;

//back from afk
e.afk_back = e.afk.back;
e.afk_back.regex = /^(?!afk)/i;

//message contains afk user
e.afk_messageContainsUser = e.afk.messageContainsUser;
e.afk_messageContainsUser.regex = /.+/;


//set timer [time]
e.timer = require("./timer.js");
e.timer.regex = /^(timer|set.+timer).+(second|minute|hour|day)/i;


//lads
e.lads = require("./lads.js");
e.lads.regex = /^lads$/i;
