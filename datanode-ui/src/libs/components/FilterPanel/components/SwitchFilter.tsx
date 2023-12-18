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

import { Chip } from "@mui/material";
import React, { useMemo } from "react";
import { Switch } from "../../Switch/Switch";
import { Block, CounterTag, Item } from "../FilterPanel.styles";
import { FilterModel } from "../FilterPanel.types";

export const SwitchFilter: React.FC<FilterModel> = props => {
  const { value, onChange, label, className, showLabel, parseFilter, options } =
    props;
  const defaultValue = useMemo(
    () => (value?.[0] === "filter.boolean.true" ? true : false),
    [value]
  );

  const count = useMemo(
    () => options?.find(item => item?.value === "filter.boolean.true")?.tag,
    [options]
  );

  return (
    <Block className={className + " c-switch-item"}>
      <Item className={" switch-item-wrapper"}>
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
