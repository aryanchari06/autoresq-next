"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MechanicDetails from "./MechanicDetails";
import { LoaderPinwheel } from "lucide-react";

interface LocationData {
  latitude: number;
  longitude: number;
}

interface Coords {
  lat: number;
  long: number;
}

export default function ChatRoom() {
  const { requestId } = useParams();
  const room = requestId as string;

  const { data: session } = useSession();
  const [coords, setCoords] = useState<Coords | null>(null);
  const [receivedCoords, setReceivedCoords] = useState<Coords | null>(null);
  const [count, setCount] = useState(0);
  const role = session?.user.role;
  const [roomRequest, setRoomRequest] = useState<any>();
  const [isOngoing, setIsOngoing] = useState(false);
  const { toast } = useToast();
  const [isVerifyAvailable, setIsVerifyAvailable] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);

  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [socket, setSocket] = useState<Socket | null>(null);

  const fetchRequest = async () => {
    const response = await axios.get(`/api/fetch-request?request=${requestId}`);
    const fetchedRequest = await response.data.request;
    setRoomRequest(fetchedRequest);
    console.log("Fetched request:", fetchedRequest);
  };

  const initializeMap = () => {
    if (mapRef.current || !coords) return;

    mapRef.current = L.map("map").setView([coords.lat, coords.long], 20);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapRef.current);

    markersLayerRef.current = L.layerGroup().addTo(mapRef.current);

    // Add initial marker for the current user
    addOrUpdateMarker(
      coords,
      "current-user",
      "You are here",
      true,
      session?.user.avatar
    );
    setIsMapLoading(false);
  };

  const addOrUpdateMarker = (
    coords: Coords,
    key: string,
    title: string,
    isCurrentUser: boolean,
    iconUrl: string = "https://cdn-icons-png.freepik.com/512/8742/8742495.png"
  ) => {
    if (!markersLayerRef.current) return;

    // Remove existing marker with the same key
    markersLayerRef.current.eachLayer((layer: any) => {
      if (layer.options && layer.options.key === key) {
        markersLayerRef.current?.removeLayer(layer);
      }
    });

    const customIcon = L.icon({
      iconUrl,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
      className: "rounded-full",
    });

    const marker = L.marker([coords.lat, coords.long], {
      icon: customIcon,
      title,
      key, // Custom key to identify the marker
    } as L.MarkerOptions).bindPopup(
      isCurrentUser ? `<strong>${title}</strong>` : title
    );

    markersLayerRef.current.addLayer(marker);
  };

  const verifyConfirmationOTP = async () => {
    try {
      setIsVerifyingOTP(true);
      const verifyOTP = await axios.post(`/api/verify-confirmation-code`, {
        otp,
        requestId,
      });
      console.log(verifyOTP);
      if (verifyOTP.data.success) {
        toast({
          title: "Success",
          description: "OTP verified successfully!",
        });

        router.replace(`/ongoing-repair/${requestId}`);
      } else {
        toast({
          title: "Failure",
          description: "Incorrect OTP",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error while verifying otp: ", error);
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const setStatusOngoing = async () => {
    const response = await axios.post("/api/otp-accepted", {
      id: requestId,
    });
  };

  useEffect(() => {
    if (roomRequest && receivedCoords) {
      if (session?.user.role === "client") {
        addOrUpdateMarker(
          receivedCoords,
          "other-user",
          "Other User",
          false,
          roomRequest?.requestMechanic[0]?.avatar
        );
      } else if (session?.user.role === "service") {
        addOrUpdateMarker(
          receivedCoords,
          "other-user",
          "Other User",
          false,
          roomRequest?.requestOwner[0]?.avatar
        );
      }
    }
  }, [roomRequest, receivedCoords]);

  useEffect(() => {
    fetchRequest();
  }, [count, isOngoing]);

  // Initialize the map
  useEffect(() => {
    initializeMap();
  }, [coords]); // Update map when coords change

  // Handles socket connection and coordinates sharing
  useEffect(() => {
    if (!room || !role) {
      console.log("No room initialized");
      return;
    }

    const socketServerUrl = process.env.NEXT_PUBLIC_SOCKETSERVER_URL;
    if (!socketServerUrl) {
      console.error(
        "Please set the NEXT_PUBLIC_SOCKETSERVER_URL environment variable."
      );
      return;
    }

    const newSocket = io(socketServerUrl);
    setSocket(newSocket);

    newSocket.emit("init", { room, role });

    newSocket.on("recv-location", (data: LocationData) => {
      const receivedCoords = { lat: data.latitude, long: data.longitude };
      console.log("Received location:", receivedCoords);

      // Update the state and add/update marker
      setReceivedCoords(receivedCoords);
      //  to refetch only once used simple form of setCount
      setCount(count + 1);
    });

    newSocket.on("status-ongoing", (data) => {
      console.log("Status onoging: ", data);
      const { message, taskStatus } = data;
      setIsOngoing(true);
      if (taskStatus) {
        toast({
          title: "Success",
          description: "Task is now ongoing",
        });

        setTimeout(() => {
          router.replace(`/ongoing-repair/${requestId}`);
        }, 3000);
      }
    });

    newSocket.on("error", (error: string) => {
      alert(error);
      newSocket.disconnect();
      setSocket(null);
    });

    let locationInterval: NodeJS.Timer;
    if (navigator.geolocation) {
      locationInterval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const currentCoords = { lat: latitude, long: longitude };
            setCoords(currentCoords);
            console.log("Sending location:", currentCoords);

            // Emit the current location to the server
            newSocket.emit("send-location", {
              room,
              latitude,
              longitude,
            });

            // Add/update marker for the current user
            addOrUpdateMarker(
              currentCoords,
              "current-user",
              "You are here",
              true,
              session?.user.avatar
            );
          },
          (error) => {
            console.error("Error getting location:", error);
          },
          {
            enableHighAccuracy: true,
          }
        );
      }, 5000);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    return () => {
      if (locationInterval) clearInterval(locationInterval.toString());
      newSocket.disconnect();
      setSocket(null);

      // Cleanup the map
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [room, role]);

  if (!session) {
    return <div>Please sign in to chat</div>;
  }

  return (
    <div className="relative p-6 rounded-sm">
      {isMapLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-200 bg-opacity-80 z-50">
          <LoaderPinwheel className="animate-spin text-gray-700" size={40} />
        </div>
      )}
      <div
        id="map"
        className="z-0"
        style={{ height: "70vh", width: "100%" }}
      ></div>
      {session.user.role === "client" ? (
        <div
          className="absolute top-3 right-2 z-10 bg-gray-300 bg-opacity-80 text-gray-600 p-2 rounded-md text-sm sm:text-base"
          onClick={() => {
            setIsMessageOpen((prev) => !prev);
          }}
        >
          <HoverCard open={isMessageOpen}>
            <HoverCardTrigger>Important!</HoverCardTrigger>
            <HoverCardContent>
              Your request confirmation OTP will be mailed to you once a
              mechanic accepts your request. Please provide it to the repairman
              upon arrival. The mechanic details will appear below once he
              accepts your request.
            </HoverCardContent>
          </HoverCard>
        </div>
      ) : (
        <div className="absolute top-3 right-2 z-10 bg-opacity-50 text-black p-4 rounded-md md:w-2/6 w-3/6 ">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Verify OTP</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                A request confirmation OTP has been sent to the client. Please
                verify it upon arrival.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 text-sm sm:text-base"
                  onChange={(e) => {
                    const newOtp = e.currentTarget.value;
                    setOtp(newOtp);
                    if (newOtp.length === 6) {
                      setIsVerifyAvailable(true);
                    } else {
                      setIsVerifyAvailable(false);
                    }
                  }}
                />

                <Button
                  className="p-2 bg-gray-900 text-white rounded-md hover:bg-gray-950 text-sm sm:text-base"
                  disabled={!isVerifyAvailable}
                  onClick={verifyConfirmationOTP}
                >
                  {isVerifyingOTP ? (
                    <>
                      <LoaderPinwheel className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {session.user.role === "client" && roomRequest?.requestMechanic[0] ? (
        <MechanicDetails user={roomRequest?.requestMechanic[0]} />
      ) : (
        <></>
      )}
    </div>
  );
}
