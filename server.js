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

// save file to data.json
app.post('/add-contact', postCb);

function postCb(req, res, next) {
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
                next(err.message);
            } else {
                res.send('Data saved.');
            }
        }
    }
}

// send contact list from data.json to front-end
app.get('/contact-list', getCb);

function getCb(req, res, next) {
    jsonfile.readFile(file, readFileCb);
    
    function readFileCb(err, obj) {
        if (err) {
            next(err.messаge);
        } else {
            res.send(obj);
        }
    }
}

// delete contact list entry
app.delete('/delete/:id', deleteCb);

function deleteCb(req, res, next) {
    var elementId = parseInt(req.params.id);
    
    jsonfile.readFile(file, readFileCb);
    
    function readFileCb(err, obj) {
        var index = 0;
        
        if (err) {
            console.log(err.message);
            next('reading file failed');
        }
        
        if (obj.length > 0) {
            index = obj.map(mapFn).indexOf(elementId);

            obj.splice(index, 1);
            
            jsonfile.writeFile(file, obj, writeFileCb);
        }
        
        // functions & cbs
        function writeFileCb(err) {
            if (err) {
                res.send('writing file after deleting user failed');
            } else {
                res.send('ok');
            }
        }
        
        function mapFn(x) {
            return x.id;
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