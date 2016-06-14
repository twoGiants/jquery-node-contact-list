'use strict';

// dependencies
var express = require('express');

// server
var app = express();

// conf
app.use(express.static(__dirname + '/public'));

// openshift/local server conf
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

// routing
//app.get('/', function(res));

// start app
app.listen(port, ipaddress, function () {
    console.log('Server running on http://' + ipaddress + ':' + port);
});