import React from 'react';
import TripEventEntry from './trip-event-entry.js';
import PictureModal from './picture-modal.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { ajax } from 'jquery';

class TripEventTile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      picModalOpen: false,
      showMap: false
    };
    //bind methods here
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };
  //add new methods here
  handleOpen() {
    this.setState({picModalOpen: true})
  }
  handleClose() {
    this.setState({picModalOpen: false});
  };

   handleSubmit(pictureData) {
    console.log('handleSubmit in trip-event-tile.js', pictureData);
    // console.log('handleSubmit in trip-event-tile, trip id', this.props.tripId);
    // console.log('event id', this.props.event._id)
    const data = new FormData();
    data.append("photo", pictureData);
    data.append('tripId', this.props.tripId);
    data.append('eventId', this.props.event._id);
    // const photoAndIds = {
    //   tripId: this.props.tripId,
    //   photo: pictureData,
    //   eventId: this.props.event._id
    // }
    ajax({
      url: '/trips',
      method: 'POST',
      processData: false,
      contentType: false,
      data: data,
      success: (photo) => {
        console.log('success in handleSubmit in trip-event-tile.js');
        this.props.updatePhotos(this.props.event._id, photo);
      },
      error: (error) => {
        console.log('error in handleSubmit in trip-event-tile.js', error)
      }
    })
  }

  //move picture modal methods here
  //pass state to picture modal
  //render picture modal with open attribute set to the props being passed

  render() {

    // const tile =
    //   {
    //     img: 'http://www.goodfood.com.vn/images/I_home.jpg',
    //     title: 'Breakfast',
    //     author: 'jill111',
    //   };

    return (
      <div className="container tripEventTile">
        <div className="row">
          <div className="col-md-2 col-xs-12">
            <img src={this.props.event.image_url} className="img-thumbnail img-responsive" style={{height: 100}}/>
          </div>

          <div className="col-md-2  col-xs-12">
            <TripEventEntry
            index={this.props.index}
            event={this.props.event}
            events={this.props.events}
            removeEvent={this.props.removeEvent}
            updateEvent={this.props.updateEvent}/>
          </div>

          <div className="col-md-2  col-xs-12">
            <button onClick={this.handleOpen} className="btn-primary btn-lg" style={{width: 154.5}}>Add Memory</button>
            <button onClick={() => {
                this.props.showMemories();
                this.setState({showMap: !this.state.showMap});
              }} className="btn-info btn-lg">{this.state.showMap && this.props.showMap ? 'Show Map' : 'Show Memories'}</button>
          </div>
          <MuiThemeProvider>
            <PictureModal
            handleSubmit={this.handleSubmit} 
            open={this.state.picModalOpen}
            handleClose={this.handleClose}
            />
          </MuiThemeProvider>
        </div>
      </div>
    );
  };
};

export default TripEventTile;

