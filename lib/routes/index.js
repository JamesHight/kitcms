var fs = require('fs');

/**
 * require() all the js files and directories
 * located in the current directory
 **/

fs.readdirSync(__dirname).sort().forEach(function(file) {
	stats = fs.statSync(__dirname + '/' + file);
	if (stats.isFile() && 
		file != 'index.js' &&
		file != 'default.js' &&
		file.slice(-3) == '.js') {
			
		require('./' + file);
	}
	else if (stats.isDirectory()) {
		require('./' + file);
	}
});

// add default.js last
require('./default');