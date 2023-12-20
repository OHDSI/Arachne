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

import { AuthorCell, DateCell, NameCell } from "../cells";

export const pageListConfig = {
  columns: [
    {
      Header: "Id",
      accessor: "shortcut",
      id: "shortcut",
    },
    {
      Header: "Name",
      accessor: "name",
      id: "name",
      maxWidth: 400,
      isCropped: true,
      Cell: NameCell,
    },
    {
      Header: "Created",
      accessor: "created.timestamp",
      id: "created.timestamp",
      Cell: DateCell,
      isCropped: true,
      minWidth: 150,
      maxWidth: 150,
    },
    {
      Header: "Updated",
      accessor: "modified.timestamp",
      id: "modified.timestamp",
      Cell: DateCell,
      isCropped: true,
      minWidth: 150,
      maxWidth: 150,
    },
    {
      Header: "Author",
      id: "created.user.name",
      accessor: "created.user.name",
      Cell: AuthorCell,
    },
  ],
  entityBreadcrumbs: (config: any) => {
    const breadCrumbs = [];
    const { rootTitle, parentTitle, title, rootPath, parentId, path } = config;

    if (rootTitle) {
      breadCrumbs[0] = {
        name: rootTitle,
        path: `${rootPath}`,
      };
    }
    if (parentId) {
      breadCrumbs[1] = {
        name: parentTitle,
        path: `${rootPath}/${parentId}`,
      };
    }
    if (rootTitle !== title) {
      if (parentId) {
        breadCrumbs[2] = {
          name: title,
          path: path,
        };
      } else {
        breadCrumbs[1] = {
          name: title,
          path: path,
        };
      }
    }
    return breadCrumbs;
  },
};

export const initialStorage = (name, hiddenColumns) => {
  return (
    localStorage.getItem(name) ||
    JSON.stringify({
    	filters: {},
    	pageSize: 15,
    	sort: null,
    	columns: hiddenColumns || ["shortcut", "created.timestamp"],
    })
  );
};

export const useLocalStorage = (name, hiddenColumns) => {
  const initialState = initialStorage(name, hiddenColumns);

  return {
    storage: JSON.parse(initialState),
    setStorage: (nameProp, data) => {
      const updateState = initialStorage(name, hiddenColumns);
      localStorage.setItem(
        name,
        JSON.stringify({
          ...JSON.parse(updateState),
          [nameProp]: data,
        })
      );
    },
  };
};
