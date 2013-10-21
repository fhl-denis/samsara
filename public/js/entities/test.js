/*

	test.js

*/

var Hum = function(attributes) {
	var that = this;
	_.each(attributes, function(attr, name) {
		that[name] = attr;
	});
	console.log(this);
};

/*

	UPDATE

*/
Hum.prototype.update = function(attributes) {
	var that = this;
	_.each(attributes, function(attr, name) {
		that[name] = attr;
	});
};

/*

	DRAW

*/
Hum.prototype.draw = function(canvas, ctx) {
	ctx.beginPath();
	ctx.rect(this.bb.coords.x, this.bb.coords.y, this.bb.size.w, this.bb.size.h);
	ctx.fillStyle = 'yellow';
	ctx.fill();
	ctx.lineWidth = 2;
	ctx.strokeStyle = 'black';
	ctx.stroke();
	ctx.beginPath();
	ctx.rect(this.eye(), this.bb.coords.y + this.bb.size.h / 5, this.bb.size.w / 3, this.bb.size.h / 4);
	ctx.fillStyle = 'black';
	ctx.fill();
};

Hum.prototype.eye = function() {
	if (this.speed.h == 0){
		return this.bb.coords.x + this.bb.size.w / 3;
	}
	else if (this.speed.h > 0){
		return this.bb.coords.x + this.bb.size.w - this.bb.size.w / 3;
	}
	else if (this.speed.h < 0){
		return this.bb.coords.x;
	}
}

var Block = function(attributes) {
	var that = this;
	_.each(attributes, function(attr, name) {
		that[name] = attr;
	});
	console.log(this);
};

/*

	UPDATE

*/
Block.prototype.update = function(attributes) {
	var that = this;
	_.each(attributes, function(attr, name) {
		that[name] = attr;
	});
};

Block.prototype.draw = function(canvas, ctx) {
	ctx.beginPath();
	ctx.rect(this.bb.coords.x, this.bb.coords.y, this.bb.size.w, this.bb.size.h);
	ctx.fillStyle = 'grey';
	ctx.fill();
};
