"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically load MapView with SSR disabled
const MapView = dynamic(() => import("./MapView"), { ssr: false });

const styles = [
  {
    label: "Streets",
    value: "mapbox://styles/jailbreak-0/cmal7fags013p01s3exftd7qk",
  },
  {
    label: "Outdoors",
    value: "mapbox://styles/jailbreak-0/cmal7h1k2014g01s4hj1f0q7l",
  },
  {
    label: "Satellite",
    value: "mapbox://styles/jailbreak-0/cmal5hvlt013i01s339kd0ei3",
  },
];

export default function ClientMapWrapper() {
    const [style, setStyle] = useState(styles[0].value);

return (
  <>
    <div className="flex mb-4 justify-end items-end gap-2">
      <label className="block mb-2 font-medium">Map Style:</label>
      <select
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        className="flex p-2 border rounded w-50px max-w-sm"
      >
        {styles.map((s) => (
          <option key={s.value} value={s.value} className="text-black">
            {s.label}
          </option>
        ))}
      </select>
    </div>
    <MapView mapStyle={style} />
  </>
);
}
// This component is a wrapper for the MapView component, ensuring it is only rendered on the client side.