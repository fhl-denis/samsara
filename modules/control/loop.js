var _ = require('underscore');
var Collider = require('./../entities/entity.js').Collider;

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
	var collider = new Collider(objects);
	setInterval(function() {
		collider.checkCollisions();
		loop(objects, settings.dt);
		fn(objects);
	}, settings.dt);
};