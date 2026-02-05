/*
 * Copyright 2023 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * See the License for the specific language governing permissions and limitations.
 */

"use client";

import dynamic from "next/dynamic";

const ClientRoot = dynamic(() => import("./ClientRoot"), { ssr: false });

export default function ClientRootDynamic({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientRoot>{children}</ClientRoot>;
}
