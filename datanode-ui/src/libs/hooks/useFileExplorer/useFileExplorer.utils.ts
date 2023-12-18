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

import { AntivirusFileStatus } from "../../enums";
import { FileExplorerTypes } from "./useFileExplorer.enum";
import { FileExtension } from "../../enums";

interface FileExplorerElement {
  id: string;
  name: string;
  icon: string;
  ext: string;
  type: FileExplorerTypes;
  children?: string[];
  antivirusStatus: AntivirusFileStatus;
}

interface FilesResultDTOInterface {
  createdDate: string;
  modifiedDate: string;
  id: string;
  fileMetadata: {
    antivirusFileStatusDto: AntivirusFileStatus;
    length: number;
    path: string;
    realName: string;
  };
}

export const getExtensionFile = name => {
  const re = /(?:\.([^.]+))?$/;
  const ext = re.exec(name)[1]?.toUpperCase();
  return ext ? FileExtension[ext] || FileExtension.UNKNOWN : "FOLDER";
};

export const createStructure = (files: any[]) => {
  // initialize resulting object
  const fileTree = Object.defineProperties(
    {},
    { __size__: { value: 0, writable: true } }
  );

  // TODO - cleanup types
  const setElement = (pathArr: string[], structure: any, file: any) => {
    if (pathArr?.length) {
      const name = pathArr[0];
      if (!structure[name]) {
        if (pathArr?.length === 1) {
          //create file
          structure[name] = {
            ...file,
          };
          // all this properties are not enumerable so won't appear in the object keys
          Object.defineProperties(structure[name], {
            ext: { value: getExtensionFile(name) },
            __type__: { value: FileExplorerTypes.FILE },
            __name__: { value: name },
          });
        } else {
          // create folder
          structure[name] = {};
          Object.defineProperties(structure[name], {
            ext: { value: "folder" },
            __type__: { value: FileExplorerTypes.FOLDER },
            __name__: { value: name },
            __size__: { value: 0, writable: true },
          });
        }

        structure.__size__++;
      }
      // recursively call until reach file
      setElement(pathArr.slice(1), structure[name], file);
    }
    return;
  };

  files.forEach(file => {
    // split realName (path) into separate dir names
    const path = file.path.split("/");
    setElement(path, fileTree, file);
  });

  return fileTree;
};
