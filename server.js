'use strict';

// dependencies
var express = require('express');
var bodyParser = require('body-parser');
var jsonfile = require('jsonfile');

// server
var app = express();

// conf: local server
var ipaddress = '127.0.0.1';
var port = 3000;

// conf: save file
var file = __dirname + '/public/tmp/data.json';
jsonfile.spaces = 4;

// conf: app
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(serverError);

// ROUNTING

// save contact to data.json
app.put('/add-contact', putCb);

// send contact list from data.json to front-end
app.get('/contact-list', getCb);

// delete contact list entry
app.delete('/delete/:id', deleteCb);

// start app
app.listen(port, ipaddress, appListenCb);

//////////////////

function putCb(req, res, next) {
    var data = req.body;

    jsonfile.readFile(file, readFileCb);

    //////////////////
    
    function readFileCb(err, obj) {
        var dataArr = [];
        
        if (err) {
            console.log('No data file found. Creating new data.json file in ' + file);
            dataArr.push(data);
            jsonfile.writeFile(file, dataArr, writeFileCb);

        } else {
            dataArr = obj;
            dataArr.push(data);
            jsonfile.writeFile(file, dataArr, writeFileCb);
        }
        
        //////////////////
        
        function writeFileCb(err) {
            if(err) {
                next(err.message);
            } else {
                res.send('Contact saved.');
            }
        }
    }
}

function getCb(req, res, next) {
    jsonfile.readFile(file, readFileCb);
    
    //////////////////
    
    function readFileCb(err, obj) {
        if (err) {
            next(err.messаge);
        } else {
            res.send(obj);
        }
    }
}

function deleteCb(req, res, next) {
    var elementId = parseInt(req.params.id);
    
    jsonfile.readFile(file, readFileCb);
    
    //////////////////
    
    function readFileCb(err, obj) {
        var index = 0;
        
        if (err) {
            console.log(err.message);
            next('reading file failed');
        }
        
        // get index of element with id=elementId
        if (obj.length > 0) {
            index = obj.map(mapFn).indexOf(elementId);

            obj.splice(index, 1);
            
            jsonfile.writeFile(file, obj, writeFileCb);
        }
        
        //////////////////
        
        function writeFileCb(err) {
            if (err) {
                next('writing file after deleting user failed');
            } else {
                res.send('Deleting successfull.');
            }
        }
        
        function mapFn(x) {
            return x.id;
        }
    }
}

function appListenCb() {
    console.log('Server running on http://' + ipaddress + ':' + port);
}

function serverError(err, req, res, next) {
    console.error(err);
    res.status(500).send(err);
}
