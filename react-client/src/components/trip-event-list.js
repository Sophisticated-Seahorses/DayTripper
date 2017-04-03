import React from 'react';
import TripEventEntry from './trip-event-entry.js';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TripEventTile from './trip-event-tile.js';

const eventTitleStyle = {
  background: '#22363F',
  marginBottom: 15,
  width: '100%'
};

const TripEventList = (props) => (
  <div id='trip-event-list'>

    <MuiThemeProvider>
      <AppBar
        title="EVENTS"
        style={eventTitleStyle}
      />
    </MuiThemeProvider>
    <div style={{overflow: 'auto', width: '100%', height: 421}} >
      {props.events.map((event, index) => 
        <TripEventTile 
          key={index}
          index={index}
          tripId={props.tripId}
          event={event}
          events={props.events}
          removeEvent={props.removeEvent}
          updateEvent={props.updateEvent} 
          showMemories={() => props.showMemories(event.photos)}
          updatePhotos={props.updatePhotos}
          addMemories={props.addMemories}
          showMap={props.showMap}

        />
      )}
    </div>
  </div>
);

export default TripEventList;

// {<input type="file" capture="camera" accept="image/*" id="takePictureField"/>}

