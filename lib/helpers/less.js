var less = require('less');

/**
 * Override less parser file loader
 * Disabled for now
 **/

less.Parser.importer = function(file, paths, callback, env) {
	if (typeof(env.errback) === "function") {
		env.errback(file, paths, callback);
	} else {
		callback({ type: 'File', message: "Less import currently disabled.\n" });
	}
};



module.exports = less;