"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";

interface UserData {
  avatar: string;
  email: string;
  fullname: string;
  phone: string;
  rating: number | null;
  role: "client" | "service";
  username: string;
}

interface Session {
  user: {
    username: string;
  };
}

interface UserProfileProps {
  userData: UserData;
  session: Session;
}

const UserProfile: React.FC<UserProfileProps> = ({ userData, session }) => {
  const { avatar, email, fullname, phone, rating, role, username } = userData;

  const canEdit = session?.user?.username === username;

  const [avatarFallback, setAvatarFallback] = useState("");

  useEffect(() => {
    if (fullname) {
      const fallback = fullname
        .split(" ")
        .map((word) => word[0]?.toUpperCase())
        .join("");
      setAvatarFallback(fallback);
    } else {
      setAvatarFallback("US");
    }
  }, [session, fullname]);

  return (
    <div className="max-w-lg mx-auto p-6 space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-center">
          <Avatar className="h-40 w-40">
            {/* <AvatarImage src='https://media.istockphoto.com/id/1005372264/vector/panda-logo.jpg?s=612x612&w=0&k=20&c=smibhvE0ire2vSZa4k31WYn8_B53pThHmMCZmt3BVuw=' alt="User Avatar" /> */}
            <AvatarImage src={avatar} alt="User Avatar" className="rounded-none" />
            <AvatarFallback className="bg-gray-200">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          </div>
          <div className="flex items-center space-x-4">
            {" "}
            <div className="flex flex-col items-center justify-center w-full">
              <CardTitle className="text-lg text-center font-semibold">
                {fullname}
              </CardTitle>
              <p className="text-sm text-gray-500">@{username}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Email:</span> {email}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {phone}
            </p>
            <p>
              <span className="font-medium">Role:</span>{" "}
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </p>
            <p>
              <span className="font-medium">Rating:</span>{" "}
              {rating !== null ? rating.toFixed(1) : "No ratings yet"}
            </p>
          </div>
        </CardContent>
      </Card>

      {canEdit && (
        <div className="text-right">
          <Button
            onClick={() => {
              console.log("Edit Profile");
            }}
          >
            Edit Profile
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
