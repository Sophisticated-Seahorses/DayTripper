import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import SaveTripButton from './components/save_trip_button.jsx';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Login from './components/login.jsx';
import Homepage from './components/homepage.jsx';
import TripGridList from './components/trip_grid.jsx';
import Navbar from './components/navbar.jsx';
import IndividualTrip from './components/individual-trip.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authtoken: '',
    };

  }
  
  setToken(authtoken) {
    console.log(authtoken, 'this is the token');
    this.setState({
      authtoken: authtoken
    });
  }
  
  render() {

    return (
      <Router>
        <div>
          <Route exact path='/' component={(props) => {
            return (<Login history={props.history} setToken={this.setToken.bind(this)} />)
          }} />
          <Route path='/homepage' component={(props) => {
            return (<Homepage authtoken={this.state.authtoken} />)
          }} />
          <Route path='/logout' component={(props) => {
            return (<Login history={props.history} setToken={this.setToken.bind(this)} />)
          }} />
          <Route path='/trips' component={TripGridList} />
          <Route name='trip' path='/trip/:tripId' component={IndividualTrip} />
        </div>
      </Router>
    )
  };
};


//This is used in the render function above in order to test the 'Trip' page
//Don't forget to remove the {}, you need to wrap it in {}
       // <Login />
    //        return (
    //           <IndividualTrip
    //     mapUrl={this.state.mapUrl}
    //     events={this.state.events}/>
    // );



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


ReactDOM.render(<App />, document.getElementById('app'));