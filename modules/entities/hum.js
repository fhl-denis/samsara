var entity = require('./entity.js');
var _ = require('underscore');

var Hum = function() {
	this.objectType = 'Hum';
	this.collisionInfo = new entity.CollisionInfo('soft', {});
	this.bb = new entity.BoundingBox(390, 170, 20, 30);
	this.speed = new entity.Speed(0, 0);
	this.grounded = false;
	this.idle = true;
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

	this.grounded = false;

	if (top < bottom && top < left && top < right) {
		this.speed.v = 0; this.bb.coords.y = bb.getC().y;
	}

	if (bottom < top && bottom < left && bottom < right) {
		this.speed.v = 0; this.bb.coords.y = bb.coords.y - this.bb.size.h;
		this.grounded = true;
	}

	if (left < top && left < bottom && left < right) {
		this.speed.x = 0; this.bb.coords.x = bb.getC().x;
		this.idle = true;
	}

	if (right < top && right < bottom && right < left){
		this.speed.x = 0; this.bb.coords.x = bb.coords.x - this.bb.size.w;
		this.idle = true;
	}
};

Hum.prototype.decide = function() {
	var dice1 = Math.floor(Math.random()*5);
	var dice2 = Math.floor(Math.random()*5);
	var dice3 = dice1 + dice2;

	if (this.grounded && this.idle) {
		this.speed.h = (dice1 - dice2) * 15;
		this.idle = false;
	}

	if (this.grounded && dice3 == 8) {
		this.idle = true;
	}

	if (!this.grounded){
		console.log('flaying');
		this.speed.h = 0;
	}
};

Hum.prototype.gravitate = function() {
	if (this.speed.v < 30){
		this.speed.v += 5;
	}
	else {
		this.speed.v = 30;
	}
};

Hum.prototype.move = function(dt) {
	this.bb.coords.x += this.speed.h * dt / 1000;
	this.bb.coords.y += this.speed.v * dt / 1000;
};

Hum.prototype.update = function(dt) {
	this.gravitate();
	this.move(dt);
	this.resolveCollision();
	this.decide();
};
exports.Hum = Hum;