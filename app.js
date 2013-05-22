// pasci sagt: hoi denis
/*
	samsara
	index
*/

// modules
var express = require('express');
var app = express();
var http = require('http');
var _ = require('underscore');
var router = require('./router.js');
var messages = require('./messages.json');
var WebSocketServer = require('websocket').server;

// say hi first
console.log(messages.greeting);

// configure
app.configure(function(){
	// static public file serving
	app.use('/public', express.static(__dirname + '/view'));
	// POST object parser
	app.use(express.bodyParser({uploadDir: __dirname + '/fileuploads'}));
});

// global namespace
app.use(function(req, res, next){
	global.baseUrl = 'http://' + req.headers.host;
	next();
});

// http routing
router.start(app);

// http server init
httpServer = http.createServer(app);
httpServer.listen(1337);
console.log('http on port 1337');

/*
// create the server
wsServer = new WebSocketServer({
    httpServer: httpServer
});

// WebSocket server
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    console.log('socket open');

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('client message: ' + message.utf8Data);
        }
    });

    setInterval(function() {
    	connection.send(JSON.stringify({
    		"serverDate": new Date()
    	}));
    }, 3000);

    connection.on('close', function(connection) {
        console.log('socket close');
    });
});*/
