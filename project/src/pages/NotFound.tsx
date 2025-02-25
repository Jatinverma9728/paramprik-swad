import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-amber-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-amber-800 mb-4">Page Not Found</h2>
        <p className="text-amber-700 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
