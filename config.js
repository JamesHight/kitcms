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
		}
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