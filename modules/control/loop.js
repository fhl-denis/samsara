var _ = require('underscore');

var loop = function(objects, dt) {
	_.each(objects, function(obj) {
		obj.update(dt);
	});
};

exports.start = function(objects, options, fn) {
	var defaults = {
		dt: 20
	};
	var settings = _.extend(defaults, options);
	setInterval(function() {
		loop(objects, settings.dt);
		fn(objects);
	}, settings.dt);
};