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

import React, { FC, ReactNode } from "react";
import { SecondaryContentWrapper } from "./SecondaryContentWrapper";
import { Block } from "../FilterPanel/FilterPanel.styles";
import { Grid } from "../Grid";
import { Button } from "../Button/Button";

export const ExportWrapper: FC<{
  children?: ReactNode;
  onButtonClick?: () => void;
}> = ({ children, onButtonClick }) => {
  return (
    <SecondaryContentWrapper>
      <Block>
        {onButtonClick && (
          <Grid item xs={12} px={2} pt={2}>
            <Button
              onClick={onButtonClick}
              variant="contained"
              size="small"
              color="info"
              sx={{ px: 2 }}
            >
              Export to {">"}
            </Button>
          </Grid>
        )}
        <Grid item xs={12} container p={2} sx={{ width: "100%" }}>
          <Grid item xs={12}>
            {children}
          </Grid>
        </Grid>
      </Block>
    </SecondaryContentWrapper>
  );
};
