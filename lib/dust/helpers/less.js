var dust = require('dustjs-linkedin'),
	less = require('../../helpers/less');

dust.helpers.less = function(chunk, context, bodies, params) {
	if (bodies.block) {
		return chunk.capture(bodies.block, context, function(string, chunk) {
			var callback = function(err, css) {
				chunk.end(css);
			};
			
			// Pass kitcms domain into less env
			less.render(string, {kitcms: context.get('kitcms')}, callback);
		});
	}
	return chunk;
};
