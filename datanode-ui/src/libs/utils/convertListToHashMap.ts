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

export const paramsError: string = "Passed params are not valid!";
export const duplicatesErrorMessage: string = "Duplicates Found: ";
export const invalidObjectsErrorMessage: string = "Invalid Objects Found: ";

export function convertListToHashMap<T = Record<string, never>>(
  list: T[],
  key: string,
  omitKey: boolean = false
): Record<string, T> {
  if (!Array.isArray(list) || typeof key !== "string" || !key)
    throw Error(paramsError);

  const invalidObjects: T[] = [];
  const duplicates: T[] = [];
  const hashMap: Record<string, T> = list.reduce(
    (p: Record<string, T>, c: T) => {
      const hashMapKey = c[key];
      const hashMapKeys = Object.keys(p);
      const isValidHashKey: boolean = ["string", "number"].includes(
        typeof hashMapKey
      );

      if (!isValidHashKey) {
        invalidObjects.push(c);
        return p;
      }

      if (hashMapKeys.includes(String(hashMapKey))) {
        duplicates.push(c);
        return p;
      }

      if (omitKey) {
        delete c[key];
      }
      p[hashMapKey] = c;

      return p;
    },
    {}
  );

  return hashMap;
}
