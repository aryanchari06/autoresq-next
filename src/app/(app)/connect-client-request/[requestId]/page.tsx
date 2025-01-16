"use client";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useParams } from "next/navigation";

interface Coords {
  lat: number;
  long: number;
}

const Page = () => {
  const requestId = useParams();
  console.log(requestId);
  const [coords, setCoords] = useState<Coords | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const initializeMap = () => {
    if (!mapRef.current && coords?.lat && coords?.long) {
      // Initialize the map only if it hasn't been initialized yet
      mapRef.current = L.map("map").setView([coords.lat, coords.long], 17);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);
    } else if (mapRef.current) {
      // Update map view if already initialized
      if(coords)
      mapRef.current.setView([coords.lat, coords.long], 17);
    }
  };

  useEffect(() => {
    const watcher = navigator.geolocation.watchPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      },
      () => {
        console.error("Geolocation error");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watcher);
      // Cleanup map when component unmounts
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    initializeMap();
  }, [coords]);

  return (
    <div>
      <div id="map" className="h-[80vh] w-full"></div>
    </div>
  );
};

export default Page;
