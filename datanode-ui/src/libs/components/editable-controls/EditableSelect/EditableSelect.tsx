import * as React from 'react';
import { StyledInput } from '../EditableInput/EditableInput.styles';
import { Select, SelectProps } from '@mui/material';
import { StyledMenuItem } from '../../Select/Select.styles';

export type EditableSelectProps = Omit<
  SelectProps & {
    onSubmit: (value: any) => void;
    onCancel: () => void;
    options: any[];
  },
  'onChange'
>;

export const EditableSelect: React.FC<EditableSelectProps> = ({
  value,
  onCancel,
  onSubmit,
  size = 'small',
  placeholder = '...',
  options,
  native = false,
  ...rest
}) => {
  const [active, setActive] = React.useState(false);

  const handleCancel = () => {
    onCancel?.();
    setActive(false);
  };

  return (
    <Select
      {...rest}
      onOpen={e => {
        setActive(true);
      }}
      value={value}
      onChange={e => {
        onSubmit?.(e.target.value);
      }}
      onClose={() => {
        handleCancel();
      }}
      margin="none"
      classes={{
        select: 'select-root' + ' select-' + size,
        nativeInput: 'select-root',
        icon: 'select-icon',
      }}
      placeholder={placeholder}
      input={
        <StyledInput
          active={active}
          size={size}
          placeholder={placeholder}
          //   placeholder={placeholder || '...'}
          classes={{
            root: 'input-root',
            focused: 'input-focused',
            inputSizeSmall: 'input-small',
            inputMultiline: 'input-multiline',
            inputTypeSearch: 'input-search',
          }}
        />
      }
    >
      {placeholder &&
        (native ? (
          <option key="placeholder" value="" disabled>
            {placeholder}
          </option>
        ) : (
          <StyledMenuItem key="placeholder" value="" disabled className={size}>
            {placeholder}
          </StyledMenuItem>
        ))}
      {options &&
        !!options.length &&
        options.map(item =>
          native ? (
            <option value={item.value} key={item.name}>
              {item.name}
            </option>
          ) : (
            <StyledMenuItem value={item.value} key={item.name} className={size}>
              {item.name} {item.tag != null ? `(${item.tag})` : ''}
            </StyledMenuItem>
          )
        )}
    </Select>
  );
};

{
  /* <StyledSelect
        {...(props.id ? { id: props.id } : {})}
        name={name}
        variant="outlined"
        margin="dense"
        native={native}
        multiple={multiple}
        value={value}
        size={size}
        onChange={(e: any) => {
          onChange && onChange(e.target.value, e);
        }}
        fullWidth={fullWidth}
        displayEmpty
        className={clsx(className, 'c-select')}
        classes={
          {
            select: 'select-menu',
            root: 'select-root',
            nativeInput: 'native-select-input',
            icon: 'select-icon',
          } as any // ????
        }
        disabled={disabled}
        input={
          <OutlinedInput
            classes={{
              root: 'select-base',
              focused: 'select-focused',
              notchedOutline: 'select-notched-outline',
              input: 'select-base',
              sizeSmall: 'select-small',
            }}
          />
        }
        MenuProps={{
          disablePortal,
          classes: {
            root: 'select-menu-container',
            paper: 'select-menu',
            list: 'select-menu-list',
          },
        }}
      >
        
      </StyledSelect> */
}
