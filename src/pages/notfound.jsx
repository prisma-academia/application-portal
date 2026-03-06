import React from "react";
import { useNavigate } from "react-router-dom";
import { Error as ErrorIcon, Home as HomeIcon } from "@mui/icons-material";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface p-4 sm:p-8 flex items-center justify-center">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <ErrorIcon style={{ fontSize: 100, color: '#b91c1c', marginBottom: '1rem' }} />
          
          <h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-4">
            404
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
            Page Not Found
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-lg">
            The page you are looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => navigate("/")}
              className="bg-primary hover:bg-red-700 text-white px-6 py-3 rounded-md text-sm font-medium flex items-center"
            >
              <HomeIcon style={{ fontSize: 18, marginRight: 8 }} />
              Go to Homepage
            </button>
            
            <button 
              onClick={() => navigate(-1)}
              className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-3 rounded-md text-sm font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 