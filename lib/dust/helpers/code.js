var dust = require('dustjs-linkedin'),
	highlight = require('highlight').Highlight;

dust.helpers.code = function(chunk, context, bodies, params) {
	if (bodies.block) {
		return chunk.capture(bodies.block, context, function(string, chunk) {
			chunk.end('<pre class="code">' + highlight(string) + '</pre>');
		});
	}
	return chunk;
};
