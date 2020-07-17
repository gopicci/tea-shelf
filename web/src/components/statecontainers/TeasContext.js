import React, {useContext, useEffect, useState} from 'react';

import localforage from 'localforage';
import {FileToBase64} from '../../services/ImageService';
import {APIRequest} from '../../services/AuthService';

export const TeasState = React.createContext(null)


export default function TeasContext(props) {
  /**
   * Defines overall tea entries context.
   *
   */

  const [state, setState] = useState(null);

  async function getOfflineTeas() {
    /**
     * Gets offline teas (not uploaded yet) from storage and serializes
     * the data to match an API response.
     */
    return localforage.getItem('offline-teas')
      .then(cache => {
        if (!cache)
          // Create an empty array storage entry
          return localforage.setItem('offline-teas', [])
        else
          // Serialize the data converting File blob to base64
          return Promise.all(cache.map(entry => FileToBase64(entry.image)
            .then(img => {
              entry.image = img;
              entry.category = parseInt(entry.category);
              return entry
            })
          ))
      })
  }

  useEffect(() => {
    // Get offline teas (not uploaded) first
    getOfflineTeas()
      .then(offlineTeas => {
        // Get cached teas
        localforage.getItem('teas')
          .then(teas => {
            if (!teas) teas = []
            // Set initial state merging cached data
            setState(offlineTeas.concat(teas));
            // Launch an API request
            APIRequest('/tea/', 'GET')
              .then(res => {
                console.log('/tea/', res)
                if (res.ok)
                  res.json().then(body => {
                    // Update the state
                    setState(offlineTeas.concat(body));
                    // Update the cache
                    localforage.setItem('teas', body)
                      .then(cache => console.log('set local teas', cache))
                  });
              });
            });
      })
  .catch((e) => console.log(e));
  }, []);

  return (
    <TeasState.Provider value={state}>
      {props.children}
    </TeasState.Provider>
  )
}