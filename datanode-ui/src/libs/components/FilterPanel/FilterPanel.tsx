import React, { memo } from 'react';
import { CheckboxFilter } from './components/CheckboxFilter';
import { DateRangeFilter } from './components/DateRangeFilter';
import { InputFilter } from './components/InputFilter';
import { MultiSelectFilter } from './components/MultiSelectFilter';
import { RadioFilter } from './components/RadioFilter';
import { SelectFilter } from './components/SelectFilter';
import { SwitchFilter } from './components/SwitchFilter';
import { Container } from './FilterPanel.styles';
import { FilterPanelBackdrop } from './FilterPanelBackdrop';
import { FilterModel, FilterPanelProps } from './FilterPanel.types';

const config: { [key: string]: React.FC<FilterModel> } = {
  select: SelectFilter,
  radio: RadioFilter,
  checkbox: CheckboxFilter,
  value: InputFilter,
  switch: SwitchFilter,
  multiselect: MultiSelectFilter,
  date: DateRangeFilter,
};

export const FilterPanel: React.FC<FilterPanelProps> = memo(props => {
  const {
    filters,
    isLoading = false,
    isReloading = false,
    onChange,
    loadingMessage = '',
    showLabel = true,
    hiddenTags = false,
    value = {},
    placeholderSize = 6,
  } = props;

  return (
    <Container className={props.className}>
      {isLoading ? (
        <div className="backdrop">
          <FilterPanelBackdrop size={placeholderSize} />
        </div>
      ) : (
        filters?.map(filter => {
          const Component: React.FC<FilterModel> = config[filter.type];
          return Component ? (
            <Component
              key={filter.name}
              options={filter.options}
              name={filter.name}
              label={filter.label}
              hiddenTags={hiddenTags}
              value={value[filter.name] || []}
              isLoading={isReloading}
              onChange={(value: any) => {
                onChange?.(filter.name, value);
              }}
              className="c-filter-panel"
              showLabel={showLabel}
              parseFilter={filter.parseFilter}
            />
          ) : (
            <React.Fragment key={filter.name}></React.Fragment>
          );
        })
      )}
    </Container>
  );
});
