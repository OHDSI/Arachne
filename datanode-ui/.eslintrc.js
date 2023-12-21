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

module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended"
  ],
  "overrides": [
    {
      "env": {
        "node": true
      },
      "files": [
        ".eslintrc.{js,cjs}"
      ],
      "parserOptions": {
        "sourceType": "script"
      }
    }
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint",
    "react",
    "license-header"
  ],
  "rules": {
    "indent": [
      "error",
      2
    ],
    "license-header/header": [0, "./public/license-header.js"],
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/ban-ts-comment": 0,
    "no-mixed-spaces-and-tabs": 0,
    "react/prop-types": 0,
    "react/display-name": 0,
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "@typescript-eslint/ban-types": 0,
    "react/jsx-key": 0,
    "no-empty": 0,
    "@typescript-eslint/no-duplicate-enum-values": 0,
    "no-unsafe-optional-chaining": 0,
    "react/react-in-jsx-scope": 0,
    "no-undef": 0,
    "indent": 0,
    "linebreak-style": [
      0,
      "unix"
    ],
    "quotes": [
      0,
      "double"
    ],
    "semi": [
     0,
      "always"
    ]
  }
};
