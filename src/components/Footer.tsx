"use client";

import React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-black py-8">
      <div className="h-[0.8px] bg-black mx-[4%] my-10"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8">
          {/* Left Section */}
          <div className="flex gap-4 items-center text-left">
            <Image
              src="/logo-white.svg"
              alt="logo.svg"
              height={80}
              width={80}
              className="p-2"
            />
            <div>
              <h3 className="text-xl font-semibold text-left">AutoResQ</h3>
              <p className="text-sm text-gray-600 mt-2 text-left">
                Helping drivers find mechanics nearby.
              </p>
            </div>
          </div>

          {/* Center Section - Links */}
          <div className="flex flex-col sm:flex-row gap-8 text-center lg:text-left">
            <div>
              <h4 className="font-semibold mb-2">Company</h4>
              <ul className="flex flex-col sm:flex-row sm:gap-6 text-gray-600">
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

            <div>
              <h4 className="font-semibold mb-2">Follow Us</h4>
              <div className="flex justify-center lg:justify-start gap-4">
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
        </div>

        {/* Bottom Section */}
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
