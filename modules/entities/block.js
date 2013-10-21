var entity = require('./entity.js');
var _ = require('underscore');

var Block = function() {
	this.objectType = "Block";
	this.bb = new entity.BoundingBox(0, 290, 800, 10);
	this.collisionInfo = new entity.CollisionInfo('hard', {});
};

Block.prototype.update = function() {

};

exports.Block = Block;