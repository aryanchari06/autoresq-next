"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [avatarFallback, setAvatarFallback] = useState("");

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
  }, [session, user?.fullname]);

  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div>
            <Link href="/" className="text-lg font-bold text-black">
              AutoResQ
            </Link>
          </div>

          {/* Right Section */}
          {session ? (
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 outline-none px-2">
                    <Avatar>
                      <AvatarImage src={user?.avatar} alt="User Avatar" />
                      <AvatarFallback className="bg-gray-200">
                        {avatarFallback}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{user?.username}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{user?.username}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href={`/profile/${user?.username}`}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <button onClick={() => signOut({ callbackUrl: "/" })}>
                      Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 py-1 px-3 border rounded-md hover:bg-gray-100">
                    Sign Up <ChevronDown />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href="/c/sign-up">Sign Up as a Client</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/s/sign-up">Sign Up as a Mechanic</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button className="px-4 py-2">
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Responsive Menu - Hidden on Larger Screens */}
      <div className="block sm:hidden bg-gray-100 py-2">
        {session ? (
          <div className="text-center">
            <Link href={`/profile/${user?.username}`} className="block py-2">
              Profile
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="block py-2 text-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Link href="/c/sign-up" className="block py-2">
              Sign Up as a Client
            </Link>
            <Link href="/s/sign-up" className="block py-2">
              Sign Up as a Mechanic
            </Link>
            <Link href="/sign-in" className="block py-2">
              Sign In
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
