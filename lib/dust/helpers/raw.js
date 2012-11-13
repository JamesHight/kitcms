var dust = require('dustjs-linkedin'),
	db = require('../../db');

dust.helpers.raw = function(chunk, context, bodies, params) {	
	params = params || {};
	if (params.name) {
		return chunk.map(function(chunk) {
			var key = context.get('kitcms').namespace + '&' + params.name;
			db.get(key, function(err, doc){
				if (err)
					console.log(err);

				if (err || !doc)
					return chunk.end('');
				
				chunk.end(doc);
			});
		});		
	}
	return chunk;
};