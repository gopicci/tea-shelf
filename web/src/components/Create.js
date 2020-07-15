import React, {useState} from 'react';

import CaptureImage from './create/CaptureImage';
import InputRouter from './create/InputRouter';
import {APIRequest} from '../services/AuthService';

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

    fetch(imageData)
      .then(res => res.arrayBuffer())
      .then(buf => new File([buf], 'capture.jpg', {type: 'image/jpeg'}))
      .then(file => {
        let formData = new FormData()
        if (imageData)
          formData.append('image', file)
        for (const key in teaData)
          formData.append(key, teaData[key])
        APIRequest('/tea/', 'POST', formData)
          .then(res => {
            console.log(res);
          })
      })
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