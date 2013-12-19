// dependencies
var fs = require('fs');
var http = require('http');
var express = require('express');
var routes = require('./routes');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./oauth.js')
var passport = require('passport')
var User = require('./models/user.js')
var fbAuth = require('./authentication.js')
var Sphere = require('./models/sphere.js')
var Event = require('./models/event.js')

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

app.get('/api/spheres', function (req, res){
  return Sphere.find(function (err, spheres) {
    if (!err) {
       return res.send(spheres);
    } else {
       return console.log(err);
    }
  });
});

app.get('/api/spheres/:id', function(req, res){
  return Sphere.findById(req.params.id, function(err, sphere){
    if (!err) {
        return res.send(sphere);
    } else {
        return console.log(err);
    }
  });
});

app.post('/api/events', function (req, res){
  return Event.findById(req.params.id, function (err, event) {
    Event.findOne({ name: req.body.name}, function(err, event) {
      if(err) { console.log(err); }
         else {
          var event = new Event({
            name : req.body.name,
            location : req.body.location,
            startTime : req.body.startTime,
            endTime : req.body.endTime,
            description : req.body.description,
            invitedSpheres : req.body.invitedSpheres,
	    invitedUsers : req.body.inviteddUsers,
	    photoUrl : req.body.photoUrl,
          });
          event.save(function(err) {
            if(err) {
              console.log(err);
            } else {
              console.log("saving event...");
              res.send(event);
            };
          });
       };
     });
});
});



app.post('/api/spheres', function (req, res){
  return Sphere.findById(req.params.id, function (err, sphere) {
    Sphere.findOne({ name: req.body.name}, function(err, sphere) {
      if(err) { console.log(err); }
         else {
          var sphere = new Sphere({
            name : req.body.name,
	    location : req.body.location,
	    description : req.body.description,
	    userList : req.body.userList,
	    adminList : req.body.adminList,
	    type : req.body.type, 	
          });
          sphere.save(function(err) {
            if(err) {
              console.log(err);
            } else {
              console.log("saving sphere...");
              res.send(sphere);
            };
          });
       };
     });
});
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

app.get('/contact', function(req, res){
        res.render('contact', { user: req.user });
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


app.get('/spheres', ensureAuthenticated, function(req, res){
        res.render('spheres', { user: req.user });
});

app.get('/events', ensureAuthenticated, function(req, res){
        res.render('events', { user: req.user });
});

app.get('/event-discover', ensureAuthenticated, function(req, res){
        Event.find(function(err, results){
        res.render('event-discover', {results: results, user: req.user });
	});
});



// port
app.listen(1337);

// test authentication
function ensureAuthenticated(req, res, next) {
if (req.isAuthenticated()) { return next(); }
        res.redirect('/')
}

