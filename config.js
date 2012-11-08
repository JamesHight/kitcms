var extend = require('./lib/helpers/config_extend');

var config,
	production = {
		debug: false,
		sessions: false,
		server: {
			address: '0.0.0.0',
			port: 3000,
			workers: 'auto'
		},
		db: {
			type: 'redis'
		},
		admin: {
			user: 'foo',
			password: 'bar'
		},
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
			// These assign multiple names to the same domain
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
		]
	},
	
	staging = { // extends production
		
	},

	development = { // extends production		
		debug: true,
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