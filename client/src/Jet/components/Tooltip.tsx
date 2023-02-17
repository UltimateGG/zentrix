import React from 'react';
import { theme } from '../theme';
import styled from 'styled-components';
import Icon, { IconProps } from '../icons/Icon';
import { IconEnum } from '../icons/Icons';


export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  icon?: IconProps;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

const TooltipContainerStyle = styled.div`
  display: inline-flex;
  position: relative;
  justify-content: center;
  align-items: center;
`;

const TooltipStyle = styled(Icon).attrs((props: TooltipProps) => props)`
  display: inline-block;
  cursor: pointer;
`;

const TooltipInfoStyle = styled.div.attrs((props: any) => props)`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.background[3]};
  box-shadow: 0px 0px 0.6rem 0.2rem rgba(0, 0, 0, 0.3);
  border-radius: ${theme.rounded};
  padding: 0.6rem;
  color: ${theme.colors.text[0]};
  z-index: 5;
  opacity: ${props => (props.hovering ? 1 : 0)};
  transition: opacity 0.2s ease-in-out;
  font-size: 0.8rem;
  min-height: 2.4rem;
  max-width: 90vw;
  max-width: 35vw;
  width: max-content;
  overflow: hidden;
  ${props => props.position || 'top'}: ${props => props.position === 'top' || props.position === 'bottom' ? 3.2 : 2.2}rem;
  pointer-events: ${props => props.hovering ? 'all' : 'none'};

  & > * {
    margin-bottom: 0;
  }
`;

const Tooltip = (props: TooltipProps) => {
  let { label, icon, position, delay = 300, ...rest } = props;
  const [hovering, setHovering] = React.useState(false);
  const [hoveringInfo, setHoveringInfo] = React.useState(false);


  // Flip position
  switch (position) {
    case 'top':
      position = 'bottom';
      break;
    case 'bottom':
      position = 'top';
      break;
    case 'left':
      position = 'right';
      break;
    case 'right':
      position = 'left';
      break;
    default:
      position = 'top';
      break;
  }

  return (
    <TooltipContainerStyle {...rest} >
      <TooltipStyle
        theme={theme}
        icon={IconEnum.info}
        color={theme.colors.text[3]}
        style={label ? { marginRight: '0.2rem' } : {}}
        {...icon}
        onMouseEnter={() => setTimeout(() => setHovering(true), delay)}
        onMouseLeave={() => setTimeout(() => setHovering(false), delay)}
      />
      {label}
      <TooltipInfoStyle
        hovering={hovering || hoveringInfo}
        position={position}
        theme={theme}
        onMouseEnter={() => setTimeout(() => setHoveringInfo(true), delay)}
        onMouseLeave={() => setTimeout(() => setHoveringInfo(false), delay)}
      >
        {props.children}
      </TooltipInfoStyle>
    </TooltipContainerStyle>);
}

export default Tooltip;
