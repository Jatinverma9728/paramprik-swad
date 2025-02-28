import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, ShoppingCart, Heart, User, ShieldCheck } from "lucide-react";
import { useStore } from "../store/useStore";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";

const ADMIN_EMAILS = ["admin@example.com"]; // Add your admin emails here

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart, wishlist } = useStore();
  const { user } = useUser();
  const isAdmin = user?.emailAddresses[0]?.emailAddress && 
    ADMIN_EMAILS.includes(user.emailAddresses[0].emailAddress);

  return (
    <nav className="bg-amber-50 fixed w-full z-50 top-0 left-0 border-b border-amber-100 h-14">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-amber-800">
              Paramprik Swad
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-amber-900 hover:text-amber-700 px-3 py-2"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-amber-900 hover:text-amber-700 px-3 py-2"
              >
                Products
              </Link>
              <Link
                to="/about"
                className="text-amber-900 hover:text-amber-700 px-3 py-2"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-amber-900 hover:text-amber-700 px-3 py-2"
              >
                Contact
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-amber-600 hover:text-amber-700 px-3 py-2 rounded-md flex items-center gap-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin Panel
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link to="/cart" className="relative p-1.5">
              <ShoppingCart className="h-6 w-6 text-amber-900" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {cart.length}
                </span>
              )}
            </Link>
            <Link to="/wishlist" className="relative p-1.5">
              <Heart className="h-6 w-6 text-amber-900" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonBox: "hover:bg-amber-100"
                  }
                }}
              />
            </SignedIn>
            <SignedOut>
              <Link
                to="/sign-in"
                className="p-2 hover:bg-amber-100 rounded-full transition-colors"
              >
                <User className="h-6 w-6 text-amber-900" />
              </Link>
            </SignedOut>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5"
            >
              <Menu className="h-5 w-5 text-amber-900" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div 
          className={`md:hidden absolute left-0 right-0 bg-amber-50 border-b border-amber-100 shadow-lg ${
            isMenuOpen ? "block" : "hidden"
          }`}
          style={{ top: '3.5rem' }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="text-amber-900 hover:text-amber-700 block px-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-amber-900 hover:text-amber-700 block px-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/about"
              className="text-amber-900 hover:text-amber-700 block px-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-amber-900 hover:text-amber-700 block px-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-amber-600 hover:text-amber-700 px-3 py-2 rounded-md flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShieldCheck className="h-4 w-4" />
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
