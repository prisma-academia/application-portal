import React from "react";
import MyButton from "./button";

const InformationModal = ({ isOpen, onClose, children, title = "Information" }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-900 bg-opacity-75 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl relative w-11/12 max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 py-4 px-6">
          <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>
        
        <div className="p-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
            <div className="flex">
              <div className="flex-shrink-0 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-sm text-slate-700">
                {children}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <MyButton 
              onClick={onClose} 
              text="I Understand" 
              variant="filled"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
              iconPosition="right"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationModal;
