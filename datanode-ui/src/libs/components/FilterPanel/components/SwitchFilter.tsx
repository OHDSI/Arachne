import { Chip } from '@mui/material';
import React, { useMemo } from 'react';
import { Switch } from '../../Switch/Switch';
import { Block, CounterTag, Item } from '../FilterPanel.styles';
import { FilterModel } from '../FilterPanel.types';

export const SwitchFilter: React.FC<FilterModel> = props => {
  const { value, onChange, label, className, showLabel, parseFilter, options } =
    props;
  const defaultValue = useMemo(
    () => (value?.[0] === 'filter.boolean.true' ? true : false),
    [value]
  );

  const count = useMemo(
    () => options?.find(item => item?.value === 'filter.boolean.true')?.tag,
    [options]
  );

  return (
    <Block className={className + ' c-switch-item'}>
      <Item className={' switch-item-wrapper'}>
        <Switch
          value={defaultValue}
          checked={defaultValue}
          onChange={e => onChange(parseFilter(e.target.checked))}
          size="small"
          color="info"
        />
        {showLabel && <div className="switch-item-label">{label}</div>}
        {count != null && <CounterTag label={count} size="small" />}
      </Item>
    </Block>
  );
};
