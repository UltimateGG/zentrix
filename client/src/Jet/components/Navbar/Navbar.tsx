import React from 'react';
import { ThemeContext } from '../../theme/JetDesign';
import styled from 'styled-components';


export interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: 'fixed' | 'absolute' | 'relative';
}

const NavbarStyle = styled.div.attrs((props: NavbarProps) => props)`
  position: ${props => props.position || 'absolute'};
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem;
  background-color: ${props => props.theme.colors.background[3]};
  color: ${props => props.theme.colors.text[0]};
  font-size: 1.2rem;
  box-shadow: 0px 0px 0.6rem 0.4rem rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease-in-out;
  z-index: 5;
`;

const Navbar = (props: NavbarProps) => {
  const { position, ...rest } = props;
  const { theme } = React.useContext(ThemeContext);

  return (
    <NavbarStyle
      theme={theme}
      {...rest}
      position={position}
    >
      {props.children}
    </NavbarStyle>
  );
}

export default Navbar;
