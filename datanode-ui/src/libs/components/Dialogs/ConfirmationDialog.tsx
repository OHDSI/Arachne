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

import { Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import React, { ReactNode, useState } from "react";
import { Button } from "../Button/Button";

export type ParamsOnSubmitType = {
  dismissNote?: string;
};

export interface ConfirmationDialogProps {
  onDecline?: () => void;
  onSubmit?: (params?: ParamsOnSubmitType) => void;
  onClose: () => void;
  text?: ReactNode;
  open?: boolean;
  TextField?: any;
  confirmButtonText?: string;
  cancelButtonText?: string;
  variant?: "error" | "info" | "success" | "warning";
}
export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = props => {
  const {
    onSubmit,
    onDecline,
    onClose,
    text,
    confirmButtonText,
    cancelButtonText,
    TextField,
    variant = "info",
  } = props;
  const [textFieldValue, setTextFieldValue] = useState("");
  const TextFieldComponent = TextField;

  return (
    <Dialog open={props.open}>
      <DialogContent>
        <DialogContentText className="alert-dialog-description">
          {text || "Are you sure you want to delete this item?"}
        </DialogContentText>

        {TextFieldComponent && (
          <TextFieldComponent
            style={{ width: "100%" }}
            value={textFieldValue}
            onChange={(event: { target: { value: string } }) => {
              setTextFieldValue(event?.target?.value);
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onDecline && onDecline();
            setTextFieldValue("");
            onClose && onClose();
          }}
          size="small"
          variant="outlined"
          name="cancel"
          color="info"
        >
          {cancelButtonText || "CANCEL"}
        </Button>
        <Button
          onClick={() => {
            onSubmit && onSubmit({ dismissNote: textFieldValue });
            setTextFieldValue("");
            onClose && onClose();
          }}
          variant="contained"
          size="small"
          name="confirm"
          color={variant}
        >
          {confirmButtonText || "CONFIRM"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
