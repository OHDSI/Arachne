import React from 'react';
import { DatePicker } from '../../DatePicker/DatePicker';
import { Block, DatePickerContainer } from '../FilterPanel.styles';
import { FilterModel } from '../FilterPanel.types';

export const DateRangeFilter: React.FC<FilterModel> = props => {
  const { value, onChange, label, className, classes, name, showLabel } = props;
  const [dateRange, setDateRange] = React.useState(
    value || {
      startDate: null,
      endDate: null,
    }
  );
  const handleChange = (name: string) => (value: any) => {
    setDateRange({ ...dateRange, [name]: value });
    onChange({ ...dateRange, [name]: value });
  };
  return (
    <Block className={className + ' c-date-range-item'}>
      {showLabel && <label className="filter-block__head">{label}</label>}
      <DatePickerContainer>
        <DatePicker
          // id={'startDate_' + name}
          value={dateRange.startDate || null}
          onChange={handleChange('startDate')}
          fullWidth={false}
          size="medium"
          maxDate={dateRange.endDate}
        />
        _
        <DatePicker
          // id={'endDate_' + name}
          value={dateRange.endDate || null}
          onChange={handleChange('endDate')}
          fullWidth={false}
          size="medium"
          minDate={dateRange.startDate}
        />
      </DatePickerContainer>
    </Block>
  );
};
