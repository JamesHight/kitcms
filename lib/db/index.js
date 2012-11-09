var config = require('../../config'),
	// Load the db adapter according to the config
	DbAdapter = require('./' + config.db.type),
	db = new DbAdapter(),
	dust = require('dustjs-linkedin');

// keys now use the format "[namespace]&[name]"
db.onChange = function(key) {
	if (key.indexOf('&') === -1)
		return delete dust.cache[key];

	var name = key.split('&'),
		namespace = name[0];		
	name = name[1];

	if (dust.cache[namespace])
		delete dust.cache[namespace][name];
};

module.exports = db;