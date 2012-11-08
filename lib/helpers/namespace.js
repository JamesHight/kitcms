var config = require('../../config'),
	filters = [];

/**
 * Create regular expressions to match our domain names
 **/

function createFilters() {
	var domain, names, name, filter, filterNames, i, j;

	for (i = 0; i < config.domains.length; i++) {
		domain = config.domains[i];

		if (!domain.name)
			throw new Error('Missing the name value for a domain in config');

		if (!domain.namespace)
			throw new Error('Missing the namespace value for a domain in config');

		names = (typeof domain.name == 'string') ? [domain.name] : domain.name;

		filterNames = [];
		for (j = 0; j < names.length; j++) {
			name = names[j]
			filter = name;
			// Escape regex special characters in filter except *
			filter = filter.replace(/[-[\]{}()+?.,\\^$|#\s]/g, "\\$&");
			// Make "*" match expand match
			filter = filter.replace('*', '.*');
			filterNames.push(filter);			
		}

		// Combine multiple names
		filter = filterNames.join('|');

		// Limit range of match
		filter = '^(' + filter + ')$';
		// Case insensitive matching
		filter = new RegExp(filter, 'i');

		filters.push(filter);
	}
}

createFilters();

module.exports = function(req, res, next) {
	var i, filter;

	for (i = 0; i < filters.length; i++) {
		filter = filters[i];
		
		if (req.host.match(filter)) {
			req.domain = config.domains[i];
			return next();
		}
	}

	res.send(404);
};

