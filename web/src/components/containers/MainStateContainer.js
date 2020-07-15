import React from 'react';

import GridViewStateContainer from './GridViewStateContainer';
import CategoriesStateContainer from './CategoriesStateContainer';
import SubcategoriesStateContainer from './SubcategoriesContainer';

export default function MainStateContainer(props) {


  return (
    <CategoriesStateContainer>
      <SubcategoriesStateContainer>
        <GridViewStateContainer>
            {props.children}
        </GridViewStateContainer>
      </SubcategoriesStateContainer>
    </CategoriesStateContainer>
  )

}