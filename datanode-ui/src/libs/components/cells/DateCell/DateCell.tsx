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
import styled from "@emotion/styled";
import { getFormatDateAndTime } from "../../../utils/getFormatDate";

const DateContainer: any = styled.div`
  font-size: 13px;
  .date {
    white-space: nowrap;
  }
  .time {
    color: ${({ theme }: any) => theme.palette.textColor.label};
  }
`;

export const DateCell: React.FC<any> = (props: any) => {
  const value = (() => {
    try {
      return getFormatDateAndTime(props.value);
    } catch (e) {
      console.error("WRONG DATE TIME FORMAT, value:", props.value, e);
      return null;
    }
  })();

  return (
    <DateContainer>
      {value ? (
        <>
          <div className="date">{value}</div>
          {/* <div className="time">{value.time}</div> */}
        </>
      ) : (
        "-"
      )}
    </DateContainer>
  );
};
