import React from "react";
import MyButton from "./button";
import configs from "../config";
import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router-dom";

const getProgrammeDisplay = (form, programmes = []) => {
  const p = form?.programme;
  if (!p) return "";
  if (typeof p === "object" && p.name) return p.name;
  return programmes.find((prog) => prog._id === p)?.name ?? p;
};

const getApplicationFee = (form, preference, programmes = []) => {
  const p = form?.programme;
  if (typeof p === "object" && p.price != null) return p.price;
  const id = typeof p === "string" ? p : p?._id;
  const programme = id ? programmes.find((prog) => prog._id === id) : null;
  if (programme?.price != null) return programme.price;
  return preference?.price ?? "—";
};

const PaymentApplication = ({ form, preference, programmes = [] }) => {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const programmeName = getProgrammeDisplay(form, programmes);
  const applicationFee = getApplicationFee(form, preference, programmes);

  const getPaymentLink = async () => {
    const response = await fetch(`${configs.baseUrl}/api/v1/application/payment-link`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await getPaymentLink();
      window.location.href = res.authorizationUrl;
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h2 className="text-lg font-semibold text-slate-800">Application Status</h2>
      </div>
      
      {form?.status === "not paid" ? (
        <div>
          <div className="bg-pink-50 rounded-lg p-4 mb-4 border-l-4 border-pink-500">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-pink-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-pink-700">
                  Your application requires payment to proceed.
                </p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg mb-4">
              <div>
                {programmeName && (
                  <p className="text-xs font-medium text-slate-600 mb-1">Program: {programmeName}</p>
                )}
                <p className="text-sm font-medium text-slate-700">Application Fee</p>
                <p className="text-lg font-bold text-slate-900">₦{typeof applicationFee === "number" ? applicationFee.toLocaleString() : applicationFee}</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                Required
              </span>
            </div>
            
            <MyButton
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center"
              text={
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Proceed to Payment
                </span>
              }
              type="submit"
            />
          </form>
        </div>
      ) : (
        <div>
          <div className="bg-green-50 rounded-lg p-4 mb-4 border-l-4 border-green-500">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Your application is complete. You can download your application details below.
                </p>
              </div>
            </div>
          </div>
          
          <MyButton
            className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-lg transition-colors flex items-center justify-center"
            text={
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Application
              </span>
            }
            onClick={() => window.location.href = `${configs.baseUrl}/api/v1/application/pdf/${form._id}`}
            type="button"
          />
        </div>
      )}
    </div>
  );
};

export default PaymentApplication;
