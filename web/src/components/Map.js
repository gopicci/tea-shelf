import React, { Component } from 'react';
import {
  LoadScript,
  Autocomplete
} from '@react-google-maps/api';
import {parse} from 'himalaya'


class Map extends Component {
  constructor(props) {
    super(props)

    this.autocomplete = null

    this.onLoad = this.onLoad.bind(this)
    this.onPlaceChanged = this.onPlaceChanged.bind(this)
  }

  onLoad(autocomplete) {
    console.log('autocomplete: ', autocomplete)

    this.autocomplete = autocomplete
  }

  onPlaceChanged() {
    if (this.autocomplete !== null) {
      const json = parse(this.autocomplete.getPlace().adr_address)
      console.log(json)
    } else {
      console.log('Autocomplete is not loaded yet!')
    }
  }

  render() {
    return (
      <LoadScript
        googleMapsApiKey='AIzaSyBWHwNvZIqK7IY5nRy_DVUiqioz0CV0K1k'
        libraries={['places']}
      >
          <Autocomplete
            onLoad={this.onLoad}
            onPlaceChanged={this.onPlaceChanged}
            fields={['adr_address']}
            types={['(regions)']}
          >
            <input
              type="text"
              placeholder="Customized your placeholder"
            />
          </Autocomplete>
      </LoadScript>
    );
  }
}

export default Map;