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

export type FilterPanelProps = {
  filters: Array<Filter>;
  value: any;
  onChange: (key: string, value: any) => void;
  className?: string;
  isLoading?: boolean;
  loadingMessage?: string;
  showLabel?: boolean;
  hiddenTags?: boolean;
  isReloading?: boolean;
  placeholderSize?: number;
};

export type Filter = {
  type:
    | "select"
    | "radio"
    | "checkbox"
    | "value"
    | "switch"
    | "multiselect"
    | "date";
  collapsible?: boolean;
  options: FilterOption[];
  name: string;
  label: string;
  parseFilter?: (value: any) => any;
};

export type FilterOption = {
  name: string;
  value: any;
  tag?: any;
  color?: string;
  active?: (selected: string[]) => boolean;
  onChange?: (value: string[]) => string[];
};

export type FilterModel = {
  className?: string;
  classes?: any;
  options?: FilterOption[];
  inputType?: "text" | "number";
  name: string;
  label: string;
  value: any;
  onChange: (value: string[]) => void;
  showLabel?: boolean;
  hiddenTags?: boolean;
  parseFilter?: (value: any) => any;
  isLoading?: boolean;
};
