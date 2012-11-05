var extend = require('./lib/helpers/config_extend');

var config,
	production = {
		debug: false,
		sessions: false,
		server: {
			address: 'localhost',
			port: 3000
		}
	},
	
	staging = { // extends production
		
	},

	development = { // extends production		
		debug: true,
		server: {
			address: '0.0.0.0'
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
		config = extend(production, development);
		break;

	default:
		throw new Error('Invalid value for NODE_ENV');
}

module.exports = config;