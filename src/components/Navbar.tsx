import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Box, Icon, IconEnum, ThemeContext } from '../Jet';


const EXCLUDED_PATHS = ['/'];
const icons = [
  {
    path: '/chats',
    icon: IconEnum.menu,
  },
  {
    path: '/todo',
    icon: IconEnum.chat_filled,
  },
  {
    path: '/settings',
    icon: IconEnum.user,
  }
];

const FooterStyle = styled(Box).attrs((props: any) => props)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3.6rem;
  background-color: ${props => props.theme.colors.background[1]};
  border-top: 1px solid ${props => props.theme.colors.background[3]};
  padding: 1rem 2rem;
`;


const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = React.useContext(ThemeContext);


  if (EXCLUDED_PATHS.includes(location.pathname))
    return null;

  return (
    <FooterStyle theme={theme} alignItems="center" justifyContent="space-between">
      {icons.map(({ path, icon }) => (
        <Icon
          key={path}
          icon={icon}
          size={32}
          color={location.pathname === path ? theme.colors.primary[0] : undefined}
          onClick={() => navigate(path)}
        />
      ))}
    </FooterStyle>
  );
}

export default Navbar;
