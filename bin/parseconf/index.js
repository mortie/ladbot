module.exports = function(str)
{
	var res = {};

	str.split("\n").forEach(function(line)
	{
		var key = line.split("=")[0];
		var val = line.substring(line.indexOf("=")+1);

		if (!key.match(/^\s*$/))
			res[key.trim()] = val.trim();
	});

	return res;
}
