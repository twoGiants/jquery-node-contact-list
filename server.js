'use strict';

// dependencies
var express = require('express');
var bodyParser = require('body-parser');
var jsonfile = require('jsonfile');

// server
var app = express();

// conf
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(function (err, req, res, next) {
    console.error(err);
    res.status(500).send(err);
});

// openshift/local server conf
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

// save file config
var file = __dirname + '/public/tmp/data.json';
jsonfile.spaces = 4;


// ...
app.post('/add-contact', postCb);

function postCb(req, res) {
    var data = req.body;

    jsonfile.readFile(file, readFileCb);

    function readFileCb(err, obj) {
        var dataArr = [];
        
        if (err) {
            dataArr.push(data);
            jsonfile.writeFile(file, dataArr, writeFileCb);
            log('No data file found. Creating new data.json file in ' + file);

        } else {
            dataArr = obj;
            dataArr.push(data);
            jsonfile.writeFile(file, dataArr, writeFileCb);
        }
        
        function writeFileCb(err) {
            if(err) {
                log(err);
                res.send('Write file error!');
            } else {
                res.send('Data saved.');
            }
        }
    }
}


app.get('/contact-list', getCb);

function getCb(req, res, next) {
    jsonfile.readFile(file, readFileCb);
    
    function readFileCb(err, obj) {
        if (err) {
//            res.send('getCb: error reading file');
            log(err);
            next(err.messаge);
        } else {
            res.send(obj);
            log(obj);
        }
    }
}

// start app
app.listen(port, ipaddress, function () {
    console.log('Server running on http://' + ipaddress + ':' + port);
});

// helper
function log(data) {
    console.log(data);
}