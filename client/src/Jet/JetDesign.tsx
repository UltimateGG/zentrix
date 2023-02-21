import React, { ReactNode, useEffect } from 'react';
import { NotificationProvider } from './NotificationContext';
import { theme } from './theme/Theme';


const getGlobalStyles = () => `
  @import url('${theme.font}');

  * {
    margin: 0;
    padding: 0;
    outline: 0;
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box;         /* Opera/IE 8+ */
    scroll-behavior: smooth;
    color: ${theme.colors.text[0]};
    font-family: ${theme.fontFamily};
  }

  html, body, #root {
    height: 100%;
    background-color: ${theme.colors.background[0]};
    font-size: ${theme.fontSize};
    overflow: hidden;
    overscroll-behavior: none;
  }

  button {
    font-size: ${theme.fontSize};
  }

  h1 { font-size: 2.3rem; }
  h2 { font-size: 2rem; }
  h3 { font-size: 1.75rem; }
  h4 { font-size: 1.5rem; }
  h5 { font-size: 1.25rem; }
  h6 { font-size: 1rem; }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 0.5rem;
    font-weight: 300;
  }

  a {
    cursor: pointer;
    color: ${theme.colors.primary[0]};
    text-decoration: none;
    transition: color 0.3s ease-in-out;
  }

  a:hover {
    text-decoration: underline;
  }

  p, i, strong, em, span, b {
    line-height: 1.4;
  }

  small {
    font-size: 0.75rem;
    color: ${theme.colors.text[6]};
  }

  img {
    max-width: 100%;
    height: auto;
  }

  ::-webkit-scrollbar {
    width: 0.6rem;
  }
  
  ::-webkit-scrollbar-track {
    background-color: ${theme.colors.background[1]};
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${theme.colors.background[3]};
    border-radius: ${theme.rounded};
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: ${theme.colors.background[4]};
  }

  ::-webkit-scrollbar-thumb:active {
    background-color: ${theme.colors.background[5]};
  }
`;

const JetDesign = ({ children }: { children: ReactNode }) => {
  useEffect(() => { // Inject fonts into head
    if (document.head.querySelector('[data-jet-injected]')) return;

    const globalStyles = document.createElement('style');
    globalStyles.innerHTML = getGlobalStyles();
    document.head.appendChild(globalStyles);

    const configElem = document.createElement('div');
    configElem.setAttribute('data-jet-injected', 'true');
    document.head.appendChild(configElem);
  }, []);

  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  );
}

export default JetDesign;
