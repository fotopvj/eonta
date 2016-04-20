var dotenv = require('dotenv').config();

var express = require('express');
var router = express.Router();
var knox = require('knox');

var s3 = knox.createClient({
	key: process.env.AS3_ACCESS_KEY,
	secret: process.env.AS3_SECRET_ACCESS_KEY,
	bucket: process.env.AS3_BUCKET,
});

/* GET home page. */
router.get('/', function(req, res) {
	res.render('eonta', {});
});

router.post('/upload', function(req, res) {
	var headers = {
		'x-amz-acl': 'public-read',
		'Access-Control-Allow-Origin': '*'
	};
	req.form.on('part', function(part) {
		console.log('part',part)
		headers['Content-Length'] = part.byteCount;
		s3.putStream(part, part.filename, headers, function(err, s3res) {
			if (err) {
				return res.send(500, err);
			}
			console.log(s3res);
			res.render('eonta', {});
		});
	});
});

module.exports = router;