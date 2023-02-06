import React from 'react';
import { ThemeContext } from '../theme/JetDesign';
import { IconEnum, IconMap } from './Icons';


export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  icon: IconEnum;
  size?: number;
  color?: string;
  onClick?: () => void;
}

const Icon = (props: IconProps) => {
  let { icon, size = 32, color, onClick, ...rest } = props;
  const { theme } = React.useContext(ThemeContext);
  if (!color)
    color = theme.colors.text[0];

  return (
    <svg
      {...rest}
      viewBox='0 0 24 24'
      width={`${size}px`}
      height={`${size}px`}
      onClick={onClick}
    >
      <path d={IconMap[icon]} fill={color} />
    </svg>
  );
}

export default Icon;
