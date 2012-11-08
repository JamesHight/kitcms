var less = require('less'),
	db = require('../db');

/**
 * Override static less parser file loader
 * triggered by the import command
 *
 * Load file from database
 **/

less.Parser.importer = function(file, paths, callback, env) {
	var paths = [].concat(paths); // Avoid passing paths by reference down the import tree...
    paths.unshift('.');           // ...which results on a lot of repeated '.' paths.

	// Passing domain context to less parser using callback function.
	var namespace = env.kitcms.namespace;

	db.get(namespace + '&' + file, function(err, doc) {
		if (err)
			callback(err);

		if (!doc) 
			return callback({ type: 'File', message: 'File "' + file + "\" not found in database.\n" });

		env.contents[file] = doc;      // Updating top importing parser content cache.

		new(less.Parser)({
			paths: paths,
			filename: file,
			contents: env.contents,
			dumpLineNumbers: env.dumpLineNumbers
		}).parse(doc, function (e, root) {
			callback(e, root);
		});

	});
};

module.exports = less;