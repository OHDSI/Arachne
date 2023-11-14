import React, { useEffect } from 'react';
import { StatusTag } from '../../Table/StatusTag/StatusTag';
import { FilterModel, FilterOption } from '../FilterPanel.types';
import {
  Block,
  CheckboxStyled,
  Item,
  SearchField,
  SearchFieldContainer,
  Tag,
} from '../FilterPanel.styles';

export const CheckboxFilter: React.FC<FilterModel> = props => {
  const { name, value, label, options, className, onChange, showLabel } = props;

  const [search, setSearch] = React.useState('');
  const [filterOptions, setFilterOptions] =
    React.useState<FilterOption[]>(options);

  const flip =
    (value: string) =>
    (items: Array<string>): Array<string> => {
      const index = items.indexOf(value);
      return index > -1
        ? [...items.slice(0, index), ...items.slice(index + 1)]
        : [...items, value];
    };

  // const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const newValue = getNewValue(event);
  //   onChange(Array.from(newValue));
  // };

  useEffect(() => {
    setFilterOptions(
      search
        ? options.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase())
          )
        : options
    );
    return () => {
      setFilterOptions([]);
    };
  }, [search]);

  const handleChange = (option: FilterOption) => () =>
    onChange((option.onChange || flip(option.value))(value));

  return (
    <Block className={className + ' c-checkbox-item'}>
      {showLabel && <label className="filter-block__head">{label}</label>}

      <>
        {options.length > 5 && (
          <SearchFieldContainer className="search-field__container">
            <SearchField
              type="text"
              value={search}
              size="small"
              fullWidth
              placeholder="Search..."
              onChange={e => setSearch(e.target.value)}
            />
          </SearchFieldContainer>
        )}
        <div className="filter-block__content">
          {filterOptions?.length ? (
            filterOptions.map((option: FilterOption) => (
              <div key={name + '_' + option.name + '_' + option.value}>
                <Item>
                  <div className="filter-block__option">
                    <CheckboxStyled
                      checked={option.active?.(value)}
                      value={option.value}
                      onChange={handleChange(option)}
                      // onBlur={handleBlur}
                      size="small"
                    />
                    {option.color != null ? (
                      <StatusTag text={option.name} color={option.color} />
                    ) : (
                      <span>{option.name}</span>
                    )}
                  </div>
                  {option.tag != null && <Tag>{option.tag}</Tag>}
                </Item>
              </div>
            ))
          ) : (
            <div
              style={{
                color: 'lightgrey',
                fontSize: 14,
                textAlign: 'center',
              }}
            >
              List is empty
            </div>
          )}
        </div>
      </>
    </Block>
  );
};
