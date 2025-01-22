"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Dashboard from "./dashboard/Page";

export default function Home() {
  const { data: session } = useSession();
  console.log(session?.user)
  const [user, setUser] = useState()

  return (
    <div className="min-h-screen p-4 bg-gray-50 font-[family-name:var(--font-geist-sans)]">
      <Dashboard />
    </div>
  );
}
