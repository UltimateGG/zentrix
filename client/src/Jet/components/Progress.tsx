import React, { useEffect } from 'react';
import { theme } from '../theme';
import styled from 'styled-components';


export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  indeterminate?: boolean;
  circular?: boolean;
  displayProgress?: boolean;
  displayTrack?: boolean;
  radius?: number;
  value?: number;
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  thin?: boolean;
}

const ProgressStyle = styled.div.attrs((props: ProgressProps) => props)`
  display: ${props => props.circular ? 'inline' : 'inline-block'};
  margin: 0.4rem 0;
  width: ${props => props.circular ? 'auto' : '100%'};
`;

const ProgressBarStyle = styled.div.attrs((props: any) => props)`
  position: relative;
  height: ${props => props.thin ? '0.2rem' : '0.4rem'};
  width: 100%;
  min-width: 2rem;
  background-color: ${theme.colors.background[2]};
  border-radius: ${theme.rounded};
`;

const ProgressFillStyle = styled.div.attrs((props: ProgressProps) => props)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${props => props.value}%;
  background-color: ${props => theme.colors[props.color === 'secondary' ? 'background' : props.color || 'primary'][props.color === 'secondary' ? 4 : 0]};
  border-radius: ${theme.rounded};
  transition: width 0.2s ease-in-out, background-color 0.5s ease-in-out;
`;

const CircularStyle = styled.svg`
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: transform 0.55s ease-in-out;

  & circle {
    transition: stroke-dashoffset 0.2s ease-in-out;
  }
`;

const DisplayStyle = styled.span.attrs((props: any) => props)`
  position: absolute;
  top: -0.2rem;
  left: ${props => props.value < 10 ? '1.2rem' : props.value >= 100 ? '0.85rem' : '1rem'};
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  font-size: 0.6rem;
`;

const Progress = (props: ProgressProps) => {
  const { indeterminate, circular, displayProgress, displayTrack, radius = 25, value = 0, color = 'primary', thin, ...rest } = props;
  const [barRef, setBarRef] = React.useState<HTMLDivElement | null>(null);
  const [circleRef, setCircleRef] = React.useState<SVGElement | null>(null);
  const [glowState, setGlowState] = React.useState<boolean>(false);
  const [rotation, setRotation] = React.useState<number>(0);
  

  // if indeterminate, glow bar
  useEffect(() => {
    if (indeterminate && barRef) {
      if (glowState) {
        barRef.style.backgroundColor = theme.colors[color === 'secondary' ? 'background' : color || 'primary'][5];
        setTimeout(() => setGlowState(false), 500);
      } else {
        barRef.style.backgroundColor = theme.colors[color === 'secondary' ? 'background' : color || 'primary'][color === 'secondary' ? 4 : 0];
        setTimeout(() => setGlowState(true), 500);
      }
    } else if (indeterminate && circleRef) {
      const timeout = setTimeout(() => {
        circleRef.style.transform = `rotate(${rotation}deg)`;
        setRotation(rotation + 90);
      }, 200);

      return () => clearTimeout(timeout);
    } else {
      setRotation(0);
    }
  }, [indeterminate, glowState, circular, barRef, circleRef, rotation, color]);

  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (indeterminate ? 75 : value) / 100 * circumference;

  return (
    <ProgressStyle
      theme={theme}
      {...rest}
      circular={circular}
    >
      <div style={{ position: 'relative'}}>        
        {circular && displayProgress && !indeterminate && (
          <DisplayStyle value={Math.round(value)}>{Math.round(value)}%</DisplayStyle>
        )}
        {circular ? (
          <CircularStyle
            height={radius * 2}
            width={radius * 2}
            ref={setCircleRef}
          >
            {displayTrack && (
              <circle
                stroke={theme.colors.background[3]}
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{strokeDashoffset: 0, zIndex: -1}}
                stroke-idth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            )}
            <circle
              stroke={theme.colors[color === 'secondary' ? 'background' : color || 'primary'][color === 'secondary' ? 4 : 0]}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{strokeDashoffset}}
              stroke-idth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </CircularStyle>
        ) : (
          <ProgressBarStyle
            theme={theme}
            indeterminate={indeterminate}
            circular={circular}
            value={indeterminate ? 0 : 0.4}
            thin={thin}
          >
            <ProgressFillStyle
              theme={theme}
              indeterminate={indeterminate}
              value={value > 100 ? 100 : (indeterminate ? 100 : value)}
              color={color}
              ref={setBarRef}
            />
          </ProgressBarStyle>
        )}
      </div>
    </ProgressStyle>
  );
}

export default Progress;
