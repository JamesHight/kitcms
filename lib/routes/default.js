var app = require('../app'),
	dust = require('../dust'),
	path = require('path'),
	mime = require('mime');

app.get('*', function (req, res) {
	var url = req.url || '/',
		ext = path.extname(url);

	// make sure url starts with a forward slash
	if (url.substr(0, 1) != '/')
		return res.send(404);

	// don't try to render urls with a file extension,
	// just send the data with the appropriate content type
	if (ext.length) {
		db.get(url, function(err, doc) {
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
		dust.render(url, {}, function(err, result) {
			if (err)
				return res.send(404);

			res.send(result);
		});
	}
});