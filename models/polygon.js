require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOURL);

const schema = new mongoose.Schema({
	ts: Date,
	url: String,
	filename: String,
	room: String,
	coordinates: [{
		lat: Number,
		lng: Number
	}]
});

const Polygon = mongoose.model('Polygon', schema);

function create(data, callback, errCb) {
	if (!data || !data.url || !data.coordinates || !data.filename) {
		errCb('Invalid data!');
	} else {
		var poly = new Polygon({
			ts: Date.now(),
			url: data.url,
			filename: data.filename,
			coordinates: data.coordinates
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

function list(room, callback, errCb) {
	Polygon.find({ room }, function(err, data) {
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
	create,
	get,
	list,
	remove,
	update
};
