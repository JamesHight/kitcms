var extend = require('./lib/helpers/config_extend');

var config,
	production = {
		// Output errors to browser
		debug: false,
		// enable session cookies
		sessions: false,
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
		// only type = 'redis' is currently supported
		db: {
			type: 'redis'/*,
			server: 'localhost',
			port: 6379,
			number: 0, // Which Redis database to use 
			password: 'foo'*/
		},
		// Credentials for /admin if not set in the domain
		admin: {
			user: 'necco',
			password: 'lANu0kE70JR9OwJN4H4E71uo8axaB6ZxypxPMS0t'
		},
		// Domains that are resolved by server
		// checks against req.host
		domains: [
			{
				name: 'demo.kitcms.com',
				namespace: 'demo_kitcms',
				admin: {
					user: 'foo',
					password: 'bar'
				}
			},
			{
				name: '*kitcms.com',
				namespace: 'kitcms'
			},			
			{
				name: '*zavoo.com',
				namespace: 'zavoo'
			}
		]
	},
	
	staging = { // extends production
		
	},

	development = { // extends production		
		debug: true,
		server: {	
			address: '127.0.0.1',		
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