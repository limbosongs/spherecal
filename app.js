// dependencies
var fs = require('fs');
var http = require('http');
var express = require('express');
var routes = require('./routes');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./oauth.js')
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;

/*

// global config
var app = express();
app.set('port', process.env.PORT || 1337);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// env config
app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});
*/
// mongo config

// mongo model
// var Model_Name = require('add_your_models_here');

// routes
//app.get('/', routes.index);
//app.get('/ping', routes.ping);

// serialize and deserialize
//passport.serializeUser(function(user, done) {
//done(null, user);
//});
//passport.deserializeUser(function(obj, done) {
//done(null, obj);
//});


// run server
//app.listen(app.get('port'), function(){
//  console.log('\nExpress server is listening on port ' + app.get('port'));
//});

// connect to the database
//var db = mongoose.connect('mongodb://localhost/test');

mongoose.connect('mongodb://localhost/test', function(err) { console.log('error occured', err); });


var schema = mongoose.Schema({ oauthID: 'number', name: 'string'});

// create a user model
var User = mongoose.model('User', schema);

//mongoose.model('User', User);

//var Users = db.model('User');



// config
//passport.use(new FacebookStrategy({
// clientID: config.facebook.clientID,
// clientSecret: config.facebook.clientSecret,
// callbackURL: config.facebook.callbackURL
//},
//function(accessToken, refreshToken, profile, done) {
// process.nextTick(function () {
//   return done(null, profile);
// });
//}
//));





passport.use(new FacebookStrategy({
clientID: config.facebook.clientID,
clientSecret: config.facebook.clientSecret,
callbackURL: config.facebook.callbackURL
},
function(accessToken, refreshToken, profile, done) {
User.findOne({ oauthID: profile.id }, function(err, user) {
if(err) { console.log(err); }
if (!err && user != null) {
  done(null, user);
} else {
  var user = new User({
    oauthID: profile.id,
    name: profile.displayName,
    created: Date.now()
  });
  user.save(function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("saving user ...");
      done(null, user);
    };
  });
};
});
}
));



// serialize and deserialize
passport.serializeUser(function(user, done) {
 console.log('serializeUser: ' + user._id)
 done(null, user._id);
});
passport.deserializeUser(function(id, done) {
 User.findById(id, function(err, user){
     console.log(user)
     if(!err) done(null, user);
     else done(err, null)
 })
});





var app = express();

app.configure(function() {
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'my_precious' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(__dirname + '/public'));
});

// routes
app.get('/', routes.index);
app.get('/ping', routes.ping);


app.get('/account', ensureAuthenticated, function(req, res){
User.findById(req.session.passport.user, function(err, user) {
 if(err) {
   console.log(err);
 } else {
   res.render('account', { user: user});
 };
});
});

/*
app.get('/', function(req, res){
res.render('login', { user: req.user });
});

app.get('/auth/facebook',
passport.authenticate('facebook'),
function(req, res){
});
app.get('/auth/facebook/callback',
passport.authenticate('facebook', { failureRedirect: '/' }),
function(req, res) {
 res.redirect('/account');
});

*/

app.get('/', routes.index);
app.get('/ping', routes.ping);
app.get('/account', ensureAuthenticated, function(req, res){
res.render('account', { user: req.user });
});
app.get('/auth/facebook',
passport.authenticate('facebook'),
function(req, res){
});
app.get('/auth/facebook/callback',
passport.authenticate('facebook', { failureRedirect: '/' }),
function(req, res) {
 res.redirect('/account');
});



app.get('/logout', function(req, res){
req.logout();
res.redirect('/');
});

// port
app.listen(1337);

// test authentication
function ensureAuthenticated(req, res, next) {
if (req.isAuthenticated()) { return next(); }
res.redirect('/')
}

