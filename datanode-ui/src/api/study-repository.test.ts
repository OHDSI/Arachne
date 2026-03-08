/*
 *
 * Copyright 2026 Odysseus Data Services/EPAM, Darwin EU, OHDSI
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

import { parseStudyInstallInput } from "./study-repository";

describe("parseStudyInstallInput", () => {
  test("parses an embedded tag suffix", () => {
    expect(parseStudyInstallInput("team/example:main")).toEqual({
      name: "team/example",
      version: "main",
    });
  });

  test("keeps a registry host port when no tag is present", () => {
    expect(parseStudyInstallInput("localhost:5000/team/example")).toEqual({
      name: "localhost:5000/team/example",
      version: "latest",
    });
  });

  test("does not split digest references", () => {
    expect(parseStudyInstallInput("team/example@sha256:abcdef")).toEqual({
      name: "team/example@sha256:abcdef",
      version: "latest",
    });
  });
});
