/**
 * Replaces render function in Express.js application object
 * app.render
 * This must be required before executing express()
 **/

var dust = require('dustjs-linkedin'),
	utils = require('connect').utils,
	View = require('./view'),
	express = require('express'),
	path = require('path'),
	mime = require('mime'),
	renderers = require('../renderers');

/**
 * Swap the out the Expressjs Application render function
 **/

// Store original functions
express.application._render = express.application.render;
express.response._render = express.response.render;

// Attach new functions
express.application.render = appRender;
express.response.render = resRender;

/**
 * Render a template from the database
 **/

function appRender(name, options, cb) {
	var self = this,
		opts = {},
		cache = this.cache,
		engines = this.engines,
		ext = path.extname(name).toLowerCase(),
		renderer, namespace;

	// support callback function as second arg
	if ('function' == typeof options) {
		fn = options, options = {};
	}

	// merge app.locals
	utils.merge(opts, this.locals);

	// merge options.locals
	if (options.locals) 
		utils.merge(opts, options.locals);

	// merge options
	utils.merge(opts, options);

	if (!opts.kitcms || !opts.kitcms.namespace)
		return cb(new Error('Missing options.kitcms.namespace'));

	namespace = opts.kitcms.namespace;

	// make sure the cache has an object for our namespace
	// do this here so we don't have to check in the individual renderers
	if (!cache[namespace])
		cache[namespace] = {};

	// set .cache unless explicitly provided
	opts.cache = null == opts.cache
		? this.enabled('view cache')
		: opts.cache;

	// Return cached output if enabled and available
	if (opts.cache && cache[namespace][name])
		return cb(null, cache[namespace][name]);

	switch(ext) {
		// supports less
		case '.css':
			renderer = renderers.css;
			break;

		case '.dust':
		case '':
			renderer = renderers.dust
			break;

		default:
			renderer = renderers.raw;
	}
	

	renderer.call(this, name, opts, cb);
}

/**
 * Wraps the res.render function, adds req.kitcms to render context
 **/

function resRender(view, options, cb) {
	var ext = path.extname(view),
		type;

	if ('function' == typeof options) {
		cb = options;
		options = {};
	}
	options = options || {};
	options.kitcms = this.req.kitcms;

	// Set the correct content type
	if (ext.length) {
		type = mime.lookup(view);
		if (type)
			this.set('Content-Type', type);

		console.log('type: ' + type);
	}

	this._render(view, options, cb);
}