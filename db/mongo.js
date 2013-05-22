/*

mongodb

*/

var mongo = require('mongodb');
var _ = require('underscore');

// mongodb
var mongodb = new mongo.Db('test', new mongo.Server("127.0.0.1", 27017, {}), {w: 1});

var connect = function(collName, fn){
	mongodb.open(function(err, p_mongodb) {
		mongodb.collection(collName, function(err, collection){
			fn(err, collection, function() {
				mongodb.close();
			});
		});
	});
};

// function filter
var fnSaveFilter = function(object) {
	if (!_.isUndefined(object.fn)) {
		object.fn = new mongo.Code(object.fn);
	}
	return object;
};

var fnLoadFilter = function(object) {
	object = new mongo.BSON().serialize(object, false, true, true);
	return object;
}

/* export */

// CRUD
exports.save = function(collName, criteria, object, fn){
	object = fnSaveFilter(object);
	connect(collName, function(err, collection, closeCon) {
		if (criteria === 'false') {
			collection.insert(object, { save: true }, function(err, objects) {
				if (err) {
					console.warn(err.message);
				}
	        	else {
	        		console.log('successfully inserted');
	        	}
	        	closeCon();
	        	console.log(objects)
	        	fn({result: objects});
			});
		}
		else {
			var BSON = mongo.BSONPure;
			criteria._id = new BSON.ObjectID(object.id);
			delete object.id;
			collection.update(criteria, { $set: object }, {
				safe: true,
				multi: true,
				upsert: true
			}, function(err) {
				if (err) {
					console.warn(err.message);
				}
	        	else {
	        		console.log('successfully updated');
	        	}
	        	closeCon();
	        	fn('update');
			});
		}
	});
};

exports.load = function(collName, criteria, fn) {
	connect(collName, function(err, collection, closeCon) {
		if (_.isUndefined(criteria)) {
			criteria = {};
		}
		else {
			var BSON = mongo.BSONPure;
			criteria._id = new BSON.ObjectID(criteria._id);
		}
		collection.find(criteria).toArray(function(err, results) {
			console.log(results);
			closeCon();
			_.each(results, function(value, key) {
				value = fnLoadFilter(value);
			});
			fn({result: results});
		});
	});
};

exports.del = function(collName, criteria, fn) {
	connect(collName, function(err, collection, closeCon) {
		var BSON = mongo.BSONPure;
		criteria._id = new BSON.ObjectID(criteria._id);
		collection.remove(criteria, false, function(err, results) {
			console.log(results);
			closeCon();
			fn(results);
		});
	});
};

// test function
exports.hi = function(){
	var	test = function (err, collection, fn) {
			collection.insert({a:2}, function(err, docs) {

				collection.count(function(err, count) {
					console.log(count);
				});

				// Locate all the entries using find
				collection.find().toArray(function(err, results) {
					console.log(results.length);
					console.log(results[0].a);
					fn();
				});
			});
		},
		test2 = function(err, collection, fn) {
			console.log('hi:');
			var what = new Date();
			console.log(what);
			console.log('results:');
			collection.insert({date: what}, function(err, docs) {
				collection.find().toArray(function(err, results) {
					console.log(results);
					fn();
				});
			});
		};

	connect('test_insert', test2);
};