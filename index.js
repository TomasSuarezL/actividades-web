var express = require('express'),
    app = express(),
    bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var request = require('request');
var exphbs = require('express-handlebars');
var morgan = require('morgan');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var session = require('express-session');
var config = require('./config'); // get our config file
const PORT = process.env.PORT || 3000;
// var todoRoutes = require('./routes/todos');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan('dev'));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/dist'));
app.use(express.static(__dirname + '/static'));
app.use(cookieParser());
app.use(session({
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60000000
    }
}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.set('superSecret', config.secret); // secret variable

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    partialsDir: __dirname + '/views/partials/'
}));
app.set('view engine', 'handlebars');

var sessionChecker = (req, res, next) => {
    if (!req.session.user) {
        req.session.lastUrl = req.originalUrl;
        res.redirect('/login');
    } else {
        next();
    }
};

app.get('/', sessionChecker, function (req, res) {
    res.render("main");
});

app.get('/login', function (req, res) {
    if (!req.session.user) res.render("login", {
        layout: false
    })
    else res.redirect('/');
});

//TODO: usar request-promise
app.post('/login', function (req, response) {
    let urlAuth = "http://192.168.2.4/actividadesapi/api/usuarios/authenticate";

    request.post({
        url: urlAuth,
        form: {
            username: req.body.username,
            password: req.body.password
        }
    }, function (err, httpResponse, body) {
        if (httpResponse.statusCode == 200) {
            req.session.token = body;
            req.session.user = req.body.username;
            response.json({
                "usuario": req.session.user,
                "lastUrl": req.session.lastUrl,
                "token": req.session.token
            });
        } else {
            console.log(httpResponse);
            response.json({
                "statusCode": httpResponse.statusCode,
                "body": body
            })
        }
    });

});

app.get('/logout', function (req, res) {
    if (req.session.user) {
        req.session.destroy();
    }
    res.json({
        status: "logout"
    });
});

app.get('/deportista/:deportistaId', sessionChecker, function (req, res) {
    var id = req.params.deportistaId;
    res.render('deportista', {
        layout: false,
        id: id
    });
});

app.listen(PORT, function () {
    console.log("APP IS RUNNING ON PORT " + PORT);
});