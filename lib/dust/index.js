var db = require('../db'),
	dust = require('dustjs-linkedin');

// Load LinkedIn dust helpers
require('dustjs-helpers');

// Disable white space compression
dust.optimizers.format = function(ctx, node) { 
	return node;
};

/**
 * Setup dust db template loader
 * Dustjs will call this function when a template 
 * is requested that hasn't been loaded yet.
 **/
dust.onLoad = function(templateName, cb) {
	db.get(templateName, function(err, doc) {
		if (err)
			return cb(err);

		if (!doc)
			return cb(new Error('Template "' + templateName + '" not found'));

		cb(null, doc);
	});
};

module.exports = dust;