import React, {useState} from 'react';

import InputLayout from './InputLayout';
import EditText from './EditText';
import EditList from './EditList';
import EditOrigin from './EditOrigin';

export default function InputRouter(handlePrevious) {

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

  const [editRoute, setEditRoute] = useState({route: 'INPUT_LIST', field: null, data: null});

  const props = {data, setData, setEditRoute, ...handlePrevious};

  function renderSwitch(editRoute) {
    switch (editRoute.route) {
      case 'INPUT_LIST':
        return <InputLayout {...props} />
      case 'EDIT_TEXT':
        return <EditText {...props} field={editRoute.field} />
      case 'EDIT_LIST':
        return <EditList {...props} field={editRoute.field} list={editRoute.data} />
      case 'EDIT_ORIGIN':
        return <EditOrigin {...props} field={editRoute.field} />
      default:
        return <InputLayout {...props} />
    }
  }

  return (
    <>
      {renderSwitch(editRoute)}
    </>
  );
};