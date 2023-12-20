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

import * as React from "react";
import { InputBaseProps } from "@mui/material";
import { StyledInput } from "./EditableInput.styles";
import { EditableWrapper } from "../EditableWrapper/EditableWrapper";

export type EditableInputProps = Omit<
  InputBaseProps,
  "onChange" | "color" | "size"
> & {
  onSubmit: (value: any) => void;
  onCancel?: () => void;
  color: string;
  size?: "small" | "medium" | "large";
};

export const EditableInput: React.FC<EditableInputProps> = ({
  value: defaultValue,
  type = "text",
  onCancel,
  onSubmit,
  size = "small",
  placeholder,
  disabled,
  color,
  ...rest
}) => {
  const [value, setValue] = React.useState(null);
  const [active, setActive] = React.useState(false);

  const handleSubmit = () => {
    onSubmit?.(value);
    setActive(false);
  };
  const handleCancel = () => {
    onCancel?.();
    setActive(false);
    setValue(defaultValue);
  };

  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const required = rest.required && !value;
  return (
    <EditableWrapper
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      active={active}
      showActions
      disabled={disabled}
      disableSubmit={required || value === defaultValue}
      submitErrorMessage={
        required
          ? "You cannot save empty value"
          : value === defaultValue
            ? ""
            : "You cannot save fields"
      }
      multiline={rest.multiline}
    >
      <StyledInput
        {...rest}
        onClick={e => {
          setActive(true);
        }}
        value={value || ""}
        onChange={e => {
          setValue(e.target.value);
        }}
        active={active}
        color={color as any}
        readOnly={!active}
        margin="none"
        placeholder={placeholder || "..."}
        size={size as any}
        inputProps={{
          type: type,
        }}
        classes={{
          root: "input-root",
          focused: "input-focused",
          // input: "input-small",
          /** Styles applied to the input element if `size="small"`. */
          inputSizeSmall: "input-small",
          /** Styles applied to the input element if `multiline={true}`. */
          inputMultiline: "input-multiline",
          /** Styles applied to the input element if `type="search"`. */
          inputTypeSearch: "input-search",
        }}
      />
    </EditableWrapper>
  );
};
