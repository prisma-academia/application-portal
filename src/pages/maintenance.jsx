import React from "react";
import { Build as BuildIcon, Refresh as RefreshIcon } from "@mui/icons-material";

const Maintenance = ({
  estimatedTime = "a few hours",
  message = "We are currently performing scheduled maintenance to improve your experience."
}) => {
  return (
    <div className="min-h-screen bg-surface p-4 sm:p-8 flex items-center justify-center">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <BuildIcon style={{ fontSize: 100, color: '#f59e0b', marginBottom: '1rem' }} />
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            System Maintenance
          </h1>
          
          <div className="bg-blue-100 text-blue-800 p-4 rounded-md mb-8 w-full max-w-lg">
            <p className="text-sm md:text-base mb-2">
              {message}
            </p>
            <p className="text-sm md:text-base">
              We expect to be back online in {estimatedTime}. Thank you for your patience.
            </p>
          </div>
          
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-red-700 text-white px-6 py-3 rounded-md text-sm font-medium flex items-center"
          >
            <RefreshIcon style={{ fontSize: 18, marginRight: 8 }} />
            Check Again
          </button>

          <p className="mt-8 text-gray-500 text-sm">
            If you need immediate assistance, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Maintenance; 