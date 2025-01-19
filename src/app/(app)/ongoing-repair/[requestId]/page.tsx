"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { Wrench, Car, Clock } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const Page = () => {
  const { requestId } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [fetchedRequest, setFetchedRequest] = useState<any | null>(null);
  const socketServerUrl = process.env.NEXT_PUBLIC_SOCKETSERVER_URL;

  // useEffect(()=> {

  //   const newSocket = io(socketServerUrl);
  //   setSocket(newSocket);
  // }, [])
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(
          `/api/fetch-request?request=${requestId}`
        );
        setFetchedRequest(response.data.request);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching request:", error);
      }
    };
    fetchRequest();
  }, [isComplete]);

  useEffect(() => {
    if (fetchedRequest?.status === "completed")
      router.replace(`/repair-success/${requestId}`);
  }, [fetchedRequest]);

  const updateTaskCompletion = async () => {
    const response = await axios.post(`/api/update-task-completion`, {
      requestId,
    });

    if (response.data.success) {
      router.replace(`/repair-success/${requestId}`);
      setIsComplete(true);
    } else {
      toast({
        title: "Failure",
        description: "Failed to update repair complettion",
        variant: "destructive",
      });
    }
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700 px-4">
        <p className="text-lg font-medium">
          You are not logged in. Please sign in to continue.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 px-4">
      {session.user.role === "client" && (
        <div className="flex flex-col items-center gap-4 p-6 rounded-md text-center max-w-md w-full">
          <Clock className="w-20 h-20 text-gray-500" />
          <h1 className="text-2xl font-bold text-gray-800">
            Your vehicle is being repaired
          </h1>
          <p className="text-gray-600">
            Please wait while our mechanics complete the service.
          </p>
        </div>
      )}
      {session.user.role === "service" && (
        <div className="flex flex-col items-center gap-4 p-6  rounded-md text-center max-w-md w-full">
          <Wrench className="w-20 h-20 text-gray-500" />
          <h1 className="text-2xl font-bold text-gray-800">
            You are providing repair services
          </h1>
          <p className="text-gray-600">
            Your expertise makes a difference. Ensure the client’s vehicle is
            repaired efficiently and professionally.
          </p>
          <Button
            onClick={updateTaskCompletion}
            className="mt-4 bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-md"
          >
            Task Completed
          </Button>
        </div>
      )}
    </div>
  );
};

export default Page;
