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
import { CellProps } from "..";
import { Checkbox } from "../../Checkbox/Checkbox";
import { Input } from "../../Input/Input";

// export interface InputCellProps<T extends object = {}, V = any>
//   extends CellProps<T, V> {
//   disabled?: boolean;
//   onEdit?: (data: {
//     rowIndex?: number;
//     columnId?: string;
//     value: boolean;
//     row?: any;
//   }) => void;
//   indeterminate?: boolean;
// }

export const InputCell: React.FC<any> = props => {
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
    setValue(e.target.value);
    onEdit &&
      onEdit({
      	rowIndex: row.index,
      	row: row.original,
      	columnId: column.id,
      	value: e.target.value,
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
        textAlign: "center",
        maxWidth: `calc(100% - ${(column as any).canSort ? "14px" : ""})`,
      }}
    >
      <Input
        value={val}
        onChange={onChange}
        // stopPropagation
        // disableRipple
        // onClick={e => e.stopPropagation()}
        // onBlur={onBlur}
        size="small"
        disabled={disabled}
        // indeterminate={indeterminate}
      />
    </div>
  );
};
