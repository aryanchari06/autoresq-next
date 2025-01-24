"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { Wrench, Clock, Loader2 } from "lucide-react";
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
  const [role, setRole] = useState<string | undefined>(undefined);
  const socketServerUrl = process.env.NEXT_PUBLIC_SOCKETSERVER_URL;
  const [isSubmittingCompleteRepair, setIsSubmittingCompleteRepair] =
    useState(false);

  const room = requestId as string;

  // Initialize Role Once Session is Available
  useEffect(() => {
    if (session?.user.role) {
      setRole(session.user.role);
    }
  }, [session]);

  // Socket Initialization
  useEffect(() => {
    if (!room || !role) {
      console.log("No room initialized", room, role);
      return;
    }

    if (!socketServerUrl) {
      console.error(
        "Please set the NEXT_PUBLIC_SOCKETSERVER_URL environment variable."
      );
      return;
    }

    const newSocket = io(socketServerUrl);
    setSocket(newSocket);
    newSocket.emit("init", { room, role });

    newSocket.on("complete-task", (data) => {
      console.log("Task completed:", data);
      toast({
        title: "Success",
        description: "Repair is complete!",
      });

      setTimeout(() => {
        router.replace(`/repair-success/${requestId}`);
      }, 2000);
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [room, role, socketServerUrl]);

  useEffect(() => {
    console.log("Socket state updated:", socket);
  }, [socket]);

  // Fetch Request
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
  }, [isComplete, requestId]);

  useEffect(() => {
    if (fetchedRequest?.status === "completed") {
      router.replace(`/repair-success/${requestId}`);
    }
  }, [fetchedRequest, isComplete, router, requestId]);

  const updateTaskCompletion = async () => {
    try {
      setIsSubmittingCompleteRepair(true);
      const response = await axios.post(`/api/update-task-completion`, {
        requestId,
      });

      if (response.data.success && socket) {
        socket.emit("complete-task", { message: "Complete task", room });
        console.log("Emitting the complete task");
        router.replace(`/repair-success/${requestId}`);

        setIsComplete(true);
      } else {
        toast({
          title: "Failure",
          description: "Failed to update repair completion",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error while completing repair: ", error);
    } finally {
      setIsSubmittingCompleteRepair(false);
    }
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700 px-4">
        <p className="text-lg font-medium text-center">
          You are not logged in. Please sign in to continue.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 px-4">
      {role === "client" && (
        <div className="flex flex-col items-center gap-4 p-6 rounded-md text-center max-w-md w-full bg-white shadow-sm">
          <Clock className="w-16 h-16 text-gray-500 sm:w-20 sm:h-20" />
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Your vehicle is being repaired
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Please wait while our mechanics complete the service.
          </p>
        </div>
      )}
      {role === "service" && (
        <div className="flex flex-col items-center gap-4 p-6 rounded-md text-center max-w-md w-full bg-white shadow-sm">
          <Wrench className="w-16 h-16 text-gray-500 sm:w-20 sm:h-20" />
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
            You are providing repair services
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Your expertise makes a difference. Ensure the client’s vehicle is
            repaired efficiently and professionally.
          </p>
          <Button
            onClick={updateTaskCompletion}
            className="mt-4 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-md"
            disabled={isSubmittingCompleteRepair}
          >
            {isSubmittingCompleteRepair ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                Please wait...
              </div>
            ) : (
              "Complete Repair"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Page;
