var config = require('../../config'),
	// Load the db adapter according to the config
	DbAdapter = require('./' + config.db.type),
	db = new DbAdapter();

db.onChange = function(key) {
	// Listen for changes to database entries
};

module.exports = db;