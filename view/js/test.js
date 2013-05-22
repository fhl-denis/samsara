/*

	test.js

*/

var Test = function() {
	this.counter = 0.0;
};

Test.prototype.update = function(dt) {
	this.counter += dt;
};

Test.prototype.draw = function(canvas, ctx) {
	ctx.font = "bold 12px sans-serif";
	ctx.fillText(this.counter, 248, 43);
};