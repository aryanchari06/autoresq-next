"use client";

import Request from "@/components/Request";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

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
  const { data: session } = useSession();
  const params = useParams();
  const [request, setRequest] = useState<ServiceRequest | null>(null);

  const fetchRequest = async () => {
    try {
      if (!params?.requestId) return;
      const response = await axios.get(
        `/api/fetch-request?request=${params.requestId}`
      );
      setRequest(response.data.request);
    } catch (error) {
      console.error("Error fetching request:", error);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [params?.requestId]);

  // if (session?.user.role === "client") {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-white text-black">
  //       <div className="p-6 text-center bg-gray-100 rounded-lg shadow-md">
  //         <h1 className="text-3xl font-bold text-gray-800 mb-4">
  //           Access Denied
  //         </h1>
  //         <p className="text-gray-600">You are not authorized to view requests.</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="p-6 bg-white min-h-screen text-black">
      {request ? (
        <div className="rounded-lg bg-gray-50  p-6">
          <Request request={request} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 animate-pulse text-lg">Loading request details...</p>
        </div>
      )}
    </div>
  );
};

export default Page;
