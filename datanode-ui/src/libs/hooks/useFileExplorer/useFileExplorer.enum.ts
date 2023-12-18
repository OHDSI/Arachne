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

export enum UseFileExplorerStatus {
  LOADING_FILE = "LOADING_FILE",
  LOADED_FILE_DONE = "LOADED_FILE_DONE",
  LOADED_FILE_FAILED = "LOADED_FILE_FAILED",
}

export enum UseFileExplorer {
  SAVE_FILE_REQUEST = "SAVE_FILE_REQUEST",
  SAVE_FILES_REQUEST_DONE = "SAVE_FILES_REQUEST_DONE",
  SAVE_FILES_REQUEST_FAILED = "SAVE_FILES_REQUEST_FAILED",
  SELECT_FILE = "SELECT_FILE",
  LOAD_FILE_REQUEST = "LOAD_FILE_REQUEST",
  LOAD_FILE_REQUEST_DONE = "LOAD_FILE_REQUEST_DONE",
  LOAD_FILE_REQUEST_FAILED = "LOAD_FILE_REQUEST_FAILED",
}

export enum FileExplorerTypes {
  FOLDER = "FOLDER",
  FILE = "FILE",
  ZIP = "ZIP",
  COMPONENT = "COMPONENT",
}
