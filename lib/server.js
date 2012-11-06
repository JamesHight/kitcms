var cluster = require('cluster'),
	numCPUs = require('os').cpus().length,
	http = require('http'),
	app = require('./app'), 
	config = require('../config'),
	server;

if (config.server.workers == 'auto') 
	config.server.workers = numCPUs > 1 ? numCPUs - 1 : 1;

if (config.server.workers > numCPUs)
	config.server.workers = numCPUs;
	
if (config.server.workers < 1)
	throw new Error('You must have at least one worker');


if (cluster.isMaster) { // fork workers and monitor them
	console.log('forking the workers:');
	// fork workers
	for (var i = 0; i < config.server.workers; i++) {
		cluster.fork();
	}
	
	cluster.on('exit', function(worker, code, signal){
		console.log('worker ' + worker.process.pid + ' died (' + worker.process.exitCode + ')');		
		// don't restart if the worker intentionally killed itself
		if (worker.suicide) {
			console.log('it was suicide');
		}
		else {
			console.log('forking the worker over');
			cluster.fork();
		}
	});
	
}
else { // setup a worker
	server = http.createServer(app);

	server.listen(app.get('port'), app.get('address'), function() {
		console.log("Express server listening on port " + app.get('port'));
	});

	// Load routes
	require('./routes');
}