var dotenv = require('dotenv').config();
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOURL);

var schema = new mongoose.Schema({
	ts: Date,
	url: String,
	polygon: mongoose.Schema.Types.Mixed
});

var Polygon = mongoose.model('Polygon', schema);

function create(data, callback, errCb) {
	if (!data || !data.url || !data.polygon) {
		errCb('Invalid data!')
	} else {
		var poly = new Polygon({
			ts: Date.now(),
			url: data.url,
			polygon: data.polygon
		});
		poly.save(function(err, dbData) {
			if (err) {
				errCb(err);
			} else {
				callback(dbData);
			}
		});
	}
}

function get(id, callback, errCb) {
	Polygon.findById(id, function(err, data) {
		if (err) {
			errCb(err);
		} else {
			callback(data);
		}
	});
}

function list(callback, errCb) {
	Polygon.find(function(err, data) {
		if (err) {
			errCb(err);
		} else {
			callback(data);
		}
	});
}

function remove(id, callback, errCb) {
	Polygon.findByIdAndRemove(id, function(err, data) {
		if (err) {
			errCb(err);
		} else {
			callback(data);
		}
	});
}

function update(data, callback, errCb) {
	Polygon.findByIdAndUpdate(data.id, data, function(err, data) {
		if (err) {
			errCb(err);
		} else {
			callback(data);
		}
	});
}

module.exports = {
	create: create,
	get: get,
	list: list,
	remove: remove,
	update: update
};