import React from "react";

const Loader = ({ children, size = "md", text = "Loading..." }) => {
  // Size variants
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Outer spinner */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
        
        {/* Gradient spinner */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-600 border-r-pink-400 animate-spin"></div>
        
        {/* Inner spinner (slower, opposite direction) */}
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-pink-300 border-l-pink-300 animate-spin-slow"></div>
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {children || (
            <div className="flex flex-col items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-pink-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 10V3L4 14h7v7l9-11h-7z" 
                />
              </svg>
            </div>
          )}
        </div>
      </div>
      
      {/* Loading text */}
      {!children && (
        <div className="mt-4 text-sm font-medium text-slate-700">
          {text}
        </div>
      )}
      
      {/* Custom animation for opposite direction spin */}
      <style jsx="true">{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;
