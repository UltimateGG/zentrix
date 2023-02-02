import React from 'react';
import { ThemeContext } from '../../theme/JetDesign';
import styled from 'styled-components';


export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  fullWidth?: boolean;
  vertical?: boolean;
}

const DividerStyle = styled.hr.attrs((props: DividerProps) => props)`
  width: ${props => props.vertical ? 'auto' : props.fullWidth ? '100%' : '90%'};
  ${props => props.vertical ? 'height: auto;' : ''}
  ${props => props.vertical ? '' : 'margin: auto;'}
  border: 1px solid ${props => props.theme.colors.background[3]};
  margin-bottom: 0.8rem;
`;

const Divider = (props: DividerProps) => {
  const { fullWidth = true, ...rest } = props;
  const { theme } = React.useContext(ThemeContext);

  return (
    <DividerStyle
      theme={theme}
      {...rest}
      fullWidth={fullWidth}
    />
  );
}

export default Divider;
