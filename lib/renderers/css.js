var dust = require('../dust'),
	db = require('../db'),
	less = require('../helpers/less');

module.exports = function(name, options, cb) {
	var namespace = options.kitcms.namespace,
		cache = this.cache;

	db.get(namespace + '&'  + name, function(err, doc) {
		if (err)
			return cb(err);

		if (!doc)
			return lookForLess();

		cache[namespace][name] = doc;
		cb(null, doc);
	});

	function lookForLess() {
		var lessName = name.slice(0, name.length - 3) + 'less';
		db.get(namespace + '&'  + lessName, function(err, doc) {
			if (err)
				return cb(err);

			if (!doc)
				return cb(new Error('Failed to lookup view "' + name + '"'));

			less.render(doc, options, function(err, css) {
				var file, msg;

				if (err) {
					file = err.filename || lessName;
					msg = 'Less Error [' + file + ']: ' + err.message + 
							"\n" + JSON.stringify(err.extract);
					
					return cb(new Error(msg));
				}


				// store css in database
				db.set(namespace + '&'  + name, css, function(err) {
					if(err)
						return next(err);

					cache[namespace][name] = css;
					cb(null, css);
				});
			});
		});
	}
}