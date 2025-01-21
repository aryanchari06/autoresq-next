"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { useSession } from "next-auth/react";
import mongoose from "mongoose";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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

interface RequestProps {
  request: ServiceRequest;
}

const Request: React.FC<RequestProps> = ({ request }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);

  const handleAcceptRequest = async () => {
    try {
      setIsAcceptingRequest(true);
      const response = await axios.post("/api/accept-service-request", {
        requestId: request._id,
        mechanicId: session?.user._id,
      });

      console.log(response);

      const requestId = response.data.data._id;
      console.log(requestId);

      router.replace(`/connect-client-request/${requestId}`);
    } catch (error) {
      throw new Error("Failed to accept service request");
    } finally {
      setIsAcceptingRequest(false);
    }
  };
  console.log("REQUEST: ", request);
  return (
    <div className="grid gap-6 pb-6 bg-white shadow-xl transition-shadow">
      <div key={request._id} className="p-8 rounded-lg ">
        <h2 className="text-3xl font-semibold text-gray-900 mb-3">
          {request.title}
        </h2>
        <p className="text-gray-700 text-lg mb-6">{request.description}</p>

        {request.media.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
            {request.media.map((img) => (
              <img
                key={img.url}
                src={img.url}
                alt="Uploaded media"
                className="rounded-lg border border-gray-300 w-full h-64 object-cover"
              />
            ))}
          </div>
        )}

        {request.requestOwner && (
          <div className="flex items-center space-x-6 mt-6 border-t pt-6">
            <img
              src={request.requestOwner[0].avatar}
              alt="Owner Avatar"
              className="h-20 w-20 rounded-full border-4 border-gray-300 object-cover"
            />
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {request.requestOwner[0].fullname}
              </h3>
              <p className="text-gray-600">
                @{request.requestOwner[0].username}
              </p>
              <p className="text-gray-500">
                Phone: {request.requestOwner[0].phone}
              </p>
            </div>
          </div>
        )}
      </div>
      <Button
        className="w-2/5 mx-auto"
        onClick={handleAcceptRequest}
        disabled={request.status !== "pending" || isAcceptingRequest}
      >
        {isAcceptingRequest ? (
          <>
            <Loader2 className="animate-spin" /> Accepting Request...
          </>
        ) : (
          "Accept Request"
        )}
      </Button>
    </div>
  );
};

export default Request;
