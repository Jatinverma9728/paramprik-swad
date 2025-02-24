import React from "react";
import { SignIn } from "@clerk/clerk-react";

export const Login = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-amber-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: "bg-amber-500 hover:bg-amber-600",
              card: "bg-white",
              headerTitle: "text-2xl font-bold text-amber-900 mb-6",
              socialButtonsBlockButton: "border border-amber-200",
              formField: "border-amber-200",
            }
          }}
        />
      </div>
    </div>
  );
};
