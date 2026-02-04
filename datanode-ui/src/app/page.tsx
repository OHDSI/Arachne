/*
 * Copyright 2023 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * See the License for the specific language governing permissions and limitations.
 */

"use client";

import dynamic from "next/dynamic";
import React from "react";

const HomePageClient = dynamic(() => import("./HomePageClient"), { ssr: false });

export default function HomePage() {
  return <HomePageClient />;
}
