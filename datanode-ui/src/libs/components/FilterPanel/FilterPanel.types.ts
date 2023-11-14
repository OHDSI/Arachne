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
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'value'
    | 'switch'
    | 'multiselect'
    | 'date';
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
  inputType?: 'text' | 'number';
  name: string;
  label: string;
  value: any;
  onChange: (value: string[]) => void;
  showLabel?: boolean;
  hiddenTags?: boolean;
  parseFilter?: (value: any) => any;
  isLoading?: boolean;
};
