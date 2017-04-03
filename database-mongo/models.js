var mongoose = require('mongoose');

var EventSchema = mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'events must have a userId']
  },
  description: String,
  start: String,
  end: String,
  location: String,
  phone: String,
  address: String,
  latitude: Number,
  longitude: Number,
  photos: Array,
  image_url: String
  
});

var Event = mongoose.model('Event', EventSchema);

var UserSchema = mongoose.Schema({
  userId: String,  
  token: String,
  firstname: String,
  lastname: String,
  email: String,
});

var User = mongoose.model('User', UserSchema);

var TripSchema = mongoose.Schema({
  userId: String,
  events: [EventSchema], 
  name: String,
  participants: Array,
  image_url: String,
  map_url: String
});

var Trip = mongoose.model('Trip', TripSchema);

var createTrip = function(obj, callback) {
  Trip.create(obj, function(err, trip) {
    if (err) {
      callback(err, null);
    } else {
      console.log(trip);
      callback(null, trip);
    }
  })
};
var updateTrip = function(tripId, event, callback) {
  Trip.update({_id: tripId}, 
    {$push: {events: event}}, callback);
};

var getTrips = function(field, id, callback) {
  const params = {};
  params[field] = id;
  Trip.find(params, function(err, trips) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, trips);
    }
  });
};

var removeTrip = function(objId, callback) {
  Trip.remove({'_id': objId}, function(err, trip) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, err);
    }
  });
};

var createUser = function(obj, callback) {
  User.create(obj, function(err, user) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, user);
    }
  });
};

var findUser = function(userId, callback) {
  console.log(userId);
  User.find({userId: userId}, function(err, user) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, user);
    }
  })
}

var getEvents = function(id, callback) {
  Event.find({userId: id}, function(err, events) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, events)
    }
  });
};

var createEvent = function(obj, callback) {
  Event.create(obj, function(err, event) {
    if (err) {
      console.log('error in models.js createEvent', err);
      callback(err, null);
    } else {
      console.log('CREATE --->', event)
      callback(null, event);
    }
  });
};

var updateEvent = function(id, newInfo, callback) {
  Event.update(id, newInfo, function(err, events) {
    if (err) {
      callback(err, null);
    } else {
      console.log('UPDATE --->', events)
      callback(null, events);
    }
  });
};


var addPhoto = function(tripId, eventId, photo, callback) {
  // Trip.update({'_id': tripId},
  //   {$push: {'photos': photo}},
  //   callback);
  Trip.findOne({'_id': tripId}).exec(
    function(err, trip) {
      if (err) {
        callback(err, null);
      } else {
        trip.events.id(eventId).photos.push(photo);
        trip.save(function(err) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, 'photo uploaded successfully');
          }
        });
      }
    });
};

var removeEvent = function(obj, callback) {
  Event.remove(obj, function(err, events) {
    if (err) {
      callback(err, null);
    } else {
      console.log('---> EVENT REMOVED!')
      callback(null, events);
    }
  });
};


module.exports.Event = Event;
module.exports.getEvents = getEvents;
module.exports.createUser = createUser;
module.exports.createEvent = createEvent;
module.exports.removeEvent = removeEvent;
module.exports.updateEvent = updateEvent;
module.exports.findUser = findUser;
module.exports.createTrip = createTrip;
module.exports.getTrips = getTrips;
module.exports.removeTrip = removeTrip;
module.exports.addPhoto = addPhoto;
module.exports.updateTrip = updateTrip;