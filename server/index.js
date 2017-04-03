var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var connection = require('../database-mongo/index.js');
var db = require('../database-mongo/models.js');
var request = require('request');
var passport = require('./middleware/initGoogle.js');
var busboy = require('express-busboy');
var cloudinary = require('cloudinary');

var app = express();
busboy.extend(app, {
  upload: true
});

app.post('/test', function(req, res) {
  
  res.send();
});

app.use(express.static(__dirname + '/../react-client/dist'));
app.use(cookieParser());
app.use(session({
  secret: 'Victoria\'s',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/getEvents', passport.authenticate('google-token'), function(req, res) {
	
  db.getEvents(req.session.passport.user, function(err, events){
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).json(events);
		}
	})
});

app.post('/createUser', passport.authenticate('google-token'), function(req, res) {
  db.createUser(req.body, function(err, user) {
    if (err) {
      res.send(err);
    } else {
      res.status(201).send();
    }
  })
});

app.post('/createEvent', passport.authenticate('google-token'), function(req, res) {
  req.body.userId = req.session.passport.user;
  db.createEvent(req.body, function(err, event) {
    if (err) {
      console.log('Error in server/index.js /createEvent', err)
      res.status(500).send(err);
    } else {
      res.status(201).json(event);
    }
  })
});

app.post('/updateEvent', passport.authenticate('google-token'), function(req, res) {
  db.updateEvent(req.body.location, req.body.newInfo, function(err, events) {
    if (err) {
      res.send(err);
    } else {
      res.status(200).send();
    }
  })
});

app.delete('/removeEvent', passport.authenticate('google-token'), function(req, res) {
  db.removeEvent(req.body, function(err, events) {
    if (err) {
      res.send(err);
    } else {
      res.status(204).send();
    }
  });
});

app.post('/createTrip', function(req, res) {
  const trip = req.body;
  trip.userId = req.session.passport.user;
  db.createTrip(trip, function(err, trip) {
    if (err) {
      console.log(err, 'there is an error');
      res.status(500).send(err);
    } else {
      db.removeEvent(req.session.passport.user, function(err, events) {
        if (err) {
          res.status(404).send(err);
          console.log('there is another error', err);
        } else {
          res.status(201).json(trip);
        }
      });
    }
  });
});

app.get('/getTrips/', passport.authenticate('google-token'), function(req, res) {
  console.log(req.session);
  db.getTrips('userId', req.session.passport.user, function(err, trips) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(trips);
    }
  });
});

app.get('/getTrips/:tripId', passport.authenticate('google-token'), function(req, res) {
  console.log(req.params.tripId);
  db.getTrips('_id', req.params.tripId, function(err, trips) {
    if (err) {
      res.status(500).send(err);
    } else {
      console.log(trips);
      res.status(200).json(trips[0]);
    }
  });
});

app.post('/updateTrip', passport.authenticate('google-token'), function(req, res) {

  console.log(req.body);
  // db.updateTrip()
  res.send('hello');
});

app.delete('/removeTrip', passport.authenticate('google-token'), function(req, res) {
  db.removeTrip(req.body.ObjectId, function(err, trip) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(204).send();
    }
  });
});

app.post('/trips', function(req, res) {
  cloudinary.uploader.upload(req.files.photo.file, function(photo) {
    console.log('response from cloudinary', photo);
    db.addPhoto(req.body.tripId, req.body.eventId, photo, function(err, result) {
      if (err) {
        console.log('database error', err);
        res.status(500).send(err);
      } else {
        res.status(201).json(photo);
      }
    });
  });
});


app.get('/authenticate', passport.authenticate('google-token'), function(req, res) {
  // console.log(req.user, 'this is the req user');
  // console.log(req.body, 'this the req body');
  // console.log(req.session, 'this is the req session');
  // console.log(res, 'this is the res');
  res.redirect('/');
});

// GET for Search component
app.get('/search', passport.authenticate('google-token'), function(req, res) {
	console.log('YELP QUERY', req.query);

  var yelpRequest = {
    url: 'https://api.yelp.com/v3/businesses/search?sort_by=review_count&limit=8&location=' + req.query.location + '&term=' + req.query.term,
    method: 'GET',
    json: true,
    headers: {
      authorization: 'Bearer rq8_N38VNAGT5kiZU6nfuETDw2fhd_Plo4x27mPPrTKNdzxWkRxu1d3flc4_WfqbvYedanJUH5XyfovG3ZimMoL19TSLdxXdqS-vm3t1uSJbny1owcfUSuiQCFTDWHYx'
    }
  };

  // send GET request to Yelp
  request(yelpRequest, function(error, response, body) {
    if (error) {
      console.error('---> YELP ERROR', error);
    } else {
      
      res.status(201).send(body.businesses);
    }
  });
});

app.get('*', function(req, res) {
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, function() {
  console.log('Magic happens on port 3000!');
});
