var fs = require('fs'),
	express = require('express'),
	app = require('../app'),
	dust = require('../dust'),
	db = require('../db'),
	config = require('../../config'),
	template,
	basicAuth;


function validateUser(user, password, cb) {
	// Are the credentials set in config and do they match?
	var valid = config.admin && 
				config.admin.user && 
				config.admin.password &&
				config.admin.user === user &&
				config.admin.password === password;
	if(valid)
		cb(null, user);
	else
		cb(new Error('Invalid user/password'));
}

basicAuth = express.basicAuth(validateUser, 'Login');

/**
 * Load the template file the first time through.
 * After that, return a cached copy of the compiled function.
 **/ 
function getTemplate(cb) {
	if (template)
		return cb(null, template);

	fs.readFile(__dirname + '/../views/admin.dust', 'utf8', function(err, str) {
		if (err)
			return cb(err);

		template = dust.compileFn(str, 'admin.dust');
		cb(null, template);
	});
}


app.get('/admin', basicAuth, function(req, res) {
	db.keys(function(err, keys) {
		keys = keys.sort();
		getTemplate(function(err, template) {
			if (err)
				throw err;

			template({keys: keys}, function(err, html){
				res.send(html);
			});
		});
	});
});

/**
 * These functions mirror our core database functions
 **/
app.all('/admin/keys', basicAuth, function(req, res) {
	db.keys(function(err, keys) {
		res.set('Content-Type', 'application/json');
		res.send(JSON.stringify(keys));
	});
});

app.all('/admin/get', basicAuth, function(req, res) {
	var key = req.param('key');
	if (typeof key == 'undefined')
		return res.send('Missing key');
	
	db.get(key, function(err, doc) {
		res.set('Content-Type', 'application/json');
		res.send(JSON.stringify(doc));
	});
});

app.all('/admin/set', basicAuth, function(req, res) {
	var key = req.param('key'),
		value = req.param('value');
	if (typeof key == 'undefined')
		return res.send('Missing key');
	console.log(req.param('derp'));
	if (typeof value == 'undefined')
		return res.send('Missing value');

	db.set(key, value, function(err, keys) {
		res.set('Content-Type', 'application/json');
		res.send(JSON.stringify('OK'));
	});
});

app.all('/admin/unset', basicAuth, function(req, res) {
	var key = req.param('key');
	if (typeof key == 'undefined')
		return res.send('Missing key');

	db.unset(key, function(err, keys) {
		res.set('Content-Type', 'application/json');
		res.send(JSON.stringify('OK'));
	});
});