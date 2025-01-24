"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Page: React.FC = () => {
  const { requestId } = useParams();
  const [fetchedRequest, setFetchedRequest] = useState<any | null>(null);
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(
          `/api/fetch-request?request=${requestId}`
        );
        setFetchedRequest(response.data.request);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching request:", error);
      }
    };
    fetchRequest();
  }, [requestId]);

  const handleRating = async (star: number) => {
    setRating(star);
    try {
      const response = await axios.post(
        `/api/update-service-ratings?user=${fetchedRequest.mechanic}`,
        { star }
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Thank you for your feedback!",
        });
        setTimeout(() => {
          router.replace("/");
        }, 2000);
      } else {
        toast({
          title: "Failure",
          description: "Failed to update mechanic ratings",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error while rating mechanic: ", error);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (fetchedRequest?.status === "completed") {
    return (
      <div className="max-w-screen-md mx-auto p-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center">Repair Status</h1>
        <p className="text-green-600 text-lg md:text-xl text-center mt-2">
          The repair has been completed successfully!
        </p>
        {session?.user.role === "client" ? (
          <div className="mt-6">
            <h2 className="text-xl md:text-2xl font-semibold text-center">
              Rate Your Mechanic
            </h2>
            <p className="text-gray-600 text-center">
              Please provide your feedback on the service quality.
            </p>
            <div className="flex justify-center gap-2 mt-4 flex-wrap">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  onClick={() => handleRating(star)}
                  className={`w-8 h-8 cursor-pointer ${
                    star <= rating ? "text-yellow-500" : "text-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <p className="text-gray-600 text-center">
              You have completed this service request.
            </p>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="max-w-screen-md mx-auto p-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center">Repair Status</h1>
        <p className="text-yellow-600 text-lg md:text-xl text-center mt-2">
          Your repair is not complete yet. Please check back later.
        </p>
      </div>
    );
  }
};

export default Page;
