var db = require('../db'),
	dust = require('dustjs-linkedin'),
	cache = {};

// Load LinkedIn dust helpers
require('dustjs-helpers');

// Disable white space compression
dust.optimizers.format = function(ctx, node) { 
	return node;
};

// Load custom dust helpers
require('./helpers');

/**
 * Override dust.load in order to support namespaced template lookups.
 * The dust.cache object is now structured like dust.cache[namespace][key].
 **/

dust.oldLoad = dust.load;
dust.load = function(name, chunk, context) {
	var namespace = context.get('kitcms').namespace,
		fullname = namespace + '&' + name,
		tmpl = dust.cache[namespace] && dust.cache[namespace][name] ? 
				dust.cache[namespace][name] : null;

	if (tmpl) {
		return tmpl(chunk, context);
	} 
	else {
		return chunk.map(function(chunk) {
			dust.onLoad(fullname, function(err, src) {
				if (err)
					return chunk.setError(err);

				if (!dust.cache[namespace])
					dust.cache[namespace] = {};

				if (!dust.cache[namespace][name])
					dust.loadSource(dust.compile(src, fullname));


				dust.cache[namespace][name](chunk, context).end();
			});			
		});
	}
}

/**
 * Support modified namespace names
 **/

dust.register = function(name, tmpl) {
	if (!name) 
		return;

	var parts = name.split('&'),
		namespace;

	if (parts.length != 2)
		return;

	namespace = parts[0];
	name = parts[1];

	if (!dust.cache[namespace])
		dust.cache[namespace] = {};

	dust.cache[namespace][name] = tmpl;
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