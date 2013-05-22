/*

	strumpoj
	router

*/

// utility
var _ = require('underscore');
var fs = require('fs');

// routes from config
var config = require('./config.json');

// modules
var db = require('./db/mongo.js');

// templating
var serveView = function(req, res, viewFile) {
	fs.readFile(__dirname + '/view/' + viewFile, function(err, text){
		text = String(text);
		var template = _.template(text);
		var templated = template({
			'baseUrl': global.baseUrl
		});
		res.set('Content-Type', 'text/html');
		res.send(templated);
	});
};

/* export */

// main
exports.start = function(app) {
	
	app.get('/', function(req, res) {
		console.log('router GET: /');
		serveView(req, res, 'index.html');
		return;
	})

	app.post('/save', function(req, res) {
		console.log('router POST: /save');
		console.log(req.body);
		db.save(req.body.name, req.body.criteria, req.body.objectData, function(result) {
			console.log(result);
			res.send(result);
		});
		return;
	})

	app.post('/load', function(req, res) {
		console.log('router POST: /load');
		db.load(req.body.name, req.body.criteria, function(result) {
			res.send(result);
		});
		return;
	})

	app.post('/delete', function(req, res) {
		console.log('router POST: /');
		db.del(req.body.name, req.body.criteria, function(result) {
			res.send('pong');
		});
		return;
	})

	// ping pong
	app.get('/ping', function(req, res) {
		console.log('router TESTROUTE GET: /pong');
		var pong = db.hi();
		res.send(pong);
		return;
	})
};