"use client";

import { useRef, useEffect } from "react";
import mapboxgl, { LngLatLike, Map } from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

type MapboxMapProps = {
  center?: [number, number];
  zoom?: number;
  marker?: [number, number];
  onClick?: (coords: [number, number]) => void;
  mapStyle?: string;
};

export default function MapboxMap({
  center = [-1.573122, 6.676702],
  zoom = 15,
  marker,
  onClick,
  mapStyle = "mapbox://styles/jailbreak-0/cmal5hvlt013i01s339kd0ei3",
}: MapboxMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle || "mapbox://styles/jailbreak-0/cmal5hvlt013i01s339kd0ei3",
      center: center as LngLatLike,
      zoom,

      maxBounds: [
        [-1.597893, 6.659612], // Southwest corner (lng, lat)
        [-1.544703, 6.693702], // Northeast corner (lng, lat)
      ],
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

  useEffect(() => {
    if (mapRef.current && mapStyle) {
      mapRef.current.setStyle(mapStyle);
    }
  }, [mapStyle]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[600px] rounded border shadow cursor-grab"
    />
  );
}
