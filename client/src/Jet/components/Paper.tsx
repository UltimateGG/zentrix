import React from 'react';
import { theme } from '../theme';
import styled from 'styled-components';


export interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: number;
  border?: boolean;
  padding?: string;
}

const getOverlayAlpha = (elevation: number) => {
  let alphaValue;
  if (elevation < 1) {
    alphaValue = 5.11916 * elevation ** 2;
  } else {
    alphaValue = 50.0 * Math.log(elevation + 1) + 40;
  }
  return (alphaValue / 100).toFixed(2);
};

const PaperStyle = styled.div.attrs((props: PaperProps) => props)`
    padding: ${(props: PaperProps) => props.padding || '0.8rem'};
    border-radius: ${theme.rounded};
    background-color: ${theme.colors.background[1]};
    border: ${props => props.border ? `1px solid ${theme.colors.background[3]}` : 'none'};
    box-shadow: ${props => {
      const elev = props.elevation !== undefined ? props.elevation : 0;
      return elev > 0 ? `0px ${elev / 2}px 12px rgba(0, 0, 0, ${getOverlayAlpha(elev)})` : 'none'
    }};
`;

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

const Paper = (props: PaperProps) => {
  const { elevation, border = true, ...rest } = props;


  return (
    <PaperStyle
      theme={theme}
      {...rest}
      elevation={elevation !== undefined ? clamp(elevation, 0, 24) : 0}
      border={border}
    />
  );
}

export default Paper;
