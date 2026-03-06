import React, { useState, useEffect } from "react";
import { WifiOff as WifiOffIcon, Refresh as RefreshIcon, Close as CloseIcon } from "@mui/icons-material";

// Global state to allow showing the error modal from anywhere in the app
let showErrorFeedbackFn = null;
let hideErrorFeedbackFn = null;

// Function to trigger error modal from anywhere
export const showNetworkError = (message, onRetry) => {
  if (showErrorFeedbackFn) {
    showErrorFeedbackFn(message, onRetry);
    return true;
  }
  return false;
};

// Function to hide error modal from anywhere
export const hideNetworkError = () => {
  if (hideErrorFeedbackFn) {
    hideErrorFeedbackFn();
    return true;
  }
  return false;
};

const ErrorFeedback = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("Unable to connect to the server. Please check your internet connection.");
  const [onRetry, setOnRetry] = useState(null);

  // Setup the global reference to the functions
  useEffect(() => {
    showErrorFeedbackFn = (msg, retryFn) => {
      setMessage(msg || "Unable to connect to the server. Please check your internet connection.");
      setOnRetry(() => retryFn || (() => window.location.reload()));
      setVisible(true);
    };
    
    hideErrorFeedbackFn = () => {
      setVisible(false);
    };
    
    // Cleanup when component unmounts
    return () => {
      showErrorFeedbackFn = null;
      hideErrorFeedbackFn = null;
    };
  }, []);

  const handleDismiss = () => {
    setVisible(false);
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto relative">
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="Dismiss"
        >
          <CloseIcon style={{ fontSize: 20 }} />
        </button>
        
        <div className="flex flex-col items-center justify-center gap-4 pt-2">
          <WifiOffIcon style={{ fontSize: 60, color: '#b91c1c' }} />
          
          <h3 className="text-xl font-semibold text-gray-800">
            Connection Error
          </h3>
          
          <p className="text-gray-600 text-center">
            {message}
          </p>
          
          <div className="flex gap-3 w-full justify-center mt-2">
            <button
              className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              onClick={handleRetry}
            >
              <RefreshIcon style={{ fontSize: 18, marginRight: 8 }} />
              Try Again
            </button>
            
            <button
              className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium"
              onClick={handleDismiss}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorFeedback; 