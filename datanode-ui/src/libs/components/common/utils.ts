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

import { setLightness } from "polished";
import _ from "lodash";
import { Theme } from "@mui/material";

export const getColor =
  (theme: Theme) =>
  	(lightness: number = 0.6, color: string = "primary") =>
  		setLightness(lightness, theme.palette?.[color].main || "#000000");

export const truncate = (
  value: string,
  length: number = 70,
  omission: string = "...",
  separator?: string
): string => {
  return _.truncate(value, {
    length,
    omission,
    ...(separator && { separator }),
  });
};
