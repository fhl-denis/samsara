var entity = require('./entity.js');
var _ = require('underscore');

var Block = function(x, y, w, h) {
	this.objectType = "Block";
	this.bb = new entity.BoundingBox(x, y, w, h);
	this.collisionInfo = new entity.CollisionInfo('hard', {});
};

Block.prototype.update = function() {

};

exports.Block = Block;