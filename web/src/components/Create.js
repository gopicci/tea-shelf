import React, {useState} from 'react';
import localforage from 'localforage';

import CaptureImage from './create/CaptureImage';
import InputRouter from './create/InputRouter';
import {APIRequest} from '../services/AuthService';
import {ImageDataToFile} from '../services/ImageService';

export default function Create({setRoute}) {

  const [imageData, setImageData] = useState(null);

  const [teaData, setTeaData] = useState({
    name: '',
    category: null,
    subcategory: null,
    origin: null,
    year: null,
    vendor: null,
    price: null,
    weight: null,
    brewing: null,
    notes: '',
  });


  function handleCreate() {
    // save local, then sync
    // !subcategory.is_public ? add

    ImageDataToFile(imageData).then((file) => {

      let formData = new FormData();
      if (imageData) formData.append("image", file);

      formData.append('name', teaData.name)
      formData.append("category", teaData.category);
      //for (const key in teaData)
      //  formData.append(key, teaData[key])
      APIRequest("/tea/", "POST", formData).then((res) => {
        if (res.ok) console.log("Tea created", res);
      }).catch(error => {
        console.log(error.message, 'cache locally')
        localforage
          .getItem("offline-teas")
          .then((offlineTeas) => {
            localforage.setItem("offline-teas", [...offlineTeas, Object.fromEntries(formData)])
              .then(cache => console.log('offline teas:', cache));
            });
      });
    });
  }

  const [step, setStep] = useState(1);

  const handleNext = () => setStep(step + 1);

  const handlePrevious = () => setStep( step - 1);

  const handleClose = () => {
    setStep(1);
    setRoute('MAIN')
  }

  const props = {imageData, setImageData, teaData, setTeaData, handleNext, handlePrevious, handleClose, handleCreate}

  function renderSwitch(step) {
    switch (step) {
      case 1:
        return <CaptureImage {...props} />
      case 2:
        return <InputRouter {...props} />
      default:
        return <CaptureImage {...props} />
    }
  }

  return (
    <>
      {renderSwitch(step)}
    </>
  );
};