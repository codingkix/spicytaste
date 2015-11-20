// BASE SETUP
// ======================================
// CALL THE PACKAGES --------------------
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser'); // get body-parser
var morgan = require('morgan'); // used to see requests
var mongoose = require('mongoose');
var config = require('./config');
var path = require('path');

// APP CONFIGURATION ==================
// ====================================
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// configure app to handle CORS requests
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-type,X-Auth');
    next();
});

// log all requests to the console 
app.use(morgan('dev'));

// connect to database
mongoose.connect(process.env.MONGOLAB_URI || config.database);

// set static files location
app.use(express.static(__dirname + '/public'));


// ROUTES FOR OUR API =================
// ====================================

// API ROUTES ------------------------
app.use(require('./app/routes'));


// MAIN CATCHALL ROUTE --------------- 
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/ng/views/index.html'));
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

    app.use(function(err, req, res, next) {
        console.log('error request', req.url);
        console.log('error', err);
        res.status(err.status || 500);
        res.json({
            success: false
        });
    });

}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        success: false
    });
});

// START THE SERVER
// ====================================
app.listen(config.port);
console.log('SpicyTaste starts on port ' + config.port);
