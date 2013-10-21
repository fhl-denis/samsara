var _ = require('underscore');
var userInput = require('./userInput.js');
var loop = require('./loop.js');

var Hum = require('./../entities/hum.js').Hum;
var Block = require('./../entities/block.js').Block;

var responses = {
	error: function(c) {
		switch(c) {
			case 'wrong message type':
				console.log(c);
				break;
			case 'not a json':
				console.log(c);
				break;
		}
		return {h: 'error', c: c};
	},
	userInput: function(c) {
		return userInput.read(c);
	},
};

var messageReader = function(message){
	if (message.type === 'utf8') {
		try {
			msgObj = JSON.parse(message.utf8Data);
		}
		catch (e) {
			console.log(e);
			return {h:'error', c:'not a json'};
		}
		return msgObj;
	}
	else {
		return {h:'error', c:'wrong message type'};
	}
};

var messageResponder = function(msgObj, responses, fn) {
	if (_.isUndefined(responses[msgObj.h])){
		console.log('undefined request message header');
		return;
	}
	fn(JSON.stringify(responses[msgObj.h](msgObj.c)));
	console.log('message sent');
	return;
};

var connections = [];

// websocket message routing
exports.start = function(wsServer) {

    var loopOptions = {};
    var hum = new Hum;
    var block = new Block;
	loop.start({hum: hum, block: block}, loopOptions, function(updated) {
		_.each(connections, function(connection) {
			connection.send(JSON.stringify(updated));
		});
	});

	wsServer.on('request', function(request) {
	    var connection = request.accept(null, request.origin);
	    var connectionIndex = connections.length;
	    console.log('socket open: ' + connectionIndex);

	    // This is the most important callback for us, we'll handle
	    // all messages from users here.
	    connection.on('message', function(message) {
	        messageResponder(messageReader(message), responses, function(response) {
	        	connection.send(response);
	        });
	    });

	    connection.on('close', function(connection) {
	    	connections.splice(connectionIndex, 1);
	        console.log('socket close: ' + connectionIndex);
	    });

	    connections.push(connection);
	});
};

