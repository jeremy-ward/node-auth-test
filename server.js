//=====  server.js  =====

//==set up =====================================================
//get all the tools we need
var express = require("express");
var app = express();
var port= process.env.PORT||8080;
var mongoose =require("mongoose");
var passport =require("passport");
var flash=require("connect-flash");

var morgan=require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");

var configDB = require("./config/database.js");

//configuration==================================================

//mongoose set-up
    mongoose.connection.on('open', function (ref) {
      console.log('Connected to mongo server.');
    });
    mongoose.connection.on('error', function (err) {
      console.log('Could not connect to mongo server!');
      console.log(err);
    });
    mongoose.connect(configDB.url);  //connect to our database

require("./config/passport.js")(passport); //pass passport for configuration

//set-up express application
app.use(morgan('dev'));  //log every request to the console
app.use(cookieParser()); //read cookies (needed for auths)
app.use(bodyParser());   //get information from HTML forms

app.set("view engine", "ejs");  //set up ejs as the templating engine

//required for passport
app.use(session({secret: "ethanhasreallyreadhair"})); //session secret
app.use((passport.initialize()));
app.use(passport.session());  //persisent login sessions
app.use(flash());  //use connect-flash for flash messages stored in session

//routes===========================================================
require("./app/routes.js")(app, passport);  //load our apps and pass in our app and fully configured passport

//launch app=======================================================
app.listen(port);
console.log("It is going down on port "+port);
