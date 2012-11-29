var mime = require('mime'),
	db = require('../db');

module.exports = function(name, options, cb) {
	var namespace = options.kitcms.namespace,
		cache = this.cache;

	db.get(new Buffer(namespace + '&'  + name), function(err, doc) {
		if (err)
			return cb(err);

		if (!doc)
			return cb(new Error('Failed to lookup view "' + name + '"'));

		console.log('doc:');
		//console.log(doc);
		cache[namespace][name] = doc;
		cb(null, doc);
	});
}