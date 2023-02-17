import React, { useEffect } from 'react';
import { theme } from '../theme';
import styled from 'styled-components';
import { Icon } from '../icons';
import { IconEnum } from '../icons/Icons';


export interface DropdownItem {
  disabled?: boolean;
  label: string;
}

export interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  values: DropdownItem[];
  selected?: DropdownItem;
  onSelectOption?: (item: DropdownItem) => void;
  disabled?: boolean;
  variant?: 'filled' | 'outlined';
  searchable?: boolean;
}

const DropdownStyle = styled.div.attrs((props: any) => props)`
  display: inline-block;
  position: relative;
  margin: 0.4rem 0;
  padding: 0.6rem;
  padding-right: 2.4rem;
  width: 100%;
  min-width: 130px;
  min-height: 2.4rem;
  background-color: ${props => theme.colors.background[props.disabled && props.variant === 'filled' ? 2 : 1]};
  border${props => props.variant === 'outlined' ? '-bottom' : ''}: ${props => props.variant === 'outlined' ? 2 : 1}px solid ${props=> theme.colors.background[props.disabled ? 2 : 5]};
  border-radius: ${props=> props.variant === 'outlined' ? 0 : theme.rounded};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s ease-in-out, border 0.2s ease-in-out;
  opacity: ${props => props.disabled ? 0.5 : 1};

  &:not([disabled]):hover {
    ${props => props.variant === 'filled' && `background-color: ${theme.colors.background[2]};`}
  }

  .selectedText {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    color: ${props => props.disabled ? theme.colors.background[8] : theme.colors.text[0]};
  }
`;

const MenuStyle = styled.div.attrs((props: DropdownProps) => props)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 3;
  background-color: ${theme.colors.background[2]};
  border: 1px solid ${theme.colors.background[5]};
  border-radius: ${theme.rounded};
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.75);
  overflow-y: auto;
  max-height: 20rem;
`;

const ItemStyle = styled.div.attrs((props: DropdownProps) => props)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  color: ${props => props.disabled ? theme.colors.background[5] : theme.colors.text[0]};
  background-color: ${props => props.disabled ? theme.colors.background[1] : theme.colors.background[2]};
  transition: background-color 0.2s ease-in-out;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  &:not([disabled]):hover {
    background-color: ${theme.colors.background[3]};
  }
  
  &:not([disabled]):active {
    background-color: ${theme.colors.background[4]};
  }
`;

const IconTransition = styled(Icon).attrs((props: any) => props)`
  ${props => props.open ? 'transform: rotate(180deg);' : ''}
  transition: transform 0.2s ease-in-out;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto 0 auto auto;
  pointer-events: none;
  z-index: 2;
`;

const MenuTransition = styled.div.attrs((props: any) => props)`
  .j-dropdown-menu {
    opacity: ${props => props.open ? 1 : 0};
    max-height: ${props => props.open ? '20rem' : '0'};
    transition: max-height 0.2s ease-in-out, height 0.2s ease-in-out, opacity 0.2s ease-in-out;
  }
`;

const SearchboxStyle = styled.input.attrs((props: any) => props)`
  width: 100%;
  height: 100%;
  background-color: transparent;
  border: none;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  font-size: 1rem;
`;

/**
 * @param props Use onSelectOption for onChange event
 */
const Dropdown = (props: DropdownProps) => {
  let { values, selected, onSelectOption, disabled, variant = 'filled', searchable, ...rest } = props;
  const [open, setOpen] = React.useState(false);
  const [elemRef, setElemRef] = React.useState<HTMLDivElement | null>(null);
  const [search, setSearch] = React.useState('');
  const [searchRef, setSearchRef] = React.useState<HTMLInputElement | null>(null);


  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.target instanceof Element && !elemRef?.contains(e.target))
        setOpen(false);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape')
        setOpen(false);

      if (!open || !elemRef) return;
      const key = e.key.toLowerCase();
      const options = Array.from(elemRef.querySelectorAll('.j-dropdown-option'));

      // Search by first letter
      const search = options.filter(option => option.innerHTML.toLowerCase().startsWith(key));
      if (search.length) // Scroll to element
          search[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [elemRef, open]);

  if (!selected)
    selected = values[0];

  const toggle = () => {
    if (disabled) return;
    setOpen(!open);

    if (!open)
      searchRef?.focus();
    else
      searchRef?.blur();

    setSearch(selected?.label || '');
  }

  let filtered = values.filter(val => !searchable || search === '' || search === selected?.label ? val : val.label.toLowerCase().trim().includes(search.toLowerCase().trim()));
  if (filtered.length === 0) filtered = values;

  return (
    <DropdownStyle
      theme={theme}
      {...rest}
      onClick={toggle}
      disabled={disabled}
      variant={variant}
      ref={setElemRef}
    >
      {!disabled && searchable ? (
        <SearchboxStyle
          type="text"
          value={searchRef && document.activeElement === searchRef ? search : selected.label}
          disabled={disabled}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          onFocus={() => searchRef?.select()}
          ref={setSearchRef}
        />
      ) : (
        <span className="selectedText">{selected?.label}</span>
      )}

      <MenuTransition open={open}>
        <MenuStyle theme={theme} className="j-dropdown-menu">
          {filtered.map((value, index) => (
            <ItemStyle
              key={index}
              className="j-dropdown-option"
              theme={theme}
              disabled={value.disabled}
              onClick={() => {
                if (value.disabled) return;
                onSelectOption && onSelectOption(value);
                setOpen(false);
              }}
            >
              {value.label}
            </ItemStyle>
          ))}
        </MenuStyle>
      </MenuTransition>

      <IconTransition
        open={open}
        icon={IconEnum.down}
        color={disabled ? theme.colors.background[8] : theme.colors.text[0]}
      />
  </DropdownStyle>);
}

export default Dropdown;
