var fs = require('fs'),
	//express = require('express'),
	app = require('../app'),
	dust = require('../dust'),
	db = require('../db'),
	config = require('../../config'),
	basicAuth = require('../helpers/admin_basic_auth'),
	async = require('async'),
	template,
	basicAuth;


/*function validateUser(user, password, cb) {
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

basicAuth = express.basicAuth(validateUser, 'Login');*/

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


app.get('/admin', basicAuth, function(req, res, next) {
	db.keys(req.kitcms.namespace, function(err, keys) {
		keys = keys.sort();
		getTemplate(function(err, template) {
			if (err)
				return next(err);

			template({keys: keys}, function(err, html){
				res.send(html);
			});
		});
	});
});

/**
 * These functions mirror our core database functions
 **/
app.all('/admin/keys', basicAuth, function(req, res, next) {
	db.keys(req.kitcms.namespace, function(err, keys) {
		res.set('Content-Type', 'application/json');
		res.send(JSON.stringify(keys));
	});
});

app.all('/admin/get', basicAuth, function(req, res, next) {
	var key = req.param('key');
	if (typeof key == 'undefined')
		return res.send('Missing key');

	key = key.toLowerCase();

	db.get(req.kitcms.namespace + '&' + key, function(err, doc) {
		res.set('Content-Type', 'application/json');
		res.send(JSON.stringify(doc));
	});
});

app.all('/admin/set', basicAuth, function(req, res, next) {
	var key = req.param('key'),
		value = req.param('value');
	if (typeof key == 'undefined')
		return res.send('Missing key');	
	if (typeof value == 'undefined')
		return res.send('Missing value');

	key = key.toLowerCase();

	db.set(req.kitcms.namespace + '&' + key, value, function(err, keys) {
		res.set('Content-Type', 'application/json');
		res.send(JSON.stringify('OK'));
	});
});

app.all('/admin/unset', basicAuth, function(req, res, next) {
	var key = req.param('key');
	if (typeof key == 'undefined')
		return res.send('Missing key');

	key = key.toLowerCase();

	db.unset(req.kitcms.namespace + '&' + key, function(err, keys) {
		res.set('Content-Type', 'application/json');
		res.send(JSON.stringify('OK'));
	});
});

app.all('/admin/import', basicAuth, function(req, res, next) {
	console.log(req.files);
	if (!req.files || !req.files.file)
		return res.send('Missing file');

	fs.readFile(req.files.file.path, 'utf8', function(err, data) {
		if (err)
			return next(err);

		try {
			data = JSON.parse(data);
		}
		catch(err) {
			return next(err);
		}

		async.forEach(data, processEntry, function(err) {
			if (err)
				return next(err);
			
			res.redirect('/admin');
		});

		function processEntry(entry, cb) {
			if (typeof entry != 'object' || !entry.key || !entry.value)
				return cb(new Error('Invalid data structure'));

			db.set(req.kitcms.namespace + '&' + entry.key, entry.value, cb);
		}

	});
});

/**
 * Stream the contents of the database as a JSON array
 **/
app.all('/admin/export', basicAuth, function(req, res, next) {
	db.keys(req.kitcms.namespace, function(err, keys){
		if (err)
			return next(err);

		var date = new Date(),
			first = true,
			filename = date.getFullYear().toString() + '-',
			tmp;

		tmp = (date.getMonth() + 1).toString();		
		filename += tmp.length == 2 ? tmp : '0' + tmp;

		filename += '-';

		tmp = date.getDate().toString();		
		filename += tmp.length == 2 ? tmp : '0' + tmp;

		filename += '_export.json';

		res.writeHead(200, {
			'Content-Type': 'application/json',
			'Content-Disposition': 'attachment; filename=\"' + filename + '\"'
		});			
		res.write('[');

		async.forEach(keys, processKey, function(err){
		    if (err)
		    	return next(err);

		    res.write("\r\n]");
		    res.end();
		});

		function processKey(key, cb) {
			db.get(key, function(err, data) {
				var line = '';

				if (err)
					cb(err);

				if (first) 
					first = false;
				else
					line = ',';
				
				line += "\r\n{\"key\": " + JSON.stringify(key) + ', "value": ' + JSON.stringify(data) + '}';
				res.write(line);
				cb();
			});
		}

	});
});