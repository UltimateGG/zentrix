import React from 'react';
import { ThemeContext } from '../../theme/JetDesign';
import styled from 'styled-components';


export interface FormGroupProps extends React.HTMLAttributes<HTMLFieldSetElement> {
  
}

const FormGroupStyle = styled.fieldset.attrs((props: FormGroupProps) => props)`
  display: flex;
  flex-direction: column;
  border: none;
  padding: 0;
  margin: 0.6rem 0 0 0;
`;

const FormGroup = (props: FormGroupProps) => {
  const { theme } = React.useContext(ThemeContext);

  return (
    <FormGroupStyle
      theme={theme}
      {...props}
    />
  );
}

export default FormGroup;
