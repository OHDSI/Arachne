/*
 *
 * Copyright 2023 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import React from "react";
import { DatePicker } from "../../DatePicker/DatePicker";
import { Block, DatePickerContainer } from "../FilterPanel.styles";
import { FilterModel } from "../FilterPanel.types";

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
    <Block className={className + " c-date-range-item"}>
      {showLabel && <label className="filter-block__head">{label}</label>}
      <DatePickerContainer>
        <DatePicker
          // id={'startDate_' + name}
          value={dateRange.startDate || null}
          onChange={handleChange("startDate")}
          fullWidth={false}
          size="medium"
          maxDate={dateRange.endDate}
        />
        _
        <DatePicker
          // id={'endDate_' + name}
          value={dateRange.endDate || null}
          onChange={handleChange("endDate")}
          fullWidth={false}
          size="medium"
          minDate={dateRange.startDate}
        />
      </DatePickerContainer>
    </Block>
  );
};
