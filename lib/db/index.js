var config = require('../../config'),
	// Load the db adapter according to the config
	DbAdapter = require('./' + config.db.type),
	dust = require('dustjs-linkedin'),
	app = require('../app'),
	db;

db = new DbAdapter(),

// keys now use the format "[namespace]&[name]"
db.onChange = function(key) {
	if (key.indexOf('&') === -1)
		return delete dust.cache[key];

	var name = key.split('&'),
		namespace = name[0];	
	name = name[1];

	// Dustjs function cache
	if (dust.cache[namespace])
		delete dust.cache[namespace][name];

	// Expressjs output cache
	if (app.cache[namespace])
		delete app.cache[namespace][name];
};

module.exports = db;