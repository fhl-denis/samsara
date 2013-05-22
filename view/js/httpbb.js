/*

	http bb

*/

var Model = Backbone.Model.extend({
	
	initialize: function() {
		console.log('init model: ');
		console.log(this.attributes);
		if (!_.isUndefined(this.get('_id'))) {
			console.log('pre fetched');
			this.id = this.get('_id');
			this.unset('_id');
			return;
		}
		if (_.isUndefined(this.id)) {
			this.setDefaults();
			this.getId();
		}
		else {
			this.fetch();
		}
	},

	setDefaults: function() {
		this.set({
			date: new Date()
		});
	},

	getId: function() {
		console.log('getId');
		var that = this;
		$.ajax({
			type: "POST",
			url: baseUrl + "/save",
			data: {
				name: that.collection.name,
				criteria: false,
				objectData: that.attributes
			},
			dataType: 'json',
			success: function(data) {
				console.log(data);
				that.set({
					id: data.result[0]._id
				});
			}
		});
	},

	fetch: function() {
		if (_.isUndefined(this.id)) {
			return false;
		}
		console.log('fetch: ' + this.id);
		var that = this;
		$.ajax({
			type: "POST",
			url: baseUrl + "/load",
			data: {
				name: that.collection.name,
				criteria: {
					"_id": this.id
				}
			},
			dataType: 'json',
			success: function(data) {
				console.log(data);
				delete data.result[0]._id;
				if (!_.isUndefined(data.result[0].fn)) {
					data.result[0].fn = data.result[0].fn.code;
				}
				that.set(data.result[0]);

			}
		});
	},

	save: function() {
		if (_.isUndefined(this.id)) {
			return false;
		}
		console.log('save: ' + this.id);
		var that = this;
		$.ajax({
			type: "POST",
			url: baseUrl + "/save",
			data: {
				name: that.collection.name,
				criteria: {
					"_id": this.id
				},
				objectData: this.attributes
			},
			dataType: 'json',
			success: function(data) {
				console.log(data);
			}
		});
	},

	destroy: function() {
		if (_.isUndefined(this.id)) {
			console.log('trying to delete model w/o id');
			return false;
		}
		console.log('destroy: ' + this.id);
		var that = this;
		$.ajax({
			type: "POST",
			url: baseUrl + "/delete",
			data: {
				name: that.collection.name,
				criteria: {
					"_id": that.id
				}
			},
			dataType: 'json',
			success: function(data) {
				console.log(data);
			}
		});
	}
});

var Collection = Backbone.Collection.extend({

	model: Model,

	name: '',

	initialize: function(models, options) {
		this.name = options.name;
		console.log(this.name);
	},

	fetch: function(callback) {
		callback = (_.isUndefined(callback)) ? function(){return;} : callback;
		this.reset();
		var that = this;
		$.ajax({
			type: "POST",
			url: baseUrl + "/load",
			data: {
				name: this.name,
				criteria: {}
			},
			dataType: 'json',
			success: function(data) {
				console.log(data);
				data.result.collection = that;
				_.each(data.result, function(value, key) {
					if (!_.isUndefined(value.fn)) {
						value.fn = value.fn.code;
					}
					if (!_.isUndefined(value.type) && value.type == "fnRef") {
						that.makeFn(value.name, value.fnName, value.argsNames, false);
						delete data.result[key];
					}
				});
				that.add(data.result);
				callback(that);
			}
		});
	},

	save: function() {
		/*this.each(function(model) {
			model.save();
		});*/
	},

	destroy: function() {
		/*this.each(function(model) {
			model.destroy();
		});*/
	},

	makeFn: function(name, fnName, argsNames, store) {
		
		store = (_.isUndefined(store)) ? true : store;

		// build the function
		this[name] = function(id) {
			var that = this;
			var args = [];
			_.each(argsNames, function(value, key) {
				args[key] = that.get(id).get(value);
			});
			return _[fnName](args);
		};

		// store a reference for the db
		if (!store) {
			return;
		}
		var fnRef = {
			type: "fnRef",
			name: name,
			fnName: fnName,
			argsNames: argsNames
		};
		this.add(fnRef);
	},

});

var MixinModel = Model.extend({
	setDefaults: function() {
		if (_.isUndefined(this.get('name')) || _.isUndefined(this.get('fn'))) {
			throw new Exception;
		}
	}
});

var MixinCollection = Collection.extend({
	model: MixinModel,
	toMixin: function() {
		var mixins = {};
		this.each(function(model) {
			console.log(model);
			mixins[model.get('name')] = eval('(' + model.get('fn') + ')');
		});
		console.log(mixins);
		_.mixin(mixins);
	}
});