import React, {useContext, useEffect, useState} from 'react';

import localforage from 'localforage';
import {FileToBase64} from '../../services/ImageService';
import {APIRequest} from '../../services/AuthService';

export const TeasState = React.createContext(null)


export default function TeasContext(props) {

  const [state, setState] = useState(null);

  useEffect(() => {
    localforage.getItem('offline-teas')
      .then(cache => {
        if (!cache)
          localforage.setItem('offline-teas', [])
            .then(cache => console.log('offline-teas initiated', cache))
        else
          Promise.all(cache.map(entry => FileToBase64(entry.image)
            .then(img => {
              entry.image = img;
              entry.category = parseInt(entry.category);
              return entry
            })
        ))
          .then(offlineTeas => {
            setState(offlineTeas);
            APIRequest('/tea/', 'GET')
              .then(res => {
                console.log('/tea/', res)
                if (res.ok)
                  res.json().then(body => {
                    setState(offlineTeas.concat(body));
                    localforage.setItem('teas', body)
                      .then(cache => console.log('set local teas', cache))
                  })
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