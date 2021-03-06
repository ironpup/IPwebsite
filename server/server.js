// NPM Dependencies
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

// Define Server and database
var app = express();
var port = process.env.PORT || 8000;
var db = require(path.join(__dirname, './dbConfig.js'));

// Pages and Files
var staticFiles = '/../client';
var landingPage = '/../client/pages/index.html';
var communityPage = '/../client/pages/infoPage.html';

// Serve Static Files
app.use(express.static(path.join(__dirname + staticFiles)));

// Routing between Pages

// Sign-up
app.use('/', bodyParser.urlencoded());

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + landingPage));
});

app.post('/', function(req, res) {
  // data
  var email = req.body.email;
  var ip = req.body.ip;
  var place = req.body.place;
  // TESTING PURPOSES ONLY
  console.log('email: ', email, ' ip: ', ip, ' location: ', place);

  // Putting it up in dat DB
  db.User.find({where: {email: email}})
    .then(function (user) {
      if (!user) {
        return db.User.create({
          email: email,
          ip: ip,
          location: place
        })
        .then(function () {
          res.sendStatus(200);
        })
      } else {
        res.send('this email is already registered!');
      }
    })
});

// Community
app.get('/community', function(req, res) {
  res.sendFile(path.join(__dirname + communityPage));
})

app.post('/community', function(req, res) {
  db.User.findAll()
    .then(function (users) {
      if (users) {
        res.send(users);
      }
    })
    .catch(function (error) {
      console.log('oh no!', error)
      res.send(error)
    })
})

// Connect to server
app.listen(port, function() {
  console.log('Connected to server.  Listening in on port ', port)
});
