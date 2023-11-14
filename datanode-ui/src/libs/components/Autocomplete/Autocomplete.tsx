import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { StyledAutocomplete } from './Autocomplete.styles';
import { Global } from '@emotion/react';
import { CircularProgress } from '@mui/material';

//  @TODO - SIZES !!! - should be easy to toggle from multi to single
export interface AutocompleteProps {
  id?: string;
  native?: boolean;
  multiple?: boolean;
  name?: string;
  value: any;
  variant?: 'filled' | 'outlined';
  className?: string;
  options?: Array<any>;
  fullWidth?: boolean;
  placeholder?: string;
  size?: 'small' | 'medium'; //| 'large';
  onChange: (...item: any) => void;
  getOptionLabel: (item: any) => string;
  color?: 'primary' | 'secondary';
  OptionComponent?: any;
  getOptionDisabled?: any;
  isOptionEqualToValue?: any;
  renderTags?: any;
  disableClearable?: boolean;
  loading?: boolean;
  loadingText?: string;
  onInputChange?: any;
  disableCloseOnSelect?: boolean;
}

export const Autocomplete: React.FC<AutocompleteProps> = props => {
  return (
    <React.Fragment>
      <Global
        styles={`
          .autocomplete-menu-item {
            padding: 2px 10px !important;
            font-weight: 300;
            font-size: 14px;
          }
        `}
      ></Global>
      <StyledAutocomplete
        multiple={props.multiple}
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        options={props.options}
        getOptionLabel={props.getOptionLabel}
        renderOption={props.OptionComponent}
        isOptionEqualToValue={props.isOptionEqualToValue}
        disableCloseOnSelect={props.disableCloseOnSelect}
        classes={
          {
            option: 'autocomplete-menu-item',
            root: 'autocomplete',
            input: 'autocomplete-input',
            inputRoot: 'autocomplete-input-root',
            endAdornment: 'autocomplete-end-adornment',
            popupIndicator: 'autocomplete-open-' + props.className,
            clearIndicator: 'autocomplete-clear-' + props.className,
            listbox: 'autocomplete-options-' + props.className,
          } as any
        }
        renderTags={props?.renderTags}
        size={'small'}
        isDense={props.size == 'small'}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            className={props.className}
            placeholder={props.placeholder}
            InputProps={{
              ...params.InputProps,
              classes: {
                notchedOutline: 'autocomplete-notched-outline',
                root: 'autocomplete-input-container',
                focused: 'autocomplete-focused',
              },
              name: props.name,
              endAdornment: (
                <React.Fragment>
                  {props.loading ? (
                    <CircularProgress color="secondary" size={18} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
        getOptionDisabled={props.getOptionDisabled}
        disableClearable={props.disableClearable}
        loading={props.loading}
        loadingText={props.loadingText}
      />
    </React.Fragment>
  );
};
