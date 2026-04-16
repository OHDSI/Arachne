import React from "react";
import CatchAllClient from "./CatchAllClient";

// Required for static export (BUILD_STATIC=true) — pre-render known routes.
// Dynamic routes (e.g. /study/123) are handled by the backend's SPA fallback in production.
export function generateStaticParams() {
  return [
    { slug: ["settings"] },
    { slug: ["users"] },
  ];
}

export default function CatchAllPage() {
  return <CatchAllClient />;
}
