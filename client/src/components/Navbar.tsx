import React from 'react';
import styled from 'styled-components';
import useDataCache from '../contexts/DataCacheContext';
import useNav, { Page } from '../contexts/NavigationContext';
import { Box, Icon, IconEnum, theme } from '../Jet';


const icons = [
  {
    page: Page.CHAT_LIST,
    icon: IconEnum.menu,
  },
  {
    page: Page.SETTINGS,
    icon: IconEnum.user,
  }
];

const FooterStyle = styled(Box).attrs((props: any) => props)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  height: calc(3.6rem + ${props => props.safeArea}px);
  background-color: ${theme.colors.background[1]};
  border-top: 1px solid ${theme.colors.background[3]};
  padding: 1rem 2rem;
`;

const Navbar = () => {
  const { currentPage, navigate } = useNav();
  const { safeArea } = useDataCache();


  return (
    <FooterStyle theme={theme} alignItems="flex-start" justifyContent="space-between" safeArea={safeArea?.insets.bottom || 0}>
      {icons.map(({ page, icon }) => (
        <Icon
          key={page}
          icon={icon}
          size={32}
          color={currentPage === page ? theme.colors.primary[0] : theme.colors.text[9]}
          onClick={() => navigate(page)}
          style={{ cursor: 'pointer' }}
        />
      ))}
    </FooterStyle>
  );
}

export default Navbar;
