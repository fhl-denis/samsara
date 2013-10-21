/*

	strumpoj fontend

*/
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

    return connection;
};

// Thats it!
var canvas = document.getElementById('game-view');
if (canvas.getContext){
	var ctx = canvas.getContext('2d');
	var game = new Game(canvas, ctx, socketGo(), {Hum: Hum});
	game.start();
}
else {
	console.log('shit browser!');
}