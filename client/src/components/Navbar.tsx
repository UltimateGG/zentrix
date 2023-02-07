import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { User } from '../api/apiTypes';
import useAuth from '../contexts/AuthContext';
import { Box, Icon, IconEnum, ThemeContext } from '../Jet';


const EXCLUDED_PATHS = ['/'];
const icons = [
  {
    path: '/chats',
    icon: IconEnum.menu,
  },
  {
    path: '/last_chat',
    icon: IconEnum.chat_filled,
    shouldShow: (user: User) => user.lastChat != null,
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
  const { user } = useAuth();
  const { theme } = React.useContext(ThemeContext);


  if (EXCLUDED_PATHS.includes(location.pathname) || !user)
    return null;

  return (
    <FooterStyle theme={theme} alignItems="center" justifyContent="space-between">
      {icons.map(({ path, icon, shouldShow }) => (
          shouldShow && !shouldShow(user) ? null :
          <Icon
            key={path}
            icon={icon}
            size={32}
            color={location.pathname === path || (path === '/last_chat' && location.pathname.startsWith('/chats/')) ? theme.colors.primary[0] : theme.colors.text[9]}
            onClick={() => navigate(path === '/last_chat' ? `chats/${user.lastChat}` : path)}
            style={{ cursor: 'pointer' }}
          />
      ))}
    </FooterStyle>
  );
}

export default Navbar;
