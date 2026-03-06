import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyButton from "../components/button";
import Loader from "../components/loader";
import useFormStore from "../store/form";
import { useAuthStore } from "../store/auth";
import configs from "../config";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import AlertModal from "../components/AlertModal";

function PreviewPage() {
  const navigate = useNavigate();
  const form = useFormStore((state) => state.form);
  const token = useAuthStore((state) => state.token);

  const { data: programmes = [] } = useQuery({
    queryKey: ["programmes"],
    queryFn: async () => {
      const res = await fetch(`${configs.baseUrl}/api/v1/programmes`, { headers: { "Content-Type": "application/json" } });
      if (!res.ok) return [];
      const json = await res.json();
      return json.ok && Array.isArray(json.data) ? json.data : [];
    },
  });
  const programmeName = typeof form?.programme === "object" && form?.programme?.name
    ? form.programme.name
    : (programmes.find((p) => p._id === form?.programme)?.name ?? form?.programme ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    message: "",
    type: "error"
  });

  const queryClient = useQueryClient();

  const submitForm = async (credentials) => {
    const response = await fetch(`${configs.baseUrl}/api/v1/application`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const result = await response.json();
    if (result.ok) {
      return result.data;
    }
    throw new Error(result.message);
  };

  const { data, mutate, isError, error, isPending } = useMutation({
    mutationFn: submitForm,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["application"] }),
  });

  const handleButtonClick = () => {
    setLoading(true);
    mutate(form);
  };

  useEffect(() => {
    if (data) {
      setMessage("Redirecting...");
      window.location.href = data.authorizationUrl;
    }
    if (isError && error) {
      let errorMessage;
      try {
        errorMessage = JSON.parse(error.message)?.message || error.message;
      } catch (e) {
        errorMessage = error.message;
      }
      setAlertModal({
        isOpen: true,
        message: errorMessage,
        type: "error"
      });
      setLoading(false);
    }
  }, [data, isError, error, isPending]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-3 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center">
            <Loader />
            <p className="mt-4 text-slate-600">{message}</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-pink-600 to-pink-700 py-6 px-6">
              <h2 className="text-2xl font-bold text-white">Application Preview</h2>
              <p className="text-pink-100 mt-1">Please review your information before submitting</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Personal Information
                    </h3>
                    
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                      <div className="mb-4 flex justify-center">
                        {form.photo ? (
                          <img 
                            src={form.photo} 
                            alt="Applicant" 
                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-full bg-slate-200 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-y-3">
                        <div>
                          <p className="text-xs text-slate-500">Programme</p>
                          <p className="text-sm font-medium text-slate-800">{programmeName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Full Name</p>
                          <p className="text-sm font-medium text-slate-800">{`${form.firstName || ''} ${form.otherName || ''} ${form.lastName || ''}`}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Date of Birth</p>
                          <p className="text-sm font-medium text-slate-800">{form.dob || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Gender</p>
                          <p className="text-sm font-medium text-slate-800">{form.gender || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Religion</p>
                          <p className="text-sm font-medium text-slate-800">{form.religion || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">State of Origin</p>
                          <p className="text-sm font-medium text-slate-800">{form.stateOfOrigin || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">LGA of Origin</p>
                          <p className="text-sm font-medium text-slate-800">{form.lgaOfOrigin || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">NIN</p>
                          <p className="text-sm font-medium text-slate-800">{form.nin || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Contact Information
                    </h3>
                    
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                      <div className="grid grid-cols-2 gap-y-3">
                        <div>
                          <p className="text-xs text-slate-500">Phone Number</p>
                          <p className="text-sm font-medium text-slate-800">{form.phoneNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Email</p>
                          <p className="text-sm font-medium text-slate-800">{form.email || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">State of Residence</p>
                          <p className="text-sm font-medium text-slate-800">{form.stateOfResidence || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">LGA of Residence</p>
                          <p className="text-sm font-medium text-slate-800">{form.lgaOfResidence || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-xs text-slate-500">Address</p>
                        <p className="text-sm font-medium text-slate-800">{form.address || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Examination Information
                    </h3>
                    
                    <div className="space-y-4">
                      {form.examinations?.map((exam, index) => (
                        <div key={index} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                              {exam.examType}
                            </span>
                            <span className="text-xs text-slate-500">{exam.examYear}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <div>
                              <p className="text-xs text-slate-500">School</p>
                              <p className="font-medium text-slate-800">{exam.school}</p>
                            </div>
                            {exam.examNumber && (
                              <div>
                                <p className="text-xs text-slate-500">Exam Number</p>
                                <p className="font-medium text-slate-800">{exam.examNumber}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                      </svg>
                      O-Level Results
                    </h3>
                    
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                      <div className="grid grid-cols-2 gap-4">
                        {form.result?.map((result, index) => (
                          <div 
                            key={index} 
                            className="border border-slate-200 rounded-md p-2 flex justify-between items-center"
                          >
                            <span className="text-sm text-slate-800">{result.subject}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              ['A1', 'B2', 'B3'].includes(result.result) 
                                ? 'bg-green-100 text-green-800' 
                                : ['C4', 'C5', 'C6'].includes(result.result) 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {result.result}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
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
                  onClick={handleButtonClick}
                  className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors flex items-center"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Submit Application"}
                  {!loading && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <AlertModal 
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({...alertModal, isOpen: false})}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>
  );
}

export default PreviewPage;
