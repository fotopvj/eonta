require('dotenv').config();
const express = require('express');
const polygons = require('../controllers/polygons.js');
const router = express.Router();
const aws = require('aws-sdk');

/* GET home page. */
router.get('/', function(req, res) {
	res.redirect('/main');
});

/* GET sign requests for AWS. */
router.get('/api/sign', function(req, res) {
	aws.config.update({
		accessKeyId: process.env.AS3_ACCESS_KEY,
		secretAccessKey: process.env.AS3_SECRET_ACCESS_KEY
	});

	const s3 = new aws.S3();
	const options = {
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

router.get('/api/polygons/', polygons.list);
router.get('/api/polygons/:room', polygons.list);
router.get('/api/polygons/:id', polygons.get);
router.post('/api/polygons/', polygons.create);
router.post('/api/polygons/:id', polygons.update);
router.delete('/api/polygons/:id', polygons.remove);

router.get('/:room', function(req, res) {
	res.render('eonta');
});

module.exports = router;
