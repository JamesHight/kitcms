var socketio = require('socket.io'),
	fs = require('fs');

module.exports = function(server) {
	var io = socketio.listen(server);

	fs.readdirSync(__dirname).sort().forEach(function(file) {
		stats = fs.statSync(__dirname + '/' + file);
		if (stats.isFile() && 
			file != 'index.js' &&
			file.slice(-3) == '.js') {
				
			require('./' + file)(io);
		}
	});

	return io;
}