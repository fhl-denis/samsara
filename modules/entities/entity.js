var _ = require('underscore');

var Coords = function(x, y) {
	this.x = x;
	this.y = y;
};

var Size = function(w, h) {
	this.w = w;
	this.h = h;
};

var Speed = function(v, h) {
	this.v = v;
	this.h = h;
};

var CollisionInfo = function(type, attributes) {
	this.type = type;
	this.attributes = attributes;
	this.colliders = [];
};

// Axis aligned Bounding Boxes
var BoundingBox = function(x, y, w, h) {
	this.coords = new Coords(x, y);
	this.size = new Size(w, h);
};

BoundingBox.prototype.getA = function() {
	return {x: this.coords.x, y: this.coords.y};
};

BoundingBox.prototype.getB = function() {
	return {x: this.coords.x + this.size.w, y: this.coords.y};
};

BoundingBox.prototype.getC = function() {
	return {x: this.coords.x + this.size.w, y: this.coords.y + this.size.h};
};

BoundingBox.prototype.getD = function() {
	return {x: this.coords.x, y: this.coords.y + this.size.h};
};

BoundingBox.prototype.getM = function() {
	return {x: this.coords.x + this.size.w / 2, y: this.coords.y + this.size.h / 2};
};

var Collider = function(entities) {
	this.entities = entities;
};

Collider.prototype.isColliding = function(bb1, bb2) {
	var a1 = bb1.getA(),
		a2 = bb2.getA(),
		c1 = bb1.getC(),
		c2 = bb2.getC();
	return ( a1.x <= a2.x && c1.x >= a2.x ||
		a1.x >= a2.x && a1.x <= c2.x ) &&
		( a1.y <= a2.y && c1.y >= a2.y ||
		a1.y >= a2.y && a1.y <= c2.y );

};

Collider.prototype.checkCollisions = function() {
	var that = this,
		restEntities = this.entities;

	_.each(this.entities, function(entity, name) {
		restEntities = _.omit(restEntities, name);
		_.each(restEntities, function(rEnt, rName) {
			if (that.isColliding(entity.bb, rEnt.bb)) {
				entity.collisionInfo.colliders.push(rEnt);
				rEnt.collisionInfo.colliders.push(entity);
			}
		});
	});
};

exports.Collider = Collider;
exports.BoundingBox = BoundingBox;
exports.Coords = Coords;
exports.Size = Size;
exports.Speed = Speed;
exports.CollisionInfo = CollisionInfo;