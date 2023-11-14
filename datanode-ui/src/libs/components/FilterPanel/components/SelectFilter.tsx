import React from 'react';
import { Select } from '../../Select/Select';
import { Block } from '../FilterPanel.styles';
import { FilterModel } from '../FilterPanel.types';

export const SelectFilter: React.FC<FilterModel> = props => {
  const { options, name, value, onChange, label, className, showLabel } = props;

  return (
    <Block className={className + ' c-select-item'}>
      {showLabel && <label className="filter-block__head">{label}</label>}
      <Select
        options={options}
        value={value || ''}
        onChange={onChange}
        size="medium"
        fullWidth
        name="selectFilter"
      />
    </Block>
  );
};
