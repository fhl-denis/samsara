/*

	canvas game

	params:

	canvas {} & ctx {} = html5 canvas objects
	updates [] = refs to objs which have an update function that takes a delta time as param
	draws [] = refs to objs which have a draw function that takes the canvas elements as params
	options {} = options hash
		- fps = frames/second defaults to 60
*/

var Game = function(canvas, ctx, connection, objectTypes, options) {

	// settings
	var defaults = {
		
	};
	this.settings = _.extend(defaults, options);

	// socket
	this.connection = connection;

	// html 5 canvas element object
	this.canvas = canvas;
	this.ctx = ctx;

	// entities
	this.objects = {};
	this.objectTypes = objectTypes;
};


/*

	loads the objects and starts the game-update-draw-loop after that	

*/
Game.prototype.start = function() {

	var that = this;

	// start the update/draw loop after load
	this.connection.onmessage = function (message) {
        // try to decode json (I assume that each message from server is json)
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }
        // handle incoming message
        if (json && json != "ok") {
        	that.update(json);
        	that.draw();
        }
    };

    this.userInput();
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
Game.prototype.update = function(objects) {
	var that = this;

	_.each(objects, function(uObject, name) {
		if (_.isUndefined(that.objectTypes[uObject.objectType])) {
			console.log(that.objectTypes);
			throw 'not implemented objectType';
		}
		if (_.isObject(that.objects[name])) {
			that.objects[name].update(uObject);
		}
		else {
			console.log(name + ': ' + 'new ' + uObject.objectType);
			that.objects[name] = new that.objectTypes[uObject.objectType](uObject);
		}
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
	_.each(that.objects, function(dObject, index) {
		dObject.draw(that.canvas, that.ctx);
	});
};

Game.prototype.userInput = function() {
	var that = this;

	var getMousePos = function(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
	}

	canvas.addEventListener('click', function(evt) {
		var mousePos = getMousePos(that.canvas, evt);
		var message = 'Mouse position: ' + mousePos.x + ', ' + mousePos.y;
		console.log(message);
		that.connection.send(JSON.stringify({
			h: "userInput",
			c: {
				click: mousePos
			}
		}));
	}, false);
};