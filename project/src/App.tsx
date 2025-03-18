import React, { useState, useEffect } from "react";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp, useUser, UserButton } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
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
import { AdminOrders } from './pages/AdminOrders';
import { AdminDashboard } from './pages/AdminDashboard';
import AdminLayoutComponent from './AdminLayout'; // Import AdminLayout

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Update admin emails - add your email here
const ADMIN_EMAILS = ['somveerparjapati123456@gmail.com', 'vermajatin4477@gmail.com']; // Add your actual email

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
        <Routes>
          {/* Admin Panel Route - Separate from main layout */}
          <Route
            path="/admin/*"
            element={
              <SignedIn>
                <AdminCheck>
                  <AdminLayoutComponent />
                </AdminCheck>
              </SignedIn>
            }
          />

          {/* Main Website Routes */}
          <Route
            path="/*"
            element={
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
            }
          />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

// Add this new component for admin check
const AdminCheck = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  
  if (!user || !user.emailAddresses.length) {
    return <RedirectToSignIn />;
  }

  const userEmail = user.emailAddresses[0].emailAddress;
  
  if (!ADMIN_EMAILS.includes(userEmail)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl text-red-600">Access Denied</h1>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default App;
