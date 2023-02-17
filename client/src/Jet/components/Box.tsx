import React from 'react';
import { theme } from '../theme';
import styled from 'styled-components';


export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  display?: 'flex' | 'grid' | 'inline-flex' | 'block' | 'inline-block' | 'inline' | 'none';
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  spacing?: string;
  innerRef?: React.Ref<HTMLDivElement>;
}

const BoxStyle = styled.div.attrs((props: BoxProps) => props)`
  display: ${(props: BoxProps) => props.display || 'flex'};
  flex-direction: ${(props: BoxProps) => props.flexDirection || 'row'};
  justify-content: ${(props: BoxProps) => props.justifyContent || 'flex-start'};
  align-items: ${(props: BoxProps) => props.alignItems || 'stretch'};
  align-content: ${(props: BoxProps) => props.alignContent || 'stretch'};
  flex-wrap: ${(props: BoxProps) => props.flexWrap || 'nowrap'};
  gap: ${(props: BoxProps) => props.spacing || '0px'};
`;

const Box = (props: BoxProps) => {
  return (
    <BoxStyle
      theme={theme}
      ref={props.innerRef}
      {...props}
    />
  );
}

export default Box;
