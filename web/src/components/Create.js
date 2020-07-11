import React, {useState} from 'react';

import CaptureImage from './create/CaptureImage';
import InputRouter from './create/InputRouter';


export default function Create({setRoute}) {

  const [imageData, setImageData] = useState(null);

  const [step, setStep] = useState(2);

  const handleNext = () => setStep(step + 1);

  const handlePrevious = () => setStep( step - 1);

  const handleClose = () => {
    setStep(1);
    setRoute('MAIN')
  }

  const props = {imageData, setImageData, handleNext, handlePrevious, handleClose}

  function renderSwitch(step) {
    switch (step) {
      case 1:
        return <CaptureImage {...props} />
      case 2:
        return <InputRouter handlePrevious={handlePrevious} />
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