import React from "react";
import { useQuery } from "@tanstack/react-query";
import configs from "../config";
import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router-dom";

const AdmissionStatusPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore((state) => state);

  const getAdmissionStatus = async () => {
    const response = await fetch(`${configs.baseUrl}/api/v1/admission/offer`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        navigate("/logout");
      }
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const result = await response.json();
    if (result.ok) {
      return result.data;
    }
    throw new Error(result.message);
  };

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["admission"],
    refetchIntervalInBackground: true,
    refetchInterval: 5000,
    queryFn: getAdmissionStatus,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-gray-700 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-red-600 bg-red-100 p-4 rounded-lg shadow-md">
          {error instanceof Error ? error.message : "An error occurred"}
        </div>
      </div>
    );
  }

  const admission = data;
  if (!admission) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-gray-700 bg-white p-6 rounded-lg shadow-md">
          No admission information found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-sm overflow-hidden">
      <div className="bg-primary text-white py-6 px-8">
        <h1 className="text-4xl font-bold">Admission Status</h1>
        <p className="mt-2 text-blue-100">
          Admission Number: {admission.number}
        </p>
      </div>
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Personal Information
            </h2>
            <div className="bg-white p-4 rounded-md border border-gray-200">
              <p className="text-lg mb-2">
                Programme:{" "}
                <span className="font-semibold">{admission.programme}</span>
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Status
            </h2>
            <div className="flex items-center bg-white p-4 rounded-md border border-gray-200">
              {admission.status === "accepted" ? (
                <svg
                  className="w-8 h-8 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-8 h-8 text-yellow-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              <span className="text-xl font-medium capitalize">
                {admission.status === "accepted"
                  ? "Admission Accepted"
                  : "Admission Pending"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Admission Details
            </h2>
            <div className="bg-white p-4 rounded-md border border-gray-200">
              <p className="text-lg mb-2">
                Offer Date:{" "}
                <span className="font-semibold">
                  {new Date(admission.offerDate).toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Acceptance Fee
            </h2>
            <div className="bg-white p-4 rounded-md border border-gray-200">
              <p className="text-lg mb-2">
                Amount: <span className="font-semibold">₦{5000}</span>
              </p>
              <p className="text-lg mb-2">
                VAT: <span className="font-semibold">1.5%</span>
              </p>
              <p className="text-lg mb-4">
                Status:{" "}
                {admission?.payment.paid ? (
                  <span className="text-green-600 font-semibold">Paid</span>
                ) : (
                  <span className="text-red-600 font-semibold">Not Paid</span>
                )}
              </p>

              {admission?.payment.paid ? (
                <>
                  <p className="text-lg mb-2">
                    Payment Date:{" "}
                    <span className="font-semibold">
                      {new Date(
                        admission?.payment?.paymentDate
                      ).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-lg mb-2">
                    Payment Reference:{" "}
                    <span className="font-semibold">
                      {admission?.payment?.reference}
                    </span>
                  </p>
                  <div className="flex flex-col space-y-4 p-4 md:p-0">
                    <h3 className="font-semibold mt-3 text-primary">Downloads</h3>
                    <button
                      onClick={() =>
                        (window.location.href = `${configs.baseUrl}/api/v1/admission/pdf/${admission._id}`)
                      }
                      className="w-full mt-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 font-medium"
                    >
                      Admission Letter
                    </button>

                    <button
                      onClick={() =>
                        (window.location.href = `${configs.baseUrl}/api/v1/admission/bond/${admission._id}`)
                      }
                      className="w-full mt-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 font-medium"
                    >
                      Bond/Acceptance Form
                    </button>

                    <button
                      onClick={() =>
                        (window.location.href = `${configs.baseUrl}/api/v1/admission/fees/${admission._id}`)
                      }
                      className="w-full mt-2 px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300 font-medium"
                    >
                      Schedule of Fees
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() =>
                    (window.location.href = `${configs.baseUrl}/api/v1/admission/payment/${user._id}?token=${token}`)
                  }
                  className="w-full mt-2 px-6 py-3 bg-primary text-white rounded-md hover:bg-red-900 transition duration-300 font-medium"
                >
                  Proceed to Payment
                </button>
              )}
            </div>
          </div>
        </div>

        {admission.requirements && admission.requirements.length > 0 && (
          <div className="mt-6 bg-gray-50 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Admission Requirements
            </h2>
            <ul className="bg-white rounded-md border border-gray-200 divide-y divide-gray-200">
              {admission.requirements.map((req, index) => (
                <li key={index} className="p-4">
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdmissionStatusPage;
