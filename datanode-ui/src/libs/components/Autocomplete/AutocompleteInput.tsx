import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { StyledAutocomplete } from './Autocomplete.styles';
import { Global } from '@emotion/react';
import { CircularProgress } from '@mui/material';

export interface AutocompleteInput {
  id?: string;
  name?: string;
  options: any;
  value: any;
  onChange: (value: any) => void;
  onInputChange?: any;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  size?: any;
  sx?: any;
  className?: any;
}

export const AutocompleteInput: React.FC<AutocompleteInput> = props => {
  const {
    id,
    name = 'auto-select',
    options,
    value: initValue,
    onChange,
    onInputChange,
    placeholder = 'Enter value',
    disabled,
    loading,
  } = props;

  const [value, setValue] = React.useState<string | null>(() => {
    if (![undefined, null, ''].includes(initValue)) {
      const index = options.findIndex(elem => elem.value === initValue || elem.name === initValue);
      if (index >= 0) {
        return options[index];
      } else {
        return {
          name: `${initValue}`,
          value: initValue,
        };
      }
    } else {
      return options[0];
    }
  });
  const [inputValue, setInputValue] = React.useState(initValue);

  useEffect(() => {
    onChange(inputValue);
  }, [inputValue]);

  return (
    <>
      <Global
        styles={`
            .autocomplete-menu-item {
              padding: 2px 10px !important;
              font-weight: 300;
              font-size: 12px;
            }
          `}
      ></Global>
      <StyledAutocomplete
        freeSolo
        value={value}
        disableClearable
        onChange={(event: any, newValue: string | null) => {
          setValue(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          onInputChange?.(newInputValue)
          setInputValue(newInputValue);
        }}
        id={id}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        options={options}
        getOptionLabel={option => option.name || ''}
        size={props.size}
        isDense={props.size == 'small'}
        sx={props.sx}
        classes={
          {
            option: 'autocomplete-menu-item',
            root: 'autocomplete',
            input: 'autocomplete-input',
            inputRoot: 'autocomplete-input-root autocomplete-free-solo-root',
            endAdornment: 'autocomplete-end-adornment',
            popupIndicator: 'autocomplete-open-' + props.className,
            clearIndicator: 'autocomplete-clear-' + props.className,
            listbox: 'autocomplete-options-' + props.className,
          } as any
        }
        renderInput={params => (
          <TextField
            {...params}
            placeholder={placeholder}
            disabled={disabled}
            InputProps={{
              ...params.InputProps,
              classes: {
                notchedOutline: 'autocomplete-notched-outline',
                root: 'autocomplete-input-container',
                focused: 'autocomplete-focused',
              },
              name: name,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="secondary" size={18} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </>
  );
};
