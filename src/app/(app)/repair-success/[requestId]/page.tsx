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
  console.log(requestId);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(
          `/api/fetch-request?request=${requestId}`
        );
        setFetchedRequest(response.data.request);
        setIsLoading(false);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching request:", error);
      }
    };
    fetchRequest();
  }, [requestId]);

  const handleRating = async (star: number) => {
    setRating(star);
    console.log(`Rated ${star} star(s)`);
    const response = await axios.post(
      `/api/update-service-ratings?user=${fetchedRequest.mechanic}`,
      {
        star,
      }
    );

    if (response.data.success) {
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
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (fetchedRequest?.status === "completed") {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">Repair Status</h1>
        <p className="text-green-600">
          The repair has been completed successfully!
        </p>
        {session?.user.role === "client" ? (
          <>
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Rate Your Mechanic</h2>
              <p className="text-gray-600">
                Please provide your feedback on the service quality.
              </p>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => handleRating(star)}
                    className={`w-6 h-6 cursor-pointer ${
                      star <= rating ? "text-yellow-500" : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="mt-4">
            <p className="text-gray-600">
              You have completed this service request.
            </p>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">Repair Status</h1>
        <p className="text-yellow-600">
          Your repair is not complete yet. Please check back later.
        </p>
      </div>
    );
  }
};

export default Page;
