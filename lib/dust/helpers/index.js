var fs = require('fs'),
	dust = require('dustjs-linkedin');

/* require() all the js files
 * located in the current directory */

fs.readdirSync(__dirname).sort().forEach(function(file) {
	stats = fs.statSync(__dirname + '/' + file);
	if (stats.isFile() && 
		file != 'index.js' &&
		file.slice(-3) == '.js') {
			
		require('./' + file);
	}
});