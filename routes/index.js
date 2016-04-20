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
	console.log(req)
});

module.exports = router;
