import React from 'react';
import { StatusTag } from '../../Table/StatusTag/StatusTag';
import { Block, Item, RadioStyled, Tag } from '../FilterPanel.styles';
import { FilterModel } from '../FilterPanel.types';

export const RadioFilter: React.FC<FilterModel> = props => {
  const { options, name, value, onChange, label, className, showLabel } = props;

  return (
    <Block className={className + ' c-radio-item'}>
      {showLabel && (
        <label className="filter-block__head">
          <div className="filter-block__head-title">{label}</div>
        </label>
      )}

      <div className="filter-block__content">
        {options &&
          options.map(option => (
            <div
              key={name + '_' + option.value}
              className="filter-block__option"
            >
              <Item>
                <RadioStyled
                  checked={option.active(value)}
                  value={option.value}
                  onChange={event =>
                    onChange(
                      option.onChange ? option.onChange(value) : [option.value]
                    )
                  }
                  size="small"
                />
                {option.color ? (
                  <StatusTag text={option.name} color={option.color} />
                ) : (
                  <span>{option.name}</span>
                )}
                {option.tag != null && <Tag>{option.tag}</Tag>}
              </Item>
            </div>
          ))}
      </div>
    </Block>
  );
};
