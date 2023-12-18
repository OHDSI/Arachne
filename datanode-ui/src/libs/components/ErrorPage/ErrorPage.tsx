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
import {
  MessageErrorPage,
  StatusDescription,
  StatusHeader,
} from "./ErrorPage.styles";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Grid } from "../Grid";
import { Button } from "../Button/Button";
import { Icon } from "../Icon/Icon";

export interface ErrorPagePropsInterface {
  status: number;
  statusText: string;
  message: string;
  data: any;
  path: string;
  noAction?: boolean;
}

export const ErrorPage: React.FC<ErrorPagePropsInterface> = props => {
  const { status, statusText, message, data, path, noAction = false } = props;

  const MESSAGE = message || data?.message || "";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      textAlign={"center"}
      spacing={1}
      py={2}
    >
      <Grid item xs={12}>
        <StatusHeader>{status}</StatusHeader>
        <StatusDescription>{statusText}</StatusDescription>
      </Grid>
      {MESSAGE && (
        <Grid item xs={12}>
          <MessageErrorPage>{MESSAGE}</MessageErrorPage>
        </Grid>
      )}
      {!noAction && (
        <Grid
          item
          xs={12}
          container
          justifyContent={"center"}
          spacing={2}
          mt={1}
        >
          {status === 42 ? (
            <Grid item>
              <Button
                onClick={() => {
                  navigate("/");
                }}
                variant="outlined"
                size="medium"
                startIcon={<Icon iconName="list" />}
              >
                Go to home
              </Button>
            </Grid>
          ) : (
            <Grid item>
              <Button
                onClick={() => {
                  navigate(`/${path}`);
                }}
                variant="outlined"
                size="medium"
                startIcon={<Icon iconName="list" />}
              >
                Go to list
              </Button>
            </Grid>
          )}
        </Grid>
      )}
    </Grid>
  );
};
