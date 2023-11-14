import React, { FC } from 'react';
import {
  ButtonProps,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  PopperPlacementType,
  TooltipProps,
} from '@mui/material';
import {
  menuStyles,
  menuItemStyles,
  menuContainerStyles,
  Line,
  IconWrapper,
} from './DropDownMenu.styles';
import clsx from 'clsx';
import { StyledButton } from '../Button/Button.styles';
import { Tooltip } from '../Tooltip/Tooltip';

export interface OptionItem {
  name: string;
  component?: React.ReactNode;
  disabled?: boolean;
  message?: string; // tooltip text
  iconName?: string;
  id: string;
  endGroup?: boolean;
}

export interface DropDownMenuProps<T> {
  children?: React.ReactNode;
  title: string;
  size?: 'medium' | 'small' | 'large' | 'xsmall';
  disabled?: boolean;
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'text' | 'outlined' | 'contained';
  options?: Array<OptionItem & T>;
  placement?: PopperPlacementType;
  className?: string;
  color?: ButtonProps['color'];
  onClick?: (item?: any) => void;
  closeOnSelect?: boolean;
  preventOverflow?: boolean;
  name?: string;
  sx?: any;
  tooltipPlacement?: TooltipProps['placement'];
  iconComponent?: React.FC<any>;
}

export const DropDownMenu = <T extends object>(props: DropDownMenuProps<T>) => {
  const {
    children,
    title = '',
    size = 'medium',
    fullWidth,
    disabled = false,
    endIcon,
    startIcon,
    variant = 'text',
    options,
    placement,
    onClick,
    className,
    color = 'primary',
    closeOnSelect = false,
    name,
    sx,
    tooltipPlacement,
    iconComponent: IconComponent,
  } = props;
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  // const classes = useDropDownStyles();

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = (event?: MouseEvent | TouchEvent) => {
    if (
      event &&
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <React.Fragment>
      <StyledButton
        buttonSize={size}
        disabled={disabled}
        fullWidth={fullWidth}
        endIcon={endIcon}
        startIcon={startIcon}
        size={size == 'xsmall' ? 'small' : size}
        variant={variant || 'text'}
        color={color}
        onClick={handleToggle}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        className={clsx(className, 'c-dropdown-menu dropdown__button')}
        classes={{
          root: 'button-component',
          contained: 'button-contained',
          outlined: 'button-outlined',
          disabled: 'button-disabled',
          text: 'button-text',
          // label: 'button-label',
        }}
        name={name}
        sx={sx}
      >
        {title}
      </StyledButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        transition
        style={{ zIndex: 100 }}
        placement={placement || 'bottom'}
        disablePortal
        modifiers={[
          {
            name: 'flip',
            enabled: false,
          },
          {
            name: 'preventOverflow',
            ...(props.preventOverflow
              ? {
                  enabled: true,
                  options: {
                    altAxis: true,
                    altBoundary: true,
                    tether: true,
                    rootBoundary: 'document',
                    padding: 8,
                  },
                }
              : { enabled: false }),
          },
        ]}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper sx={menuContainerStyles}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                  sx={menuStyles}
                  className="drop-down-menu"
                >
                  {children ||
                    options?.map((item: OptionItem) => (
                      <Tooltip
                        text={item.message || ''}
                        placement={tooltipPlacement || 'auto'}
                      >
                        <div>
                          <MenuItem
                            key={item.name}
                            className={'menu-item-' + item.name}
                            onClick={e => {
                              onClick && onClick(item);
                              closeOnSelect && handleClose();
                            }}
                            sx={menuItemStyles}
                            disabled={item?.disabled}
                            selected={item.name === title}
                          >
                            <>
                              {IconComponent && (
                                <IconWrapper>
                                  <IconComponent value={item.id} />
                                </IconWrapper>
                              )}
                            </>
                            {item.component || item.name}
                          </MenuItem>
                          {item.endGroup && <Line />}
                        </div>
                      </Tooltip>
                    ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
};
