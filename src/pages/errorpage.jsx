import React from "react";
import { useNavigate, useRouteError, isRouteErrorResponse } from "react-router-dom";
import { Warning as WarningIcon, Home as HomeIcon, Refresh as RefreshIcon } from "@mui/icons-material";

const ErrorPage = () => {
  const navigate = useNavigate();
  const error = useRouteError();
  
  let errorMessage = "An unexpected error has occurred.";
  let errorStatus = "";
  
  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || errorMessage;
    if (error.data?.message) {
      errorMessage = error.data.message;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen bg-surface p-4 sm:p-8 flex items-center justify-center">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <WarningIcon style={{ fontSize: 100, color: '#f59e0b', marginBottom: '1rem' }} />
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {errorStatus ? `Error ${errorStatus}` : "Something Went Wrong"}
          </h1>
          
          <div className="bg-red-100 text-red-800 p-4 rounded-md mb-8 w-full max-w-lg">
            <p className="text-sm md:text-base">
              {errorMessage}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => navigate("/")}
              className="bg-primary hover:bg-red-700 text-white px-6 py-3 rounded-md text-sm font-medium flex items-center"
            >
              <HomeIcon style={{ fontSize: 18, marginRight: 8 }} />
              Go to Homepage
            </button>
            
            <button 
              onClick={() => window.location.reload()}
              className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-md text-sm font-medium flex items-center"
            >
              <RefreshIcon style={{ fontSize: 18, marginRight: 8 }} />
              Try Again
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

export default ErrorPage; 