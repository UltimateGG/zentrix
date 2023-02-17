import React from 'react';
import { theme } from '../theme';
import styled from 'styled-components';
import { hexToRgb } from '../theme';
import Icon, { IconProps } from '../icons/Icon';
import { IconEnum } from '../icons/Icons';


export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  variant?: 'primary' | 'success' | 'danger' | 'warning';
  type?: 'outlined' | 'filled';
  selectable?: boolean;
  deletable?: boolean;
  selected?: boolean;
  icon?: IconProps;
  onClick?: () => void;
  onDelete?: () => void;
}

const ChipContainerStyle = styled.div.attrs((props: ChipProps) => props)`
  display: inline-block;
  margin: 0.2rem 0;
  margin-right: 0.4rem;
`;

const ChipStyle = styled.div.attrs((props: ChipProps) => props)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.2rem 0;
  padding: ${props => props.icon || props.deletable ? '0.2rem 0.8rem' : '0.4rem 1rem'};
  width: 100%;
  height: 100%;
  ${props => props.deletable ? 'padding-right: 0.4rem;' : ''}
  background-color: ${props => {
    if (props.type === 'outlined') return 'transparent';
    if (!props.selected)
      return theme.colors.background[2];

    const col = hexToRgb(theme.colors[props.variant || 'primary'][0]);
    return `rgba(${col.r}, ${col.g}, ${col.b}, 0.1)`;
  }};
  border: 2px solid ${props => theme.colors[props.selected ? (props.variant || 'primary') : 'background'][5]};
  border-radius: ${theme.roundedFull};
  color: ${theme.colors.text[0]};
  text-align: center;
  white-space: nowrap;
  user-select: none;
  transition: all 0.2s ease-in-out;
  ${props => props.selectable && 'cursor: pointer;'}

  &:hover {
    background-color: ${props => {
      if (!props.selectable || props.type === 'outlined') return '';
      if (!props.selected)
        return theme.colors.background[3];

      const col = hexToRgb(theme.colors[props.variant || 'primary'][0]);
      return `rgba(${col.r}, ${col.g}, ${col.b}, 0.25)`;
    }
    };
  }
`;

const TextStyle = styled.div.attrs((props: ChipProps) => props)`
  color: ${theme.colors.text[0]};
  margin-bottom: 0;
  margin-left: ${props => props.icon ? '0.4rem' : 0};
`;

const DeleteIconStyle = styled(Icon).attrs((props: ChipProps) => props)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 0.4rem;

  &:hover {
    cursor: pointer;

    & path {
     fill: ${theme.colors.background[9]};
    }
  }
`;

const Chip = (props: ChipProps) => {
  const { text, variant, type, selectable, deletable, selected, icon, onClick, onDelete, ...rest } = props;


  return (
    <ChipContainerStyle {...rest}>
      <ChipStyle
        theme={theme}
        variant={variant}
        type={type}
        selectable={selectable}
        deletable={deletable}
        selected={selected}
        icon={icon}
        onClick={() => {
          if (selectable && onClick)
            onClick();
        }}
      >
        {icon && <Icon {...icon} />}
        <TextStyle icon={icon} theme={theme}>{text}</TextStyle>
        {deletable && 
          <DeleteIconStyle
            icon={IconEnum.x_filled}
            size={24}
            color={theme.colors.background[8]}
            onClick={onDelete}
            theme={theme}
          />}
      </ChipStyle>
    </ChipContainerStyle>
  );
}

export default Chip;
