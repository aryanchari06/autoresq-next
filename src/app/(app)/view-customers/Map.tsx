"use client";

import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
  const [radius, setRadius] = useState<number | null>(null);

  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const getUserCoords = useCallback(() => {
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
      }
    );
  },[toast]);

  const fetchRequests = useCallback(async () => {
    let response;
    try {
      const query = radius ? `&radius=${radius}` : "";
      const apiEndpoint = `/api/get-requests?lat=${coords?.lat}&lon=${coords?.long}${query}`;
      console.log("API about to be hit is ", apiEndpoint);
      response = await axios.get(apiEndpoint).catch(data =>{
        // alert(data.message)
      });
      console.log("response is ", response);
  
      const { data } = response as unknown & {data:any};
      setRequests(data.requests);
    } catch (error) {
      // console.error("Failed to fetch requests:", error);
  
      // Reset map markers and view
      if (markersLayerRef.current) {
        markersLayerRef.current.clearLayers();
      }
      if (mapRef.current && coords) {
        mapRef.current.setView([coords.lat, coords.long], 15);
      }
  
      // Show error toast
      toast({
        title: "Error",
        description: response?.message || "No requests in your area",
        variant: "destructive",
      });
    }
  }, [coords, radius, toast]);
  

  // const fetchRequests = useCallback(async () => {
  //   try {      
  //     const query = radius ? `&radius=${radius}` : "";
  //     const apiEndpoint = `/api/get-requests?lat=${coords?.lat}&lon=${coords?.long}${query}`
  //     console.log("API about to be hit is ", apiEndpoint)
  //     const response = await axios.get( apiEndpoint )
  //     console.log("response is ", response)
  //     const { data } = response;      
  //     setRequests(data.requests);
  //   } catch (error) {
  //     console.error("Failed to fetch requests:", error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to fetch service requests",
  //       variant: "destructive",
  //     });
  //   }
  // }, [coords?.lat, coords?.long, radius, toast]);

  const initializeMap = useCallback( () => {
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
  },[coords, session?.user.avatar]);

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

  const displayMarkers = useCallback(() => {
    if (!markersLayerRef.current) return;

    requests.forEach(({ coords, title, description, requestOwner, _id }) => {
      const avatar =
        requestOwner[0]?.avatar || "https://via.placeholder.com/40";
      const popupContent = ` 
        <strong>${title}</strong><br>${description}<br>
        <a href="/view-request/${_id}" target="_blank">View Request</a>
      `;

      addMarker(coords, popupContent, avatar);
    });
  },[requests]);

  useEffect(() => {
    getUserCoords();
  }, [getUserCoords]);

  useEffect(() => {
    if (coords && session?.user) {
      initializeMap();
      fetchRequests();
    }
  }, [coords, fetchRequests, initializeMap, session?.user]);

  useEffect(() => {
    if (requests.length > 0) {
      displayMarkers();
    }
  }, [displayMarkers, requests]);

  useEffect(() => {
    if (radius !== null) {
      fetchRequests();
    }
  }, [fetchRequests, radius]);

  return (
    <div className="bg-white text-black min-h-screen p-4 sm:p-6">
      <div className="flex justify-center gap-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center">
          Service Requests
        </h1>
        <div className="flex justify-center my-4 mt-0">
          <select
            className="border p-2 rounded-lg"
            value={radius || ""}
            onChange={(e) => setRadius(Number(e.target.value))}
          >
            <option value="">Select Radius</option>
            <option value=""> No Filter </option>
            <option value={5}>under 5 km</option>
            <option value={10}>under 10 km</option>
            <option value={15}>under 15 km</option>
            <option value="">&gt; 15 km</option>
          </select>
        </div>
      </div>
      <div
        id="map"
        style={{ height: "60vh", width: "100%" }}
        className="w-full rounded-lg shadow-md"
      ></div>
    </div>
  );
};

export default Page;
