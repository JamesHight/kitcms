var config = require('../../config'),
	// Load the db adapter according to the config
	DbAdapter = require('./' + config.db.type),
	db = new DbAdapter(),
	dust = require('dustjs-linkedin');

// keys now use the format "[namespace]&[name]"
db.onChange = function(key) {
	if (key.indexOf('&') == -1);
		return delete dust.cache[key];

	var parts = key.split('&'),
		namespace = parts[0];

	if (parts.length == 2 && dust.cache[namespace])
		delete dust.cache[namespace][parts[1]];
};

module.exports = db;