import React from 'react';
import Navbar from './navbar.jsx';
import TripEventList from './trip-event-list.js';
import TripMapView from './trip-map.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Memories from './memories.js';
import { ajax } from 'jquery';

class IndividualTrip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      // data that will be needed
      //   events - populates from table of events associated with the trip.
      //   trip id?  user id? title of trip?
      //   map url
      clicked: false,
      // events state variable is temporary, using just until we have proper trip info being passed through.
      trip: {}
    };
    // //bind methods here
    this.showMemoriesClick = this.showMemoriesClick.bind(this);

  };
  //add new methods here
    //reuse map methods?
      //will need slight alterations to fit specifications of this page
    //reuse get events method?
    //new method for getting data for friends?
    //new method for getting data for photos
      //data for photos should allow for titling of photos
  showMemoriesClick(photos) {
    this.setState({
      photos: photos,
      clicked: !this.state.clicked});
  };


  componentDidMount() {
    ajax({
      url: `/getTrips/${this.props.match.params.tripId}`,
      method: 'GET',
      success: (trip) => {
        console.log(trip);
        this.setState({
          trip: trip
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  render() {
    return (
     <div className="container-fluid">
        <Navbar />
        <h1 className="text-center">{this.state.trip.name}</h1>

          <div className="row">
            <div className="col-md-6">
              {this.state.trip.events ?
                <TripEventList
                // removeEvent={this.props.removeEvent}
                // updateEvent={this.props.updateEvent}
                tripId={this.state.trip._id}
                events={this.state.trip.events}
                showMemories={this.showMemoriesClick} 
                /> :
                ''}
              </div>
              <div className="col-md-6">
              { this.state.clicked ? <MuiThemeProvider><Memories photos={this.state.photos}/></MuiThemeProvider> : <TripMapView /*mapUrl=*//> }
            </div>
          

          </div>

      </div>
    );
  };
};

export default IndividualTrip;

        // <MuiThemeProvider>
        //   <PhotoScroller />
        // </MuiThemeProvider>