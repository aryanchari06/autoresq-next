"use client";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

interface Coords {
  lat: number;
  long: number;
}

interface Media {
  url: string;
}

interface RequestOwner {
  avatar: string;
  username: string;
  fullname: string;
  phone: string;
  email: string;
  id: string;
}

interface ServiceRequest {
  _id: string;
  client: string;
  title: string;
  description: string;
  coords: Coords;
  media: Media[];
  status: string;
  requestOwner: RequestOwner[];
}

const Page = () => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [coords, setCoords] = useState<Coords | null>(null);

  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const getUserCoords = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoords({ lat: latitude, long: longitude });
      },
      (error) => {
        console.error("Error fetching coordinates:", error);
        toast({
          title: "Failure",
          description: error.message,
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get("/api/get-requests");
      setRequests(data.requests);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      toast({
        title: "Error",
        description: "Failed to fetch service requests",
        variant: "destructive",
      });
    }
  };

  const initializeMap = () => {
    if (mapRef.current || !coords) return;

    mapRef.current = L.map("map").setView([coords.lat, coords.long], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapRef.current);

    markersLayerRef.current = L.layerGroup().addTo(mapRef.current);

    if (session?.user.avatar) {
      coords.lat = coords.lat + Math.random() * 0.006;
      coords.long = coords.long + Math.random() * 0.006;
      addMarker(coords, "You are here", session.user.avatar || "", true);
    }
  };

  const addMarker = (
    coords: Coords,
    title: string,
    iconUrl: string,
    isCurrentUser: boolean = false
  ) => {
    if (!markersLayerRef.current) return;

    const customIcon = L.icon({
      iconUrl,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
      className: isCurrentUser
        ? "rounded-full border-2 border-blue-500"
        : "rounded-full",
    });

    const marker = L.marker([coords.lat, coords.long], {
      icon: customIcon,
      title,
    }).bindPopup(title);

    markersLayerRef.current.addLayer(marker);
  };

  const displayMarkers = () => {
    if (!markersLayerRef.current) return;
    // markersLayerRef.current.clearLayers();

    requests.forEach(({ coords, title, description, requestOwner, _id }) => {
      const avatar =
        requestOwner[0]?.avatar || "https://via.placeholder.com/40";
      const popupContent = `
        <strong>${title}</strong><br>${description}<br>
        <a href="/view-request/${_id}" target="_blank">View Request</a>
      `;

      addMarker(coords, popupContent, avatar);
    });
  };

  useEffect(() => {
    getUserCoords();
  }, []);

  useEffect(() => {
    if (coords && session?.user) {
      initializeMap();
      fetchRequests();
    }
  }, [coords, session?.user]);

  useEffect(() => {
    if (requests.length > 0) {
      displayMarkers();
    }
  }, [requests]);

  return (
    <div className="bg-white text-black min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Service Requests</h1>
      <div id="map" style={{ height: "90vh", width: "100%" }}></div>
    </div>
  );
};

export default Page;
