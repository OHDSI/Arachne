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

import moment from "moment";
import { DateFormat } from "../enums";

export const getFormatDate = (date: any) => {
  return moment(date).format(DateFormat.DATE);
};

export const getFormatDateAndTime = (date: any) => {
  return moment(date).format(DateFormat.DATE_TIME);
};

export const getFormatDateAndTimeObject = (date: any) => {
  const parsedDate = moment(date);
  return {
    date: parsedDate.format(DateFormat.DATE),
    time: parsedDate.format(DateFormat.TIME),
  };
};

export const getFormatDateFromNow = (date: string) => {
  moment.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: "a few seconds",
      ss: "%d seconds",
      m: "a minute",
      mm: "%d minutes",
      h: "an hour",
      hh: "%d hours",
      d: "a day",
      dd: "%d days",
      w: "a week",
      ww: "%d weeks",
      M: "a month",
      MM: "%d months",
      y: "a year",
      yy: "%d years",
    },
  });
  return moment(date).fromNow();
};
