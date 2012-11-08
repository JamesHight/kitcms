var dust = require('dustjs-linkedin');

dust.helpers.stringify = function(chunk, context, bodies, params) {
	if (bodies.block) {
		return chunk.capture(bodies.block, context, function(string, chunk) {
			chunk.end(JSON.stringify(string));
		});
	}
	return chunk;
};
