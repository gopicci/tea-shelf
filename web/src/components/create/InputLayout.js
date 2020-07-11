import React, {useState} from 'react';

import InputList from './InputList';
import TextInput from './TextInput';


export default function InputLayout(handlePrevious) {

  const [data, setData] = useState({
    name: '',
    category: '',
    subcategory: '',
    origin: '',
    year: '',
    vendor: '',
    price: '',
    weight: '',
    brewing: '',
    notes: '',
  });

  const [editRoute, setEditRoute] = useState({route: 'INPUT_LIST', field: null});

  const props = {data, setData, setEditRoute, ...handlePrevious};

  function renderSwitch(editRoute) {
    switch (editRoute.route) {
      case 'INPUT_LIST':
        return <InputList {...props} />
      case 'TEXT_INPUT':
        return <TextInput {...props} field={editRoute.field} />
      default:
        return <InputList {...props} />
    }
  }

  return (
    <>
      {renderSwitch(editRoute)}
    </>
  );
};