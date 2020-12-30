const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const deasync = require('deasync');
const readConfig = require('jsonfile').readFileSync;
const users = require('./routes/users');
const workflow = require('./routes/workflow');
const approvers = require('./routes/approvers');

//Load Config File
try {
    var config = readConfig(process.argv[2] || "config.json");
} catch (e) {
    console.log("[error] " + new Date().toGMTString() + " : Server Config Not Found.");
    return process.exit(-1);
}

const initComponents = function (app) {
    app.use(cors());

    app.use(bodyParser.json({ limit: '10mb', extended: true }));
    // Body Parser Middleware
    // app.use(bodyParser.json({limit: '10mb', extended: true}));

    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

    app.use('/users', users);

    app.use('/workflow', workflow);

    app.use('/approvers', approvers);

}
global.__database = config.database;

global.__logPath = config.paths.logs || "./logs";
global.__connect = null;

var rdbms = require('./rdbms/config/connect');

const dirs = [__logPath];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
});

// Global Inspection Function
global.__inspect = function (obj, stringify) {
    console.log("[inspect] " + new Date().toGMTString() + " : OBJECT => ", ((stringify) ? JSON.stringify(obj) : obj));
    return obj;
}


global.__appRoot = path.resolve(__dirname);

//Set logger
//Global Debug Function
global.__debug = function (msg, obj, stringify) {
    if (obj)
        console.log("[debug] " + new Date().toGMTString() + " : " + msg + " => ", ((stringify) ? JSON.stringify(obj) : obj));
    else
        console.log("[debug] " + new Date().toGMTString() + " : " + msg);
    return obj;
}

//Global Error Function
global.__error = function (msg, obj) {
    var data;
    if (obj)
        console.log("[error] " + new Date().toGMTString() + " : " + msg + " => ", obj.stack || JSON.stringify(obj));
    else
        console.log("[error] " + new Date().toGMTString() + " : " + msg);
    return obj;
}

//Global Info Function
global.__info = function (msg, obj, stringify) {
    if (obj)
        console.log("[info] " + new Date().toGMTString() + " : " + msg + " => ", ((stringify) ? JSON.stringify(obj) : obj));
    else
        console.log("[info] " + new Date().toGMTString() + " : " + msg);
    return obj;
}
//Global Security Function
global.__security = function (ip, msg, obj, stringify) {
    if (obj)
        console.log("[security] " + new Date().toGMTString() + " : " + ip + " : " + msg + " => ", ((stringify) ? JSON.stringify(obj) : obj));
    else
        console.log("[security] " + new Date().toGMTString() + " : " + ip + " : " + msg);
    return obj;
}

var app = express();

//External Modules
// var bodyParser = require('body-parser');

//App Use

//Check if UI enabled and hence those features
initComponents(app);


if (__database.enable == true) {
    try {
        __connect = deasync(rdbms)();
        console.log('connection also done');
        //Call further db calls at initialization here
    } catch (err) {
        __error("Database Initialization Failed", err);
    }
}


app.use(function (err, req, res, next) {
    __error('INTERNAL_SERVER_ERROR', err);
    res.status((err.status || 500));
    // Respond with HTML page
    if (req.accepts('html')) {
        return res.send('Internal Server Error. Status Code: ' + (err.status || 500));
    }

    // Respond with json
    if (req.accepts('json')) {
        return res.json({ error: 'INTERNAL_SERVER_ERROR', msg: { success: false, code: (err.status || 500) } });
    }
    // Default to plain-text. send()
    return res.type('txt').send('Internal Server Error. Status Code: ' + (err.status || 500));
});


var server = app.listen(config.port || 3001, function () {
    __info('Welcome to Project Interface! Create End Point Here!');
});
