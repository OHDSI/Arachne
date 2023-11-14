import React from 'react';
import { CellProps } from '..';
import { Checkbox } from '../../Checkbox/Checkbox';

// export interface Cell<T extends object = {}, V = any> extends CellProps<T, V> {
//   disabled?: boolean;
//   onEdit?: (data: {
//     rowIndex?: number;
//     columnId?: string;
//     value: boolean;
//     row?: any;
//   }) => void;
//   indeterminate?: boolean;
// }

export const CheckboxCell: React.FC<any> = props => {
  const {
    value = false,
    row,
    column,
    onEdit,
    disabled,
    indeterminate = false,
    ...p
  } = props;
  const [val, setValue] = React.useState(value);

  const onChange = (e: any) => {
    setValue(e.target.checked);
    onEdit &&
      onEdit({
        rowIndex: row.index,
        row: row.original,
        columnId: column.id,
        value: e.target.checked,
      });
  };

  // const onBlur = () => {
  //   onEdit &&
  //     onEdit({
  //       rowIndex: row.index,
  //       row: row.original,
  //       columnId: column.id,
  //       value: val,
  //     });
  // };

  React.useEffect(() => {
    setValue(value);
  }, [value, row.id]);

  return (
    <div
      style={{
        textAlign: 'center',
        maxWidth: `calc(100% - ${(column as any).canSort ? '14px' : ''})`,
      }}
    >
      <Checkbox
        checked={val}
        onChange={onChange}
        stopPropagation
        disableRipple
        // onClick={e => e.stopPropagation()}
        // onBlur={onBlur}
        size="small"
        disabled={disabled}
        indeterminate={indeterminate}
      />
    </div>
  );
};
