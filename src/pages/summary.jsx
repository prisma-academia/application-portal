// SummaryForm.js
import React from "react";
import { useNavigate } from "react-router-dom";

const SummaryForm = () => {
  const navigate = useNavigate();
  const biodata = JSON.parse(localStorage.getItem("biodata"));
  const education = JSON.parse(localStorage.getItem("education"));

  const handleSubmit = () => {
    // Handle final submission here (e.g., send data to server)
    navigate("/success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-3 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-pink-600 to-pink-700 py-6 px-6">
            <h2 className="text-2xl font-bold text-white">Application Summary</h2>
            <p className="text-pink-100 mt-1">Please review your application details before submission</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Information
                  </h3>
                  
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-slate-500">First Name</p>
                        <p className="text-sm font-medium text-slate-800">{biodata.firstName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Last Name</p>
                        <p className="text-sm font-medium text-slate-800">{biodata.lastName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Email</p>
                        <p className="text-sm font-medium text-slate-800">{biodata.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Phone</p>
                        <p className="text-sm font-medium text-slate-800">{biodata.phone || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Address Information
                  </h3>
                  
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <p className="text-xs text-slate-500">Full Address</p>
                    <p className="text-sm font-medium text-slate-800 mt-1">{biodata.address || "N/A"}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-slate-800 flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                  Educational Background
                </h3>
                
                <div className="space-y-4">
                  {education?.qualifications?.map((edu, index) => (
                    <div key={index} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-slate-800">{edu.qualification}</h4>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                          {edu.startDate} - {edu.endDate}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">
                        <span className="text-xs text-slate-500">Institution: </span>
                        {edu.institution}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-200 mt-8 pt-6 flex justify-between items-center">
              <button 
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              
              <button 
                onClick={handleSubmit} 
                className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors flex items-center"
              >
                Submit Application
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryForm;
