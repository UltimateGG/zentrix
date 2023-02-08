import React, { useContext, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FALLBACK_IMAGE_URL } from '../api/api';
import { ThemeContext } from '../Jet';


const FlashKeyFrames = (fromColor: string, toColor: string) => keyframes`
  0% {
    background-color: ${fromColor};
  }

  50% {
    background-color: ${toColor};
  }

  100% {
    background-color: ${fromColor};
  }
`;

const LoaderStyle = styled.div.attrs((props: any) => props)`
  animation: ${props => FlashKeyFrames(props.theme.colors.background[1], props.theme.colors.background[2])} 1.2s ease-in-out infinite;
`;

const Image = ({ src, style, ...rest }: any) => {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const { theme } = useContext(ThemeContext);


  return (
    <>
      {loading && <LoaderStyle theme={theme} style={style} />}
      {/* eslint-disable-next-line */}
      <img
        src={failed ? FALLBACK_IMAGE_URL : src}
        onLoad={() => setLoading(false)}
        onError={() => setFailed(true)}
        style={{ ...style, display: loading ? 'none' : 'block' }}
        {...rest}
      />
    </>
  );
}

export default Image;
