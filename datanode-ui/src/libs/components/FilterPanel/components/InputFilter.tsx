import { ButtonGroup, Grid, InputAdornment } from '@mui/material';
import React, { useState, useMemo } from 'react';
import { Input } from '../../Input/Input';
import { Block, IconButton } from '../FilterPanel.styles';
import { FilterModel } from '../FilterPanel.types';
import { Icon } from '../../Icon/Icon';

export const InputFilter: React.FC<FilterModel> = props => {
  const {
    value,
    onChange,
    label,
    inputType,
    className,
    showLabel,
    parseFilter,
  } = props;
  // need to remove parser after complete migration
  const defaultValue = useMemo(
    () => (typeof value === 'string' ? value : value?.join(' ')),
    [value]
  );
  const [input, setInput] = useState(defaultValue || '');
  const onSubmit = e => {
    e.preventDefault();
    onChange(parseFilter(input));
  };

  const onReset = e => {
    e.preventDefault();
    setInput('');
    onChange(parseFilter(''));
  };

  return (
    <Block className={className + ' c-input-item'}>
      <form
        onSubmit={onSubmit}
        className="filter-block__content filter-block__search-content"
      >
        <ButtonGroup fullWidth>
          <Input
            type={inputType || 'text'}
            value={input}
            onChange={e => {
              setInput(e.target.value);
            }}
            fullWidth
            size="medium"
            placeholder={'Filter search...'}
            name={inputType || 'text' + 'Filter'}
            className="filter-panel__search"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ mr: -1 }}>
                  {input && (
                    <IconButton type="reset" onClick={onReset}>
                      <Icon
                        iconName="deactivate"
                        name="reset"
                        sx={{ fontSize: 16, pt: 0.2 }}
                        color="primary"
                      />
                    </IconButton>
                  )}
                  <IconButton type="submit">
                    <Icon
                      iconName="search"
                      name="search"
                      sx={{ fontSize: 18, pt: 0.2 }}
                      color="primary"
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </ButtonGroup>
      </form>
    </Block>
  );
};
