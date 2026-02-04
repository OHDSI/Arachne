/*
 * Copyright 2023 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * See the License for the specific language governing permissions and limitations.
 */

import type { Metadata } from "next";
import dynamic from "next/dynamic";
import "../index.css";
import "../App.css";

const ClientRoot = dynamic(() => import("./ClientRoot"), { ssr: false });

export const metadata: Metadata = {
  title: "Arachne Data Node",
  description: "Arachne Data Node UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}
