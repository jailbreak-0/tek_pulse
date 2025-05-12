"use client";

import dynamic from "next/dynamic";

// Dynamically load MapView with SSR disabled
const MapView = dynamic(() => import("./MapView"), { ssr: false });

export default function ClientMapWrapper() {
  return <MapView />;
}
// This component is a wrapper for the MapView component, ensuring it is only rendered on the client side.