import React, { useContext, useEffect, useRef, useState } from 'react';
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

const Image = ({ src, fallbackURL, style, ...rest }: any) => {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const { theme } = useContext(ThemeContext);
  const ref = useRef<HTMLImageElement | null>(null);


  useEffect(() => {
    const interval = setInterval(() => {
      setLoading(ref?.current?.complete === false);
    }, 50);

    setFailed(false);
    return () => clearInterval(interval);
  }, [src]);

  return (
    <>
      {loading && <LoaderStyle theme={theme} style={style} />}
      {/* eslint-disable-next-line */}
      <img
        src={failed ? (fallbackURL || FALLBACK_IMAGE_URL) : src || FALLBACK_IMAGE_URL}
        onLoad={() => setLoading(false)}
        onError={() => setFailed(true)}
        style={{ ...style, display: loading ? 'none' : 'block' }}
        ref={ref}
        {...rest}
      />
    </>
  );
}

export default Image;
