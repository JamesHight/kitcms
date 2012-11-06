var fs = require('fs'),
	app = require('../app'),
	dust = require('../dust'),
	db = require('../db'),
	template;

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


app.get('/admin', function(req, res) {
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
app.all('/admin/keys', function(req, res) {
	db.keys(function(err, keys) {
		res.set('Content-Type', 'application/json');
		res.send(JSON.stringify(keys));
	});
});

app.all('/admin/get', function(req, res) {
	var key = req.param('key');
	if (typeof key == 'undefined')
		return res.send('Missing key');
	
	db.get(key, function(err, doc) {
		res.set('Content-Type', 'application/json');
		res.send(JSON.stringify(doc));
	});
});

app.all('/admin/set', function(req, res) {
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

app.all('/admin/unset', function(req, res) {
	var key = req.param('key');
	if (typeof key == 'undefined')
		return res.send('Missing key');

	db.unset(key, function(err, keys) {
		res.set('Content-Type', 'application/json');
		res.send(JSON.stringify('OK'));
	});
});