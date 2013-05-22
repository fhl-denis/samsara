/*

	strumpoj fontend

*/

// View //
MainView = Backbone.View.extend({
	
	tagName: "section",

	events: {
		
  	},

	initialize: function() {

		_.bindAll(this, 'render');
		// _.templating like: {{ bla }}
		_.templateSettings = {
			interpolate : /\{\{(.+?)\}\}/g
		};
		this.render();
	},

	render: function() {
		console.log('render main view');
	},
});

// # Router //
Router = Backbone.Router.extend({

	routes: {

		//init route
		'start': 'start',
	},
	
	initialize: function() {
		console.log('#: init');

		// Main View / Presenter
		var mainView = new MainView({el: $('section#main')});

		// _.mixins for pure functions
		var mixins = new MixinCollection([], {name: "underscore_mixins"});
		mixins.fetch(function(collection) {
			collection.toMixin();
		});

		// history #
		console.log('#: start');
		if (Backbone.history.start() === false){
			Backbone.history.navigate('#start', {trigger: true});
		}
	}

});

var socketGo = function () {
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    var connection = new WebSocket('ws://127.0.0.1:1337');

    connection.onopen = function () {
        console.log('socket open');
    };

    connection.onerror = function (error) {
        // an error occurred when sending/receiving data
        console.log(error);
    };

    connection.onmessage = function (message) {
        // try to decode json (I assume that each message from server is json)
        try {
            var json = JSON.parse(message.data);
            console.log(json);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }
        // handle incoming message
    };

    var sendMsg = function(message) {
    	connection.send(message);
    	return message;
    };

    return sendMsg;
};

var sendMsg;

// Thats it!
$(document).ready(function() {
	var router = new Router();
	var canvas = document.getElementById('game-view');
	if (canvas.getContext){
		var ctx = canvas.getContext('2d');
		var test = new Test();
		var loads = [];
		var updates = [
			test
		];
		var draws = [
			test
		];
		var options = {
			fps: 1
		};
		var game = new Game(canvas, ctx, loads, updates, draws, options);
		game.start();
	} else {
		$('body').html('Html5 canvas not supported! Get a modern browser!');
	}
});