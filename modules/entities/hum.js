var entity = require('./entity.js');
var _ = require('underscore');

var Hum = function() {
	this.objectType = 'Hum';
	this.coords = new entity.Coords(0, 0);
	this.size = new entity.Size(50, 50);
	//this.collisionInfo = new CollisionInfo('player', {});

	this.bb = new entity.BoundingBox(this);

	this.speed = 200;
	this.moveTo = new entity.Coords(100, 100);
};

Hum.prototype.move = function(dt) {
	var dx = this.moveTo.x - this.coords.x,
		dy = this.moveTo.y - this.coords.y,
		d0, scale, rx, ry, actualSpeed;

	if (dx == 0 && dy == 0){
		console.log('no move');
		return;
	}

	d0 = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
	actualSpeed = this.speed * dt / 1000;
	if (d0 <= actualSpeed){
		console.log(d0);
		this.coords.x = this.moveTo.x;
		this.coords.y = this.moveTo.y;
		return;
	}

	rx = actualSpeed * dx / d0;
	ry = actualSpeed * dy / d0;

	this.coords.x += rx;
	this.coords.y += ry;
	console.log(this);
};

Hum.prototype.update = function(dt) {
	this.move(dt);
};
exports.Hum = Hum;