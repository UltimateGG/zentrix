import React, { useContext, useState } from 'react';
import styled, { keyframes } from 'styled-components';
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
  const { theme } = useContext(ThemeContext);


  return (
    <>
      {loading && <LoaderStyle theme={theme} style={style} />}
      {/* eslint-disable-next-line */}
      <img
        src={src}
        onLoad={() => setLoading(false)}
        style={{ ...style, display: loading ? 'none' : 'block' }}
        {...rest}
      />
    </>
  );
}

export default Image;
