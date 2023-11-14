import React from 'react';
import { ColumnInstance } from 'react-table';
import { Checkbox } from '../../Checkbox/Checkbox';
import { DropDownMenu } from '../../DropDownMenu/DropDownMenu';
import {
  buttonStyles,
  labelStyles,
  menuContainerStyles,
  menuItemStyles,
} from './ColumnSelect.styles';
import { MenuItem } from '@mui/material';

export const ColumnSelect: React.FC<{
  allColumns: Array<ColumnInstance<any>>;
  showColumnToggle: boolean;
  getToggleHideAllColumnsProps: any;
  immutableColumns: Array<string>;
}> = ({
  allColumns,
  showColumnToggle,
  getToggleHideAllColumnsProps,
  immutableColumns = ['actions', 'selection'],
}) => {
    const cols = React.useMemo(
      () =>
        allColumns.filter(
          item => !['actions', 'selection', ...immutableColumns].includes(item.id)
        ),
      [immutableColumns, allColumns]
    );

    return showColumnToggle ? (
      <DropDownMenu
        size="small"
        title="Columns"
        fullWidth={false}
        sx={buttonStyles}
        preventOverflow
      >
        <div style={menuContainerStyles}>
          <MenuItem key={'select-all'} sx={menuItemStyles}>
            <label style={labelStyles}>
              <Checkbox size="small" {...getToggleHideAllColumnsProps()} />
              <div style={{ marginLeft: 8 }}>Show All</div>
            </label>
          </MenuItem>
          {cols.map(column => {
            return (
              <MenuItem key={column.id} sx={menuItemStyles}>
                <label style={labelStyles}>
                  <Checkbox size="small" {...column.getToggleHiddenProps()} />
                  <div style={{ marginLeft: 8 }}>
                    {column.id !== 'selection'
                      ? column.render('Header')
                      : 'Selection'}
                  </div>
                </label>
              </MenuItem>
            );
          })}
        </div>
      </DropDownMenu>
    ) : (
      <span></span>
    );
  };
