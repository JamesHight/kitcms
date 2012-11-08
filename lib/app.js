var express = require('express'),
	app = express(),
	config = require('../config'),
	namespace = require('./helpers/namespace');

app.set('port', process.env.PORT || config.server.port || 3000);
app.set('address', process.env.ADDRESS || config.server.address || 'localhost');
app.use(express.favicon());
app.use(express.logger('dev'));
if (config.sessions)
	app.use(express.cookieSession());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(require('less-middleware')({ src: __dirname + '/../public' }));
// Make sure express.static comes before the app.router
app.use(express.static(__dirname + '/../public'));
app.use(namespace);
app.use(app.router);

if (config.debug)
	app.use(express.errorHandler());

module.exports = app;