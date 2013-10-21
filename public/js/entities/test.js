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
	ctx.rect(this.coords.x, this.coords.y, this.size.w, this.size.h);
	ctx.fillStyle = 'yellow';
	ctx.fill();
	ctx.lineWidth = 2;
	ctx.strokeStyle = 'black';
	ctx.stroke();
};