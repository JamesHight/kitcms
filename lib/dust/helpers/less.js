var dust = require('dustjs-linkedin'),
	less = require('../../helpers/less');

dust.helpers.less = function(chunk, context, bodies, params) {
	if (bodies.block) {
		return chunk.capture(bodies.block, context, function(string, chunk) {
			less.render(string, function(err, css) {
				chunk.end(css);
			})
		});
	}
	return chunk;
};
