/**
 * Modified version of the Connect basic auth middleware
 * Used for admin login across multiple domains
 **/

var http = require('http'),
 	config = require('../../config');

// Helper functions from Connect's utils.js
function unauthorized(res, realm) {
  res.statusCode = 401;
  res.setHeader('WWW-Authenticate', 'Basic realm="' + realm + '"');
  res.end('Unauthorized');
};

function error(code) {
  var err = new Error(http.STATUS_CODES[code]);
  err.status = code;
  return err;
};

/*!
 * Connect - basicAuth
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

module.exports = function(req, res, next) {
	var authorization = req.headers.authorization,
		realm = 'Authorization Required';

	if (req.user) return next();
	if (!authorization) return unauthorized(res, realm);

	var parts = authorization.split(' ')
	  , scheme = parts[0]
	  , credentials = new Buffer(parts[1], 'base64').toString().split(':')
	  , user = credentials[0]
	  , pass = credentials[1];

	if ('Basic' != scheme) return next(error(400));

	// Check our config against supplied credentials

	var adminUser, adminPassword;

	// Have the global credentials been overridden by the domain?
	if (req.kitcms && req.kitcms.admin) {
		adminUser = req.kitcms.admin.user;
		adminPassword = req.kitcms.admin.password;
	}
	else { // use global
		adminUser = config.admin.user;
		adminPassword = config.admin.password;    	
	}

	// Do they match?
	if (user === adminUser && pass === adminPassword) {
		req.user = req.remoteUser = user;
		next();
	}
	else {
		unauthorized(res, realm);
	}
};

