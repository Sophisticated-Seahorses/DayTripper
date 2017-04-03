import React from 'react';
import $ from 'jquery';
import Search from './search.jsx';
import MapView from './map.jsx';
import EventList from './event-list.jsx';
import Navbar from './navbar.jsx';
import Login from './login.jsx';
import SaveTripButton from './save_trip_button.jsx';
import {Route, Link} from 'react-router-dom';
import TripGridList from './trip_grid.jsx';



class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      username: '',
      mapUrl: null,
      accessToken: this.props.authtoken
    }
    this.getEvents = this.getEvents.bind(this);
    this.createEvent = this.createEvent.bind(this);
    this.removeEvent = this.removeEvent.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.mapRender = this.mapRender.bind(this);
    this.clearEvents = this.clearEvents.bind(this);
  }

  componentDidMount() {
    this.getEvents();
  };

  getEvents() {
    const userInfo = {
      username: this.state.username
    };

    $.ajax({
      url: '/getEvents',
      type: 'GET',
      data: userInfo,
      success: (data) => {
        this.setState({
          events: data
        })
        this.mapRender();
      },
      error: (error) => {
        console.error(error)
      }
    })
  };

  createEvent(eventInfo) {
    $.ajax({
      url: '/createEvent',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(eventInfo),
      success: (event) => {
        console.log(event);
        let events = this.state.events.slice();
        events.push(event);
        this.setState({
          events: events
        });
        this.mapRender();
      },
      error: (error) => {
        console.error(error);
      }
    })
  };

  updateEvent(eventInfo) {
    $.ajax({
      url: '/updateEvent',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(eventInfo),
      success: () => {
        this.getEvents();
      },
      error: (error) => {
        console.error(error);
      }
    })
  };

  removeEvent(obj) {
    $.ajax({
      url: '/removeEvent',
      type: 'DELETE',
      contentType: 'application/json',
      data: JSON.stringify(obj),
      success: () => {
        console.log('success');
        this.getEvents();
      },
      error: (error) => {
        console.error(error);
      }
    })
  };

  clearEvents() {
    this.setState({events: []});
  }
  // passUrl(url) {
  //   this.props.setUrl(url);
  // }

  mapRender() {
    
    if (this.state.events.length === 0) {
      this.setState({
        mapUrl: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyAX5TQtLwqyLjSV4TIk1I0ePRUUut8rAf0&q=944+Market+Street,San+Francisco'
      });
    } else if (this.state.events.length === 1) {
      this.setState({
        mapUrl: `https://www.google.com/maps/embed/v1/place?key=AIzaSyAX5TQtLwqyLjSV4TIk1I0ePRUUut8rAf0&q=${this.state.events[0].address.split(' ').join('+')}`
      });
    } else {
      var baseUrl = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyAX5TQtLwqyLjSV4TIk1I0ePRUUut8rAf0`;
      var origin = `&origin=${this.state.events[0].address.split(' ').join('+')}`;
      var destination = `&destination=${this.state.events[this.state.events.length - 1].address.split(' ').join('+')}`;
      var url = baseUrl + origin + destination;

      for (var i = 1; i < this.state.events.length - 1; i++) {
        var queried = this.state.events[i].address.split(' ').join('+');
        if (i === 1) {
          url += `&waypoints=${queried}|`;
        } else {
          url += `${queried}|`;
        }
      };

      url = url.slice(0, url.length - 1);
      this.setState({
        mapUrl: url,
      });
    }

  };

  render () {
    return (
      <div>
      <Navbar />
        <div style={appStyle}>
          <div className="row">
            <div className="col-md-6 col-xs-12">
              <Search
                createEvent={this.createEvent}
                username={this.state.username}
                style={searchStyle}
              />
            </div>
            <div className="col-md-6 col-xs-12">
              <div style={eventsMapStyle}>
              <MapView url={this.state.mapUrl}/>
              </div>
              </div>
            <div className="col-md-6 col-xs-12">
              <EventList
                events={this.state.events}
                removeEvent={this.removeEvent}
                updateEvent={this.updateEvent}
                style={eventStyle}
              />
              </div>
              <div>
              <SaveTripButton accessToken={this.state.accessToken} events={this.state.events} clearEvents={this.clearEvents} mapUrl={this.state.mapUrl}/>
            </div>

          </div>
        </div>
      </div>

    )
  }
}


export default Homepage;



const appStyle = {
  margin: 'auto',
  paddingTop: 20,
  paddingBottom: 30,
  paddingLeft: 30,
  paddingRight: 30,
  // display: 'flex',
  flexStyle: 1,
  alignItems: 'center',
  fontFamily: 'Roboto',
}

const searchStyle = {
  display: 'inline-block',
  top: 0,
}

const eventStyle = {
  display: 'inline-block',
  marginTop: 20,
  width: '100%',
}


const bannerStyle = {
  display: 'flex',
  alignItems: 'center',
  flexStyle: 1,
  backgroundImage: 'url("http://i65.tinypic.com/2igc483.png"',
  backgroundColor: '#31434C',
  width: '100%',
  height: '40em'
}

const eventsMapStyle = {
  display: 'inline-block',
  width: '100%',
  // marginLeft: 50,
}