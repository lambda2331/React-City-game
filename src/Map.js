import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker  } from 'react-google-maps';
class Map extends Component {
    render() {
        const GoogleMapExample = withGoogleMap(props => (
            <GoogleMap
                defaultCenter = {{ lat: props.lat, lng: props.lng }}
                defaultZoom = {12}
            >
                <Marker position={{ lat: props.lat, lng: props.lng }}/>
            </GoogleMap>
        ));
        return(
            <div>
                <GoogleMapExample
                    lat = {this.props.lat}
                    lng = {this.props.lng}
                    containerElement={ <div style={{ height: `300px`, width: '300px' }} /> }
                    mapElement={ <div style={{ height: `100%` }} /> }
                />
            </div>
        );
    }
};
export default Map;