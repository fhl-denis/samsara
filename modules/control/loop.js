var _ = require('underscore');
var Collider = require('./../entities/entity.js').Collider;

var loop = function(objects, dt) {
	var updated = {};
	_.each(objects, function(obj, key) {
		obj.update(dt);
		updated[key] = _.omit(obj, 'collisionInfo');
	});
	return updated;
};

exports.start = function(objects, options, fn) {
	var defaults = {
		dt: 20
	};
	var settings = _.extend(defaults, options);
	var collider = new Collider(objects);
	setInterval(function() {
		collider.checkCollisions();
		fn(loop(objects, settings.dt));
	}, settings.dt);
};