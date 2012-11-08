var app = require('../app'),
	dust = require('../dust'),
	path = require('path'),
	mime = require('mime'),
	db = require('../db'),
	less = require('../helpers/less');

app.get('*', function (req, res, next) {
	var url = req.url || '/',
		ext = path.extname(url).toLowerCase(),
		namespace = req.kitcms.namespace;

	// remove any trailing slashes
	while(url.length > 1 && url.substr(-1) == '/') {
		url = url.substr(0, url.length - 1);
	}
	url = url.toLowerCase();

	// make sure url starts with a forward slash
	if (url.substr(0, 1) != '/')
		return res.send(404);

	// don't try to render urls with a file extension,
	// just send the data with the appropriate content type
	if (ext.length) {
		processFile();
	}
	else {	
		// pass the url off to dust as the template name
		dust.render(url, {kitcms: req.kitcms}, function(err, result) {
			if (err)
				return res.send(404);

			res.send(result);
		});
	}

	function processFile() {
		db.get(namespace + '&'  + url, function(err, doc) {
			var type;

			if (err)
				return next(err);

			if (!doc) {
				if (ext === '.css') 
					return lookForLess();				

				return res.send(404);
			}

			// don't server less files
			if (ext === '.less')
				return res.send(404);
			
			type = mime.lookup(ext);
			if (type)
				res.set('Content-Type', type);

			res.send(doc);
		});
	}

	// Try to find a corresponding less file for css files
	function lookForLess() {
		var lessUrl = url.substr(0, url.length - 3) + 'less';		
		db.get(namespace + '&'  + lessUrl, function(err, doc) {
			if (err)
				return next(err);

			if (!doc)
				return res.send(404);

			// Pass kitcms domain into less env
			less.render(doc, {kitcms: req.kitcms}, function(err, css) {
				if (err) {
					var file = err.filename || lessUrl,
						msg = 'Less Error [' + file + ']: ' + err.message + 
							"\n" + JSON.stringify(err.extract);
					
					return next(new Error(msg));
				}


				// store css in database
				db.set(namespace + '&'  + url, css, function(err) {
					if(err)
						return next(err);

					res.set('Content-Type', 'text/css');
					res.send(css);					
				});
			});
		});
	}
});