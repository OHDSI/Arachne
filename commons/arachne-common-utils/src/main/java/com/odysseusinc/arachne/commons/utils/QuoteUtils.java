/*
 * Copyright 2019, 2023 Odysseus Data Services, Inc.
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
 */
package com.odysseusinc.arachne.commons.utils;

import java.util.Objects;

public class QuoteUtils {

  public static String dequote(String val) {

    return Objects.nonNull(val) ? val.replaceAll("(^\"|\"$|^'|'$)", "") : val;
  }

  public static String escapeSql(String val) {

    return Objects.nonNull(val) ? val.replaceAll("'", "''") : val;
  }
}
