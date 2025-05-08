"use client";

import { useRef, useEffect } from "react";
import mapboxgl, { LngLatLike, Map } from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

type MapboxMapProps = {
  center?: [number, number];
  zoom?: number;
  marker?: [number, number];
  onClick?: (coords: [number, number]) => void;
};

export default function MapboxMap({
  center = [0, 0],
  zoom = 15,
  marker,
  onClick,
}: MapboxMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: center as LngLatLike,
      zoom,
    });

    mapRef.current = map;

    if (onClick) {
      map.on("click", (e) => {
        const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
        onClick(coords);
      });
    }

    return () => map.remove();
  }, []);

  useEffect(() => {
    if (marker && mapRef.current) {
      if (!markerRef.current) {
        markerRef.current = new mapboxgl.Marker()
          .setLngLat(marker as LngLatLike)
          .addTo(mapRef.current);
      } else {
        markerRef.current.setLngLat(marker as LngLatLike);
      }
    }
  }, [marker]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[400px] rounded border shadow"
    />
  );
}
