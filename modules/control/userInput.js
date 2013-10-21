var _ = require('underscore');

var player = false;

exports.read = function(input) {
	if (!player){
		return;
	}
	// do sth with input
	console.log(input);
	player.moveTo = {
		x: Math.floor(input.click.x) - player.size.w / 2,
		y: Math.floor(input.click.y) - player.size.h / 2
	};
	return "ok";
};

exports.setPlayer = function(p) {
	player = p;
};