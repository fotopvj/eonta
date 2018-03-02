var dotenv = require('dotenv').config();
var express = require('express');
var polygons = require('../controllers/polygons.js');
var router = express.Router();
var aws = require('aws-sdk');

/* GET home page. */
router.get('/', function(req, res) {
	res.render('eonta');
});

/* GET sign requests for AWS. */
router.get('/api/sign', function(req, res) {
	aws.config.update({
		accessKeyId: process.env.AS3_ACCESS_KEY,
		secretAccessKey: process.env.AS3_SECRET_ACCESS_KEY
	});

	var s3 = new aws.S3();
	var options = {
		Bucket: process.env.AS3_BUCKET,
		Key: req.query.file_name,
		Expires: 60,
		ContentType: req.query.file_type,
		ACL: 'public-read'
	};

	s3.getSignedUrl('putObject', options, function(err, data) {
		if (err) return res.send('Error with S3');

		res.json({
			signed_request: data,
			url: 'https://s3.amazonaws.com/' + process.env.AS3_BUCKET + '/' + req.query.file_name
		});
	});
});

router.get('/api/polygons', polygons.list);
router.get('/api/polygons/:id', polygons.get);
router.post('/api/polygons/', polygons.create);
router.post('/api/polygons/:id', polygons.update);
router.delete('/api/polygons/:id', polygons.remove);

module.exports = router;