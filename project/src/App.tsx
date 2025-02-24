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
    <ClerkProvider publishableKey={clerkPubKey!}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-16">
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
