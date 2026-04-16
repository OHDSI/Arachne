"use client";

import dynamic from "next/dynamic";
import React from "react";

const HomePageClient = dynamic(() => import("../HomePageClient"), { ssr: false });

export default function CatchAllClient() {
  return <HomePageClient />;
}
