var dust = require('dustjs-linkedin'),
	highlight = require('highlight').Highlight;

dust.helpers.code = function(chunk, context, bodies, params) {
	if (bodies.block) {
		return chunk.capture(bodies.block, context, function(string, chunk) {
			// remove leading and trailing white space
			string = string.replace(/^\s*/, '').replace(/\s*$/, '');
			chunk.end('<pre><code>' + highlight(string) + '</code></pre>');
		});
	}
	return chunk;
};
