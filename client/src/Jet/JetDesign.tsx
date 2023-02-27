import { Capacitor } from '@capacitor/core';
import React, { ReactNode, useEffect } from 'react';
import { NotificationProvider } from './NotificationContext';
import { theme } from './theme/Theme';


const getGlobalStyles = () => `
  @font-face {
    font-family: 'Rubik';
    src: url('${process.env.PUBLIC_URL}/fonts/Rubik-VariableFont_wght.ttf') format('truetype'),
         url('${process.env.PUBLIC_URL}/fonts/Rubik-Italic-VariableFont_wght.ttf') format('truetype');
  }

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
    ${Capacitor.isNativePlatform() && `
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    `}
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

  table {
    border-collapse: collapse;
    border: 1px solid ${theme.colors.background[2]};
  }

  thead {
    background-color: ${theme.colors.background[2]};
  }

  th {
    text-align: left;
    padding: 0.4rem;
    border-bottom: 1px solid ${theme.colors.background[2]};
  }

  td {
    padding: 0.4rem;
  }
  
  td:not(:last-child) {
    border-right: 1px solid ${theme.colors.background[2]};
  }

  tr:not(:last-child) {
    border-bottom: 1px solid ${theme.colors.background[2]};
  }

  tr:nth-child(even) {
    background-color: ${theme.colors.background[1]};
  }

  code {
    font-size: 0.9rem;
    background-color: ${theme.colors.background[2]};
    color: ${theme.colors.text[6]};
    padding: 0.2rem 0.4rem;
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

  .hljs{display:block;overflow-x:auto;padding:.5em;color:#abb2bf;background:${theme.colors.background[1]};border-radius:${theme.rounded}}.hljs-comment,.hljs-quote{color:#5c6370;font-style:italic}.hljs-doctag,.hljs-formula,.hljs-keyword{color:#c678dd}.hljs-deletion,.hljs-name,.hljs-section,.hljs-selector-tag,.hljs-subst{color:#e06c75}.hljs-literal{color:#56b6c2}.hljs-addition,.hljs-attribute,.hljs-meta-string,.hljs-regexp,.hljs-string{color:#98c379}.hljs-built_in,.hljs-class .hljs-title{color:#e6c07b}.hljs-attr,.hljs-number,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-pseudo,.hljs-template-variable,.hljs-type,.hljs-variable{color:#d19a66}.hljs-bullet,.hljs-link,.hljs-meta,.hljs-selector-id,.hljs-symbol,.hljs-title{color:#61aeee}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}.hljs-link{text-decoration:underline}
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
