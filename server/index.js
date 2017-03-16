var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database-mongo/index.js')
var bodyParser = require('body-parser');


var app = express();

app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser());

app.get('/get', function(req, res) {
	res.send('connected');
});

app.listen(3000, function() {
  console.log('Magic happens on port 3000!');
});