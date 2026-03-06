import React from "react";
import { WifiOff as WifiOffIcon, Refresh as RefreshIcon } from "@mui/icons-material";

const NetworkError = ({ 
  message = "Unable to connect to the server. Please check your internet connection.", 
  onRetry,
  fullPage = false
}) => {
  const content = (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg mx-auto">
      <div className="flex flex-col items-center justify-center gap-4">
        <WifiOffIcon style={{ fontSize: 60, color: '#b91c1c' }} />
        
        <h3 className="text-xl font-semibold text-gray-800">
          Connection Error
        </h3>
        
        <p className="text-gray-600 text-center">
          {message}
        </p>
        
        <button
          className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
          onClick={onRetry || (() => window.location.reload())}
        >
          <RefreshIcon style={{ fontSize: 18, marginRight: 8 }} />
          Try Again
        </button>
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen bg-surface p-4 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default NetworkError; 