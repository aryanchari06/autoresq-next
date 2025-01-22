"use client";

import React, { useEffect, useState, useRef } from "react";
import ProfileForm from "./ProfileForm";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ProfileFormProps } from "./ProfileForm";
import { UploadButton } from "@/utils/uploadthing";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface UserData {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  phone: string;
  role: "client" | "service";
  enterpriseName?: string;
  enterpriseAddress?: string;
  __v: number;
  avatar: string;
  ratings: number[];
  rating: number;
}

const App: React.FC = () => {
  const { data: session } = useSession();
  const { username } = useParams();
  const { toast } = useToast();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [avatarFallback, setAvatarFallback] = useState("");
  const [isUploadVisible, setIsUploadVisible] = useState(false); // State for controlling upload button visibility
  const uploadButtonRef = useRef<HTMLDivElement | null>(null); // Ref to focus the upload button container

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!username) {
          throw new Error("Username is missing");
        }
        const fetchedUser = await axios.get(
          `/api/fetch-user?username=${username}`
        );
        if (!fetchedUser.data.success) {
          toast({
            title: "Failure",
            description: "Could not find user",
            variant: "destructive",
          });
          throw new Error("Failed to fetch user");
        }

        setUser(fetchedUser.data.data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [username]);

  const updateUserAvatar = async (data: any) => {
    console.log("Uploaded Image: ", data[0]);
    try {
      const updatedUser = await axios.post("/api/update-avatar", {
        userId: user?._id,
        imgUrl: data[0].url,
      });
      toast({
        title: "Success",
        description: updatedUser.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Failed to verify user",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user?.fullname) {
      const fallback = user.fullname
        .split(" ")
        .map((word) => word[0]?.toUpperCase())
        .join("");
      setAvatarFallback(fallback);
    } else {
      setAvatarFallback("US");
    }
  }, [session, user]);

  const handleUpdateAvatarClick = () => {
    setIsUploadVisible(true); // Show the upload button when clicked
    setTimeout(() => {
      uploadButtonRef.current?.focus(); // Focus the upload button container after it's rendered
    }, 0);
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center text-red-600">No user data available</div>
    );
  }

  const userToBePassed: ProfileFormProps = {
    fullname: user.fullname,
    phone: user.phone,
    role: user.role,
    enterpriseName: user.enterpriseName,
    enterpriseAddress: user.enterpriseAddress,
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-center gap-6 mb-8">
        <Avatar className="h-32 w-32">
          <AvatarImage
            src={user.avatar}
            alt="User Avatar"
            className="rounded-lg"
          />
          <AvatarFallback className="bg-gray-300 text-white text-lg font-semibold flex items-center justify-center">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-semibold text-gray-900">
            {user.fullname}
          </h1>
          <p className="text-lg text-gray-600">{user.username}</p>
          {/* //ratings will come here */}
          {user.rating && (
            <div className="flex items-center gap-2 text-gray-800">
              <Star className="text-yellow-500" />
              <p className="text-lg font-semibold">{user.rating}</p>
            </div>
          )}

          {session?.user._id === user._id && (
            <Button
              onClick={handleUpdateAvatarClick}
              className="mt-4 bg-gray-800 text-white hover:bg-gray-900 py-2 px-6 rounded-md shadow-sm transition duration-300"
            >
              Update Avatar
            </Button>
          )}
        </div>
      </div>
      <ProfileForm user={userToBePassed} />

      {session?.user._id === user._id && isUploadVisible && (
        <div ref={uploadButtonRef} tabIndex={-1} className="flex items-center justify-center">
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              updateUserAvatar(res);
              toast({
                title: "Upload Completed",
                description: "Your avatar has been updated.",
                variant: "destructive",
              });
            }}
            onUploadError={(error: Error) => {
              toast({
                title: "Upload Error",
                description: error.message,
                variant: "destructive",
              });
            }}
            className="w-3/5 py-2 px-4 mt-6 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-md shadow-sm transition duration-300"
          />
        </div>
      )}
    </div>
  );
};

export default App;
