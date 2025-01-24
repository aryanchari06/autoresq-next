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

  // console.log(session?.user)
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
    <div className="w-full flex items-center justify-between px-6 py-4">
      {" "}
      {/* Increased padding */}
      <div>
        <Link href="/" className="text-lg font-semibold">
          AutoResQ
        </Link>{" "}
        {/* Enhanced text styling */}
      </div>
      {session ? (
        <div className="flex items-center space-x-4">
          {" "}
          {/* Added spacing between dropdown and avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 outline-none px-2">
                <Avatar>
                  {/* <AvatarImage src='https://media.istockphoto.com/id/1005372264/vector/panda-logo.jpg?s=612x612&w=0&k=20&c=smibhvE0ire2vSZa4k31WYn8_B53pThHmMCZmt3BVuw=' alt="User Avatar" /> */}
                  <AvatarImage src={user?.avatar} alt="User Avatar" />
                  <AvatarFallback className="bg-gray-200">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
                {user?.username}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{user?.username}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Link href={`/profile/${user?.username}`}>Profile</Link></DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <button onClick={() => signOut({ callbackUrl: "/" })}>
                  Logout
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex gap-4 items-center">
          {" "}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 py-1 px-3 border rounded-md hover:bg-gray-100">
                {" "}
                {/* Improved button styling */}
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
          <Button className="px-4 py-2"><Link href='/sign-in'>Sign In</Link></Button>{" "}
          {/* Adjusted button padding */}
        </div>
      )}
    </div>
  );
};

export default Navbar;
