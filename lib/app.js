var express = require('express'),
	app = express();

app.set('port', 3000);
app.set('address', 'localhost');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
// Make sure express.static comes before the app.router
app.use(express.static(__dirname + '/../public'));
app.use(app.router);

app.use(express.errorHandler());

module.exports = app;