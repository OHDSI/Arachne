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

import React, { FC } from "react";
import MuiPagination from "@mui/material/Pagination";
import type { IPaginationProps } from "./Pagination.types";

export const Pagination: FC<IPaginationProps> = props => {
  const { total, onChange } = props;
  return <MuiPagination count={total} onChange={onChange} />;
};
