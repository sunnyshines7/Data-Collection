
// compatible API routes.
const Express = require('express');
const ParseServer = require('parse-server').ParseServer;
// import * as multer from 'multer';
var multer = require('multer');

const ParseDashboard = require('parse-dashboard');
// const serverURL =  'http://localhost:8081/parse';
// const serverURL = "http://192.168.0.115:8081/parse/";
const serverURL = "http://192.168.1.43:8081/parse/";

var Server = new ParseServer({
    "databaseURI": 'mongodb://admin:admin123@localhost:27017/dataCollection',
    "cloud": __dirname + '/cloud/main.js',
    "appId": 'AGdJfMjQmSpVsXuZx4z6C9EbGeKgNjRnTqVtYv2y',
    "masterKey": 'MjQmSqVsXu2x4z6C9EbGeKgNkRnTqWtYv2y5A7Ca',
    "restAPIKey": "kRnTqWtYv3y5A7DaFcHfMhPkSpUrXuZw3z6B8DbG",
    "javascriptKey": 'C9EbHeKgNkRnTqWtYv2y5A7DaFcHfMhPkSpUrXuZ',
    "appName": 'DataCollection',
    "verifyUserEmails": false,
    "serverURL": serverURL,
    "publicServerURL": serverURL
});

var App = Express();
// App.use(Express.static('public'));
App.use('/photo', Express.static('photo'));

var trustProxy = true;
var dashboard = new ParseDashboard({
    "apps": [
        {
            "serverURL": serverURL,
            "appId": 'AGdJfMjQmSpVsXuZx4z6C9EbGeKgNjRnTqVtYv2y',
            "masterKey": 'MjQmSqVsXu2x4z6C9EbGeKgNkRnTqWtYv2y5A7Ca',
			"restAPIKey": "kRnTqWtYv3y5A7DaFcHfMhPkSpUrXuZw3z6B8DbG",
            "javascriptKey": 'C9EbHeKgNkRnTqWtYv2y5A7DaFcHfMhPkSpUrXuZ',
            "appName": "DataCollection"
        }
    ],
    "users": [
        {
            "user":"admin",
            "pass":"123456"
        }
    ],
    "useEncryptedPasswords": false,
    "trustProxy": 1
}, true);

// Serve the Parse API on the /parse URL prefix
var MountPath = '/parse';
App.use(MountPath, Server);

// Serve the Parse Dashboard on the /dasboard URL prefix
var MountPath = '/dashboard';
App.use(MountPath, dashboard);

// Parse Server plays nicely with the rest of your web routes
App.get('/', function (req, res) {
    res.status(200).send('Welcome to DataCollection.');
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
            cb(null, 'Photo')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+'.png')
    }
})
let upload = multer({ storage: storage })
App.post('/uploadImages', upload.single('image'), function(req, res){
    console.log("in")
    console.log(req.file);
    res.send(req.file);
});


var port = 8081;
var httpServer = require('http').createServer(App);
httpServer.listen(port, function() {
    console.log('DataCollection running on localhost:8081');
});



