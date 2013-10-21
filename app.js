// so, gahts äch jez?
/*
	samsara
	index
*/

// modules
var express = require('express');
var app = express();
var http = require('http');
var _ = require('underscore');
var router = require('./modules/control/router.js');
var messages = require('./messages.json');
var WebSocketServer = require('websocket').server;

// say hi first
console.log(messages.greeting);

// configure
app.configure(function(){
	// static public file serving
	app.use('/', express.static(__dirname + '/public'));
	// POST object parser
	app.use(express.bodyParser({uploadDir: __dirname + '/fileuploads'}));
});

// global namespace
app.use(function(req, res, next){
	global.baseUrl = 'http://' + req.headers.host;
	next();
});

// http server init
httpServer = http.createServer(app);
httpServer.listen(1337);
console.log('http on port 1337');


// create the server
wsServer = new WebSocketServer({
    httpServer: httpServer
});

// websocket routing
router.start(wsServer);