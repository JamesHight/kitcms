var extend = require('./lib/helpers/config_extend');

var config,
	production = {
		// Output errors to browser
		debug: false,
		// Enable memwatch logging of stats and leak events to logs directory
		memwatch: false,

		// enable session cookies
		sessions: false,

		// secret used to prevent cookie tampering
		cookieSecret: 'ZhtIEKq51-Md2HH--b0w',

		//enable socket.io, see lib/socketio/index.js and lib/socketio/example.js
		socketio: false,

		// http server settings
		server: {			
			address: '0.0.0.0',
			port: 3000,
			// Number of cluster processes to fork
			// auto = [Number of CPUs] - 1 || 1
			// You can also set it to a number value
			workers: 'auto'
		},

		// db settings
		db: {
			// type can currently be 'redis' or 'json'
			// only the Redis adapter supports multiple processes/servers
			// 'json' saves changes to a local json file under the data directory
			// see lib/db/redis.js and lib/db/json.js for more config options
			
			type: 'redis'/*,
			server: 'localhost',
			port: 6379,
			number: 0, // Which Redis database to use 
			password: 'foo'*/
		},

		// Credentials for /admin if not set in the domain
		admin: {
			user: 'foo',
			password: 'bar'
		},

		// Domains that are resolved by server
		// checks against req.host
		domains: [
			// This entry matches any domain that ends in example.com
			// like: mydomainexample.com or www.example.com
			{
				name: '*example.com',
				namespace: 'example', // namespace used when storing data in Redis
				// override admin credentials
				admin: {
					user: 'foo2',
					password: 'bar2'
				}
			},
			// Assign multiple names to the same domain
			{
				name: ['localhost', '127.0.0.1'],
				namespace: 'default'
			},
			// Example catch all
			// Has the same namespace as the previous domain, so they share data
			// Admin login has been disabled
			{
				name: '*',
				namespace: 'default',

				admin: {
					user: false,
					password: false
				}
			}
		],

		// Directory to write log files
		logs: __dirname + '/logs'
	},
	
	staging = { // extends production
		
	},

	development = { // extends production		
		debug: true,
		memwatch: true,
		sessions: true,
		socketio: true,
		server: {			
			workers: 2
		}
	};

switch(process.env.NODE_ENV){
	case 'production':
		config = production;
		break;
		
	case 'staging':
		config = extend(production, staging);
		break;
		
	case 'development':
	default:
		config = extend(production, development);
		break;
}

module.exports = config;