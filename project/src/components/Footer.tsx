import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative bg-black">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source
            src="/images/2f74fc9020624fb09059c766e538177a.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 py-12">
        <div className="container mx-auto px-4">
          {/* Logo Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-600 mb-2">Paramprik Swad</h2>
            <p className="text-xl text-white mb-4">Traditional Indian Flavors</p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mb-12">
            {/* About */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl text-amber-600 mb-4">About</h3>
              <p className="text-white">
                Experience authentic Indian spices and groceries delivered to your doorstep.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl text-amber-600 mb-4">Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/products" className="text-white hover:text-amber-400 transition-colors">
                    Our Products
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-white hover:text-amber-400">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-white hover:text-amber-400">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl text-amber-600 mb-4">Contact</h3>
              <ul className="space-y-3 text-white">
                <li>swadparamprik@gmail.com</li>
                <li>(+19) 81990845** , 93069641**</li>
                <li>MC colony, Bhiwani Haryana, India</li>
              </ul>
            </div>

            {/* Social */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl text-amber-600 mb-4">Follow Us</h3>
              <div className="flex justify-center md:justify-start space-x-6">
                <a href="#" className="text-white hover:text-amber-400">
                  <Facebook className="h-7 w-7" />
                </a>
                <a href="#" className="text-white hover:text-amber-400">
                  <Instagram className="h-7 w-7" />
                </a>
                <a href="#" className="text-white hover:text-amber-400">
                  <Twitter className="h-7 w-7" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="border-t border-white/20 pt-6">
            <p className="text-white text-center text-sm">
              © {new Date().getFullYear()} Paramprik Swad. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
