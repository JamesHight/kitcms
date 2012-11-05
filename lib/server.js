var http = require('http'),
	app = require('./app'), 
	server = http.createServer(app);

server.listen(app.get('port'), app.get('address'), function() {
	console.log("Express server listening on port " + app.get('port'));
});

//require('./dust');

// Load routes
require('./routes');