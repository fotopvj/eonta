var Polygon = require('../models/polygon.js')

function create(req, res) {
	Polygon.create(req.body, function(data) {
		res.json(data);
	}, function(error) {
		res.error(error);
	});
}

function get(req, res) {
	Polygon.get(req.params.id, function(data) {
		res.json(data);
	}, function(error) {
		res.error(error);
	});
}

function list (req, res) {
	Polygon.list(function(data) {
		res.json(data);
	}, function(error) {
		res.error(error);
	});
}

function remove(req, res) {
	Polygon.remove(req.params.id, function(data) {
		res.json(data);
	}, function(error) {
		res.error(error);
	});
}

function update(req, res) {
	Polygon.update(req.body, function(data) {
		res.json(data);
	}, function(error) {
		res.error(error);
	});
}

module.exports = {
	create: create,
	get: get,
	list: list,
	remove: remove,
	update: update
};
