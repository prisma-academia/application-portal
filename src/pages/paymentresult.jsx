import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import config from "../config";
import defaultLogo from "../assets/nurselogo.jpeg";
import { useAuthStore } from "../store/auth";

const POLL_MS = 4000;
const GIVE_UP_MS = 60000;

// Paystack sends the payer back here (?status=&reference=). The application only flips
// to "paid" when the webhook has been processed, so a logged-in applicant polls for it.
// Public on purpose: staff-onboarded applicants may pay from an emailed link before
// they have ever logged in.
function PaymentResult() {
  const params = new URLSearchParams(useLocation().search);
  const status = params.get("status");
  const reference = params.get("reference");
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const [timedOut, setTimedOut] = useState(false);
  const failed = status && !["success", "successful", "paid"].includes(status.toLowerCase());

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), GIVE_UP_MS);
    return () => clearTimeout(timer);
  }, []);

  const { data: form } = useQuery({
    queryKey: ["payment-result", reference],
    enabled: Boolean(token) && !failed,
    refetchInterval: (query) => (query.state.data?.status === "paid" || timedOut ? false : POLL_MS),
    queryFn: async () => {
      const response = await fetch(`${config.baseUrl}/api/v1/application/single-form`, {
        headers: { authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      return result.ok ? result.data : null;
    },
  });

  const paid = form?.status === "paid";

  let title;
  let body;
  if (failed) {
    title = "Payment not completed";
    body = "Your payment was not completed. You have not been charged; you can try again from your application page.";
  } else if (paid) {
    title = "Payment received";
    body = `Thank you. Application ${form.number} is now paid and submitted. You can download your application form from your dashboard.`;
  } else if (!token) {
    title = "Thank you";
    body = "If your payment went through, your application will be marked as paid within a few minutes. Log in to check its status and download your form.";
  } else if (timedOut) {
    title = "Still processing";
    body = "We have not received confirmation from the payment provider yet. This can take a few minutes; your dashboard will update automatically.";
  } else {
    title = "Confirming your payment...";
    body = "Please wait while we confirm your payment with the payment provider.";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 text-center">
        <img src={config.logoUrl || defaultLogo} alt="" className="w-24 mx-auto mb-6" />
        {!failed && !paid && token && !timedOut && (
          <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-pink-200 border-t-pink-600 animate-spin"></div>
        )}
        <h2 className={`text-2xl font-bold mb-2 ${failed ? "text-pink-700" : paid ? "text-green-700" : "text-slate-800"}`}>{title}</h2>
        <p className="text-slate-600 mb-4">{body}</p>
        {reference && <p className="text-xs text-slate-500 mb-6">Reference: {reference}</p>}
        <Link
          to={user ? "/" : "/auth/login"}
          className="inline-block w-full bg-pink-600 text-white p-3 rounded-md hover:bg-pink-700 transition-colors font-medium"
        >
          {user ? "Go to my application" : "Log in"}
        </Link>
      </div>
    </div>
  );
}

export default PaymentResult;
