"use client";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

const Page = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Fetch requests from the API
  const fetchRequests = async () => {
    try {
      const response = await axios.get("/api/get-requests");
      setRequests(response.data.requests);
      console.log(requests);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
  };

  // Initialize the map
  const initializeMap = () => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([16.7049873, 74.24], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);

      markersLayerRef.current = L.layerGroup().addTo(mapRef.current);
    }
  };

  useEffect(() => {
    console.log(requests);
  }, [requests]);

  // Display markers on the map
  const displayMarkers = () => {
    if (!markersLayerRef.current || !mapRef.current) return;
    requests.forEach((request) => {
      const customIcon = L.icon({
        iconUrl: request.requestOwner[0]?.avatar || "",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
        className: "rounded-full",
      });

      const marker = L.marker([request.coords.lat, request.coords.long], {
        icon: customIcon,
        title: request.requestOwner[0]?.username || "Unknown",
      }).bindPopup(
        `<strong>${request.title}</strong><br>${request.description}<br>Lat: ${
          request.coords.lat
        }, Long: ${request.coords.long}
        <a href = ${`/view-request/${request._id}`}>View Request</a>
        `
      );

      // Add marker to the markers layer
      markersLayerRef.current!.addLayer(marker);
    });
  };

  useEffect(() => {
    fetchRequests();
    initializeMap();
  }, []);

  useEffect(() => {
    if (requests.length > 0) {
      displayMarkers();
    }
  }, [requests]);

  return (
    <div className="bg-white text-black min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Service Requests</h1>
      {/* <div className="grid gap-6">
        {requests.map((request) => (
          <div
            key={request._id}
            className="p-4 border border-gray-300 rounded-md shadow-md bg-gray-100 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{request.title}</h2>
            <p className="text-gray-700 mb-4">{request.description}</p>
            <p className="text-sm text-gray-500 mb-4">
              <strong>Coords:</strong> lat: {request.coords.lat}, long:{" "}
              {request.coords.long}
            </p>
            {request.media.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {request.media.map((img) => (
                  <img
                    key={img.url}
                    src={img.url}
                    alt="Uploaded media"
                    className="rounded-md border h-32 object-cover border-gray-300"
                  />
                ))}
              </div>
            )}
            {request.requestOwner && request.requestOwner.length > 0 && (
              <div className="flex items-center space-x-4 mt-4">
                <img
                  src={request.requestOwner[0]?.avatar}
                  alt="Owner Avatar"
                  className="h-16 w-16 rounded-full border border-gray-300 object-cover"
                />
                <div>
                  <h3 className="text-lg font-medium">
                    {request.requestOwner[0]?.fullname}
                  </h3>
                  <p className="text-gray-600">
                    @{request.requestOwner[0]?.username}
                  </p>
                  <p className="text-gray-500">
                    Phone: {request.requestOwner[0]?.phone}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div> */}

      <div>
        <div id="map" style={{ height: "90vh", width: "100%" }}></div>
      </div>
    </div>
  );
};

export default Page;
