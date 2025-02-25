import React, { useState, useEffect } from "react";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Products } from "./pages/Products";
import { Cart } from "./pages/Cart";
import { Wishlist } from "./pages/Wishlist";
import { Contact } from "./pages/Contact";
import { About } from "./pages/About";
import { ShippingPolicy } from "./pages/ShippingPolicy";
import Loading from "./components/Loading";

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ClerkProvider 
      publishableKey={clerkPubKey!}
      appearance={{
        layout: {
          socialButtonsVariant: "iconButton",
          logoImageUrl: "/images/paramprik swad logo.jpg",
          logoPlacement: "inside",
        },
        elements: {
          card: "shadow-xl mx-auto max-w-md w-full",
          rootBox: "w-full px-4 py-4",
          headerTitle: "text-2xl font-bold text-amber-900",
          headerSubtitle: "text-amber-700",
          socialButtonsIconButton: "border-2 border-amber-200 hover:border-amber-300",
          formButtonPrimary: "bg-amber-500 hover:bg-amber-600",
          formFieldInput: "border-amber-200 focus:border-amber-500",
          footerActionLink: "text-amber-600 hover:text-amber-700"
        }
      }}
    >
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-14">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/shipping" element={<ShippingPolicy />} />
              
              {/* Auth routes */}
              <Route 
                path="/sign-in/*" 
                element={<SignIn routing="path" path="/sign-in" />} 
              />
              <Route 
                path="/sign-up/*" 
                element={<SignUp routing="path" path="/sign-up" />} 
              />

              {/* Protected routes */}
              <Route
                path="/cart"
                element={
                  <>
                    <SignedIn>
                      <Cart />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <>
                    <SignedIn>
                      <Wishlist />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ClerkProvider>
  );
}

export default App;
