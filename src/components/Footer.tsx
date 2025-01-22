"use client";

import React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react"; // Icons for social media links
import { Button } from "./ui/button";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-black py-8">
      <div className="h-[0.8px] bg-black mx-[4%] my-10"></div>
      <div className="container mx-auto px-12">
        <div className="flex justify-between items-center">
          {/* Left Section */}
          <div className="flex gap-2 items-center">
            <Image
              src="/logo-white.svg"
              alt="logo.svg"
              height={80}
              width={80}
              className="  p-2 text-black"
            />

            <div>
              <h3 className="text-xl font-semibold">AutoResQ</h3>
              <p className="text-sm text-gray-600 mt-2">
                Helping drivers find mechanics nearby.
              </p>
            </div>
          </div>

          {/* Center Section - Links */}
          <div className="flex gap-8">
            <div>
              <h4 className="font-semibold mb-2">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/" className="hover:text-black">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-black">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-black">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold mb-2">Follow Us</h4>
              <div className="flex gap-4">
                <Link
                  href="https://github.com"
                  target="_blank"
                  className="text-gray-600 hover:text-black"
                >
                  <Github size={20} />
                </Link>
                <Link
                  href="https://twitter.com"
                  target="_blank"
                  className="text-gray-600 hover:text-black"
                >
                  <Twitter size={20} />
                </Link>
                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  className="text-gray-600 hover:text-black"
                >
                  <Linkedin size={20} />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Section - Sign Up Button */}
          {/* <div>
            <Button
              variant="outline"
              className="text-black border-black hover:bg-black hover:text-white"
            >
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div> */}
        </div>

        <div className="mt-8 border-t border-gray-300 pt-4 text-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} AutoResQ. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
