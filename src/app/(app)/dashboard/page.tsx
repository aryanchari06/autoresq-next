"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const Dashboard = () => {
  const { data: session } = useSession();
  const user = session?.user;

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-black mb-4">
          Welcome to AutoResQ
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-lg sm:max-w-4xl mb-6">
          Join AutoResQ to connect with skilled mechanics and reliable clients
          near you. Experience hassle-free assistance and professional services
          wherever you are.
        </p>
        <Link href="/sign-in">
          <Button className="px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base text-white bg-black hover:bg-gray-800">
            Sign In Now
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 min-h-[80vh] bg-gray-50 text-center">
      <h1 className="text-2xl sm:text-4xl font-bold text-black mb-4 sm:mb-6">
        Hello, {user?.username}!
      </h1>
      {user?.role === "client" ? (
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <p className="text-base sm:text-xl text-gray-700 max-w-md sm:max-w-xl">
            Welcome back! AutoResQ is here to connect you with trusted mechanics
            nearby. Find solutions to all your vehicle issues and get back on
            the road with confidence.
          </p>
          <Link href="/make-request">
            <Button className="px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base text-white bg-black hover:bg-gray-800">
              Request a mechanic
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <p className="text-base sm:text-xl text-gray-700 max-w-md sm:max-w-xl">
            Welcome back! AutoResQ helps you find new customers and grow your
            business. Provide top-notch service and build lasting client
            relationships.
          </p>
          <Link href="/view-customers">
            <Button className="px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base text-white bg-black hover:bg-gray-800">
              View Nearby Customers
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
