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

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: process.env.PROXY_HOST,
      changeOrigin: true,
      // Disable SSL when the target is https. Required for running against local backend, otherwise, proxying fails with the an error like:
      // Error occurred while proxying request localhost:3000/api/v1/auth/login to https://localhost:8880/ [DEPTH_ZERO_SELF_SIGNED_CERT]
      secure: false
    })
  );
};