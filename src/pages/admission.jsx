import React from "react";
import { useAdmissionOffer } from "../hooks/useAdmissionOffer";
import configs from "../config";
import { useAuthStore } from "../store/auth";
import Loader from "../components/loader";

const AdmissionStatusPage = () => {
  const { user, token } = useAuthStore((state) => state);
  const { data: admission, isLoading, isError, error, refetch } = useAdmissionOffer();

  const programmeName =
    admission?.programme && typeof admission.programme === "object"
      ? admission.programme.name
      : admission?.programme;
  const acceptanceFee =
    admission?.programme && typeof admission.programme === "object" && admission.programme.acceptanceFee != null
      ? admission.programme.acceptanceFee
      : 5000;

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <Loader />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="text-center py-4">
            <div className="text-pink-600 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-slate-700 text-sm mb-2">
              {error instanceof Error ? error.message : "An error occurred"}
            </p>
            <button
              onClick={() => refetch()}
              className="text-xs px-3 py-1 bg-pink-100 text-pink-700 rounded hover:bg-pink-200 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!admission) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-center text-slate-700 text-sm py-4">
            No admission information found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 py-4 px-6">
          <h1 className="text-lg font-bold text-white">Admission Status</h1>
          <p className="text-pink-100 text-sm mt-0.5">
            Admission Number: {admission.number}
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <p className="text-xs text-slate-500 mb-0.5">Programme</p>
              <p className="text-sm font-medium text-slate-800">{programmeName}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <p className="text-xs text-slate-500 mb-0.5">Status</p>
              <span
                className={`inline-flex items-center text-sm font-medium ${
                  admission.status === "accepted"
                    ? "text-green-700 bg-green-100"
                    : "text-amber-700 bg-amber-100"
                } px-2.5 py-0.5 rounded-full`}
              >
                {admission.status === "accepted"
                  ? "Admission Accepted"
                  : "Admission Pending"}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <p className="text-xs text-slate-500 mb-0.5">Offer Date</p>
              <p className="text-sm font-medium text-slate-800">
                {new Date(admission.offerDate).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <p className="text-xs text-slate-500 mb-0.5">Acceptance Fee</p>
              <p className="text-sm font-medium text-slate-800">
                ₦{typeof acceptanceFee === "number" ? acceptanceFee.toLocaleString() : acceptanceFee}
              </p>
              <p className="text-xs text-slate-500 mt-1">VAT: 1.5%</p>
              <p className="text-sm mt-1">
                {admission?.payment?.paid ? (
                  <span className="text-green-600 font-medium">Paid</span>
                ) : (
                  <span className="text-red-600 font-medium">Not Paid</span>
                )}
              </p>
            </div>
          </div>

          {admission?.payment?.paid ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                <span>
                  Payment:{" "}
                  {admission?.payment?.paymentDate
                    ? new Date(admission.payment.paymentDate).toLocaleDateString()
                    : "—"}
                </span>
                {admission?.payment?.reference && (
                  <span>Ref: {admission.payment.reference}</span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-slate-800 mt-3">Downloads</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() =>
                    (window.location.href = `${configs.baseUrl}/api/v1/admission/pdf/${admission._id}`)
                  }
                  className="w-full px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Admission Letter
                </button>
                <button
                  onClick={() =>
                    (window.location.href = `${configs.baseUrl}/api/v1/admission/bond/${admission._id}`)
                  }
                  className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Bond/Acceptance Form
                </button>
                <button
                  onClick={() =>
                    (window.location.href = `${configs.baseUrl}/api/v1/admission/fees/${admission._id}`)
                  }
                  className="w-full px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Schedule of Fees
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() =>
                (window.location.href = `${configs.baseUrl}/api/v1/admission/payment/${user._id}?token=${token}`)
              }
              className="w-full mt-2 px-4 py-3 bg-primary text-white text-sm rounded-lg hover:opacity-90 transition-colors font-medium"
            >
              Proceed to Payment
            </button>
          )}

          {admission.requirements && admission.requirements.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">
                Admission Requirements
              </h3>
              <ul className="space-y-1.5">
                {admission.requirements.map((req, index) => (
                  <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-pink-500 mt-0.5">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdmissionStatusPage;
