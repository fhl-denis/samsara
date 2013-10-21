var entity = require('./entity.js');
var _ = require('underscore');

var Hum = function() {
	this.objectType = 'Hum';
	this.collisionInfo = new entity.CollisionInfo('soft', {});
	this.bb = new entity.BoundingBox(390, 170, 20, 30);
	this.speed = new entity.Speed(0, 0);
};

Hum.prototype.resolveCollision = function() {
	var that = this;
	_.each(this.collisionInfo.colliders, function(entity) {
		if (entity.collisionInfo.type == 'hard'){
			that.pushBackCollision(entity.bb);
		}
	});
	this.collisionInfo.colliders = [];
};

Hum.prototype.pushBackCollision = function(bb) {
	var top, bottom, left, right;

	top = Math.abs(this.bb.coords.y - bb.getC().y);
	bottom = Math.abs(this.bb.getC().y - bb.coords.y);
	left = Math.abs(this.bb.coords.x - bb.getC().x);
	right = Math.abs(this.bb.getC().x - bb.coords.x);

	if (top < bottom && top < left && top < right) {
		this.speed.v = 0; this.bb.coords.y = bb.getC().y;
	}

	if (bottom < top && bottom < left && bottom < right) {
		this.speed.v = 0; this.bb.coords.y = bb.coords.y - this.bb.size.h;
	}

	if (left < top && left < bottom && left < right) {
		this.speed.x = 0; this.bb.coords.x = bb.getC().x;
	}

	if (right < top && right < bottom && right < left){
		this.speed.x = 0; this.bb.coords.x = bb.coords.x - this.bb.size.w;
	}
};

Hum.prototype.gravitate = function() {
	if (this.speed.h < 30){
		this.speed.h += 5;
	}
	else {
		this.speed.h = 30;
	}
};

Hum.prototype.move = function(dt) {
	this.bb.coords.x += this.speed.v * dt / 1000;
	this.bb.coords.y += this.speed.h * dt / 1000;
};

Hum.prototype.update = function(dt) {
	this.gravitate();
	this.move(dt);
	this.resolveCollision();
};
exports.Hum = Hum;