var memwatch = require('memwatch'),
	bunyan = require('bunyan'),
	config = require('../config'),
	leakLogger = bunyan.createLogger({
		name: 'memwatch',
		streams: [
			{
				level: 'info',
				path: config.logs + '/memwatch-leak.log'
			}
		]
	}),
	statsLogger = bunyan.createLogger({
		name: 'memwatch',
		streams: [
			{
				level: 'info',
				path: config.logs + '/memwatch-stats.log'
			}
		]
	});


memwatch.on('leak', function(info) {
	leakLogger.info(info);
});

memwatch.on('stats', function(stats) {
	statsLogger.info(stats);
});