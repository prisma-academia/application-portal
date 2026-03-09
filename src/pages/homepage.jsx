import { useState } from "react";
import StartApplication from "../components/startapplication";
import CountdownTimer from "../components/countdowntimer";
import ProgramsSection from "../components/programsections";
import ScrollingInfo from "../components/scrollinginfo";
import InformationModal from "../components/informationmodal";
import { useAuthStore } from "../store/auth";
import configs from "../config";
import PaymentApplication from "../components/paymentapplication";
import { useQuery } from "@tanstack/react-query";
import Loader from "../components/loader";
import { useNavigate } from "react-router-dom";
import AlertModal from "../components/AlertModal";
import useNetworkErrorHandler from "../hooks/useNetworkErrorHandler";

const ApplicationPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(
    localStorage.getItem("modalInfo") ? false : true
  );
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    message: "",
    type: "error"
  });
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const { handleFetchResponse, handleFetchError } = useNetworkErrorHandler();

  const getFormStatus = async () => {
    try {
      const params = new URLSearchParams();
      if (user?.id) params.set("id", user.id);
      if (user?.email) params.set("email", user.email);
      const query = params.toString();
      const url = `${configs.baseUrl}/api/v1/application/single-form${query ? `?${query}` : ""}`;
      const response = await fetch(
        url,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle network errors with the global handler
      if (handleFetchResponse(response, getFormStatus)) {
        return null;
      }

      if (response.status === 401) {
        navigate("/logout");
        return null;
      }

      const result = await response.json();
      if (result.ok) {
        return result.data;
      }
      
      // Handle API errors
      handleFetchError(new Error(result.message), getFormStatus);
      return null;
    } catch (error) {
      // Handle fetch errors
      handleFetchError(error, getFormStatus);
      return null;
    }
  };
  
  const {
    data: form,
    isLoading: formLoading,
    error: formError,
  } = useQuery({
    queryKey: ["form"],
    refetchIntervalInBackground: true,
    refetchInterval: 5000,
    queryFn: getFormStatus,
  });

  const getSession = async () => {
    try {
      const response = await fetch(`${configs.baseUrl}/api/v1/sessions/active`, {
        method: "GET",
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      // Handle network errors
      if (handleFetchResponse(response, getSession)) {
        return null;
      }

      if (response.status === 401) {
        navigate("/logout");
        return null;
      }

      const result = await response.json();
      if (result.ok) {
        return result.data;
      }
      
      // Handle API errors
      handleFetchError(new Error(result.message), getSession);
      return null;
    } catch (error) {
      // Handle fetch errors
      handleFetchError(error, getSession);
      return null;
    }
  };
  
  const {
    data: session,
    isLoading: sessionLoading,
    error: sessionError,
  } = useQuery({
    queryKey: ["session"],
    queryFn: getSession,
  });

  const getProgrammes = async () => {
    try {
      const response = await fetch(`${configs.baseUrl}/api/v1/programmes`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) return null;
      const result = await response.json();
      if (result.ok && Array.isArray(result.data)) return result.data;
      return [];
    } catch {
      return [];
    }
  };

  const { data: programmes = [] } = useQuery({
    queryKey: ["programmes"],
    queryFn: getProgrammes,
  });

  const closeModal = () => {
    localStorage.setItem("modalInfo", "true");
    setIsModalOpen(false);
  };

  const showError = (message) => {
    setAlertModal({
      isOpen: true,
      message,
      type: "error"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <InformationModal isOpen={isModalOpen} onClose={closeModal}>
        <h1 className="text-2xl font-bold text-slate-800">Important Notice!</h1>
        <p className="mt-4 text-slate-700">
          Welcome to the Almaarif College of Nursing Sciences, Potiskum
          application portal. Please read the following instructions carefully.
        </p>
        <ul className="mt-4 list-disc space-y-2 text-slate-700">
          <li className="ml-4 flex items-center">
            <span className="mr-2 text-pink-600">•</span>
            <span>Application Fee: <span className="font-semibold">Varies by programme</span></span>
          </li>
          <li className="ml-4 flex items-center">
            <span className="mr-2 text-pink-600">•</span>
            <span>Accepted Results: <span className="font-semibold">WAEC, NECO, NABTECH</span> (maximum of two sittings)</span>
          </li>
          <li className="ml-4 flex items-center">
            <span className="mr-2 text-pink-600">•</span>
            <span>Required Subjects: <span className="font-semibold">English, Mathematics, Physics, Chemistry, and Biology</span></span>
          </li>
          {/* <li className="ml-4 flex items-center">
            <span className="mr-2 text-pink-600">•</span>
            <span>Application Opens: <span className="font-semibold"></span></span>
          </li>
          <li className="ml-4 flex items-center">
            <span className="mr-2 text-pink-600">•</span>
            <span>Application Closes: <span className="font-semibold">{session?.closingDate}</span></span>
          </li> */}
        </ul>
        <p className="mt-4 text-slate-700 bg-pink-50 p-3 rounded-md border-l-4 border-pink-500">
          Please ensure you have all the necessary documents ready before
          starting your application.
        </p>
      </InformationModal>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* <div className="bg-white shadow-sm rounded-2xl p-6 mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Application Portal</h1>
          <p className="text-slate-600">Almaarif College of Health Sciences, Potiskum</p>
        </div> */}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-3/4">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
              <ScrollingInfo />
            </div>

            {formLoading ? (
              <div className="bg-white rounded-2xl shadow-sm p-8 flex justify-center">
                <Loader />
              </div>
            ) : formError ? (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <div className="text-pink-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Unable to load programs</h3>
                <p className="text-slate-600 mb-4">We encountered an issue while loading the application data.</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <ProgramsSection programmes={programmes} />
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/4 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              {sessionLoading ? (
                <div className="flex justify-center py-4">
                  <Loader />
                </div>
              ) : sessionError ? (
                <div className="text-center py-4">
                  <div className="text-pink-600 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-700 text-sm">Unable to load application timeline</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-2 text-xs px-3 py-1 bg-pink-100 text-pink-700 rounded hover:bg-pink-200 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <CountdownTimer session={session} />
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              {formLoading ? (
                <div className="flex justify-center py-4">
                  <Loader />
                </div>
              ) : formError ? (
                <div className="text-center py-4">
                  <div className="text-pink-600 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-700 text-sm">Unable to load application data</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-2 text-xs px-3 py-1 bg-pink-100 text-pink-700 rounded hover:bg-pink-200 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : form ? (
                <PaymentApplication form={form} programmes={programmes} />
              ) : (
                <StartApplication programmes={programmes} />
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white mt-8 py-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-600 text-sm">
            © {new Date().getFullYear()} Almaarif College of Nursing Sciences, Potiskum. All rights reserved.
          </p>
        </div>
      </footer>

      <AlertModal 
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({...alertModal, isOpen: false})}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>
  );
};

export default ApplicationPage;
