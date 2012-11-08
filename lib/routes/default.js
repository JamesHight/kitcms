var app = require('../app'),
	dust = require('../dust'),
	path = require('path'),
	mime = require('mime'),
	db = require('../db');

app.get('*', function (req, res) {
	var url = req.url || '/',
		ext = path.extname(url),
		namespace = req.domain.namespace;

	// remove any trailing slashes
	while(url.length > 1 && url.substr(-1) == '/') {
		url = url.substr(0, url.length - 1);
	}

	// make sure url starts with a forward slash
	if (url.substr(0, 1) != '/')
		return res.send(404);

	// don't try to render urls with a file extension,
	// just send the data with the appropriate content type
	if (ext.length) {
		db.get(namespace + '&'  + url, function(err, doc) {
			var type;

			if (err) {
				console.log(err);
				return res.send(500);
			}

			if (!doc)
				return res.send(404);

			type = mime.lookup(ext);
			if (type)
				res.set('Content-Type', type);

			res.send(doc);
		});
	}
	else {	
		// pass the url off to dust as the template name
		dust.render(url, {domain: req.domain}, function(err, result) {
			if (err)
				return res.send(404);

			res.send(result);
		});
	}
});