var app = require('../app'),
	dust = require('../dust'),
	path = require('path'),
	mime = require('mime'),
	db = require('../db'),
	less = require('../helpers/less');

app.get('*', function (req, res, next) {	
	var url = req.url || '/';

	// remove any trailing slashes
	while(url.length > 1 && url.substr(-1) == '/') {
		url = url.substr(0, url.length - 1);
	}
	url = url.toLowerCase();

	// make sure url starts with a forward slash
	if (url.substr(0, 1) != '/')
		return res.send(404);

	// Hand the url off to our renderizer
	res.render(url);
});