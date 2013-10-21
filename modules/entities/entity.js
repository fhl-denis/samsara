var _ = require('underscore');

var Coords = function(x, y) {
	this.x = x;
	this.y = y;
};

var Size = function(w, h) {
	this.w = w;
	this.h = h;
};

var CollisionInfo = function(type, attributes) {
	this.type = type;
	this.attributes = attributes;
};

// Axis aligned Bounding Boxes
var BoundingBox = function(args) {
	this.size = args.size;
	this.coords = args.coords;
	this.collisionInfo = args.collisionInfo;
	this.collisionResolvers = args.collisionResolvers;
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

BoundingBox.prototype.resolveCollision = function(box) {
	if (_.isFunction(this.collisionResolvers[box.collisionInfo.type])){
		this.collisionResolvers[type](box.collisionInfo.attributes);
	}
};

var Collider = function(boxes) {
	this.boxes = boxes;
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
		restBoxes = {};

	_.each(this.boxes, function(box, name) {
		restBoxes = _.omit(restBoxes, name);
		_.each(restBoxes, function(rBox, rName) {
			if (that.isColliding(box, rBox)) {
				box.resolveCollision(rBox);
				rBox.resolveCollision(box);
			}
		});
	});
};

exports.Collider = Collider;
exports.BoundingBox = BoundingBox;
exports.Coords = Coords;
exports.Size = Size;
exports.CollisionInfo = CollisionInfo;