var config = require('../../config'),
	// Load the db adapter according to the config
	DbAdapter = require('./' + config.db.type),
	db = new DbAdapter(),
	dust = require('dustjs-linkedin');

db.onChange = function(key) {
	delete dust.cache[key];
};

module.exports = db;