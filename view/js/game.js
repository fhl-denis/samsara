/*

	canvas game

	params:

	canvas {} & ctx {} = html5 canvas objects
	updates [] = refs to objs which have an update function that takes a delta time as param
	draws [] = refs to objs which have a draw function that takes the canvas elements as params
	options {} = options hash
		- fps = frames/second defaults to 60
*/

var Game = function(canvas, ctx, loads, updates, draws, options) {

	// settings
	var defaults = {
		fps: 60
	};
	this.settings = _.extend(defaults, options);

	// html 5 canvas element object
	this.canvas = canvas;
	this.ctx = ctx;

	// load objects
	_.each(loads, function(value, key) {
		if (!_.isObject(value)) {
			throw new Exception();
		}
	});
	this.loads = loads;

	// update objects
	_.each(updates, function(value, key) {
		if (!_.isObject(value)) {
			throw new Exception();
		}
	});
	this.updates = updates;

	// draw objects
	_.each(draws, function(value, key) {
		if (!_.isObject(value)) {
			throw new Exception();
		}
	});
	this.draws = draws;
};


/*

	loads the objects and starts the game-update-draw-loop after that	

*/
Game.prototype.start = function() {

	// calculate the delta time
	// each update object gets a reference to delta time
	var dt = 1000/this.settings.fps;

	// start the update/draw loop after load
	var that = this;
	that.load(function() {
		setInterval(function() {
			that.update(dt);
			that.draw();
		}, dt);
	});
	
};

/*

	the load method takes the ready callback as an argument which can be
	the start method.

	the load method is ready after all load objects have finished loading
	synchonously or asynchronously.

*/
Game.prototype.load = function(ready) {
	var checkIn = this.loads.length;
	if (checkIn === 0) {
		ready();
	}
	var checkOut = function() {
		checkIn--;
		if (checkIn === 0) {
			ready();
		}
	};
	_.each(this.loads, function(lObject, index) {
		lObject.load(checkOut);
	});
};

/*

	the game's continuous non-event-based calculations happen here.
	the update objects have to implement an update method.

	the update method takes the delta time as an argument
	and passes it to the updatable objects.

*/
Game.prototype.update = function(dt) {
	_.each(this.updates, function(uObject, index) {
		uObject.update(dt);
	});
};

/*

	the game's drawing to the canvas happens in here.
	the draw objects have to implement a draw method.

	the draw method takes the 2d canvas and context as arguments
	and passes them to the drawable objects.

*/
Game.prototype.draw = function() {
	var that = this;

	// clear the drawing area
	that.ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);
	_.each(this.draws, function(dObject, index) {
		dObject.draw(that.canvas, that.ctx);
	});
};