// dependencies
var fs = require('fs');
var http = require('http');
var express = require('express');
var routes = require('./routes');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./oauth.js')
var passport = require('passport')
var User = require('./user.js')
var fbAuth = require('./authentication.js')

mongoose.connect('mongodb://localhost/test', function(err) { if (err) console.log('error occured', err); });

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

// routes
app.get('/', routes.index);

app.post('/myaction', function(req, res) {
  console.log('You sent the name "' + req.body.name + '".');
});

app.get('/api/users', function (req, res){
  return User.find(function (err, users) {
    if (!err) {
       return res.send(users);
    } else {
       return console.log(err);
    }
  });
});

app.get('/api/users/:id', function(req, res){
  return User.findById(req.params.id, function(err, user){
    if (!err) {
	return res.send(user);
    } else {
	return console.log(err);
    }
  });
});

/*app.post('/api/users/:id', function(req, res){
   console.log(req);
   return(res);  

});
*/
app.post('/api/users/:id', function (req, res){
  return User.findById(req.params.id, function (err, user) {
    user.name= req.body.name;
    return user.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(user);
    });
  });
});

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

app.post('/signup', function(req, res){
	console.log(req.body);	
	res.redirect('/account');
});


// port
app.listen(1337);

// test authentication
function ensureAuthenticated(req, res, next) {
if (req.isAuthenticated()) { return next(); }
	res.redirect('/')
}

