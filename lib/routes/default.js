var app = require('../app'),
	db = require('../db');

app.get('*', function (req, res) {
	db.set('/', 'Hello Redis World!', function(err) {
		if (err)
			throw err;

		db.get('/', function(err, doc) {
			if (err)
				throw err;

			res.send(doc);
		});
	});
});