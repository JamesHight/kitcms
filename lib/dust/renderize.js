/**
 * Replaces render function in Express.js application object
 * app.render
 * This must be required before executing express()
 **/

var dust = require('dustjs-linkedin'),
	utils = require('connect').utils,
	View = require('./view'),
	express = require('express');

/**
 * Swap the out the Expressjs Application render function
 **/

// Store original functions
express.application._render = express.application.render;
express.response._render = express.response.render;

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
		view;

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

	dust.render(name, options, cb);
}

/**
 * Wraps the res.render function, adds req.kitcms to render context
 **/

function resRender(view, options, cb) {
	if ('function' == typeof options) {
		cb = options; 
		options = {};
	}
	options = options || {};
	options.kitcms = this.req.kitcms;
	this._render(view, options, cb);
}