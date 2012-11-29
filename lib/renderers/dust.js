var dust = require('../dust');

module.exports = function(name, options, cb) {
	dust.render(name, options, cb);
}