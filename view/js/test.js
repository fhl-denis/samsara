/*

	test.js

*/

var Test = function() {
	this.counter = 0.0;
};

Test.prototype.update = function(dt) {
	this.counter += dt;
};

Test.prototype.draw = function() {
	console.log(this.counter);
};