import React from 'react';
import { StyledChip } from '../../Autocomplete/Autocomplete.styles';
import { Block } from '../FilterPanel.styles';
import { FilterModel } from '../FilterPanel.types';
import { Box, Grid } from '@mui/material';
import { Icon } from '../../Icon/Icon';
import { Autocomplete } from '../../Autocomplete/Autocomplete';

export const MultiSelectFilter: React.FC<FilterModel> = props => {
  const {
    options,
    name,
    value,
    onChange,
    label,
    className,
    showLabel,
    hiddenTags = false,
    isLoading,
  } = props;

  const getOptionLabel = React.useCallback(
    option => {
      const item = options?.find(
        item => item?.value === option || item?.value === option?.value
      );
      return item
        ? `${item?.name}` + (item?.tag != null ? ` (${item?.tag})` : '')
        : option;
    },
    [options]
  );

  const handleChange = React.useCallback(
    (event, value, reason, details) => {
      const ANY_VALUE = '';
      if (details?.option?.value === ANY_VALUE) {
        onChange([]);
      } else {
        onChange(
          value
            .map(v => (v?.value != null ? v.value : v))
            .filter(v => v !== ANY_VALUE)
        );
      }
    },
    [onChange]
  );

  return (
    <Block className={className + ' c-multi-select-item'}>
      {showLabel && <label className="filter-block__head">{label}</label>}
      <Autocomplete
        className={name}
        multiple
        options={isLoading ? [] : options}
        isOptionEqualToValue={(option, value) =>
          option?.value === value || option === value
        }
        value={value || []}
        onChange={handleChange}
        getOptionLabel={item => getOptionLabel(item)}
        fullWidth
        loading={isLoading}
        loadingText="Loading options..."
        renderTags={(tagValue, getTagProps) => (
          <Box
            key="tag-props"
            sx={{
              px: 1,
              fontSize: 14,
              color: '#AAAAAA',
            }}
          >
            {tagValue?.length || 'None'} selected...
          </Box>
        )}
        name="multiselectFilter"
        placeholder={value?.length ? '' : `Select ${label.toLowerCase()}...`}
        OptionComponent={(props, option) => {
          return (
            <li
              {...props}
              className={`menu-option-${option?.value || option} ${props.className
                }`}
            >
              {getOptionLabel(option)}
            </li>
          );
        }}
      />
      {!hiddenTags && (
        <Grid container spacing={1} pt={1}>
          {value.map((option, index) => (
            <Grid item key={'select-option-' + index}>
              <StyledChip
                label={getOptionLabel(option)}
                variant="outlined"
                size="small"
                color="primary"
                classes={{
                  root: 'chip selected-filter-option',
                  outlined: 'chip-outlined',
                  deleteIcon:
                    'chip-delete-outlined remove-item-' +
                    (option?.value || option),
                }}
                onDelete={() => {
                  onChange(value.filter((el, i) => i != index));
                }}
                deleteIcon={<Icon iconName="close" sx={{ fontSize: 14 }} />}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Block>
  );
};
