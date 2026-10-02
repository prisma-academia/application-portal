import React, { useEffect } from "react";
import config from "../config";
import defaultLogo from "../assets/nurselogo.jpeg";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Verify() {
  const navigate = useNavigate();
  const query = useQuery();
  const logOut = useAuthStore((state) => state.logOut);
  const token = query.get("token");
  const message = query.get("message");
  // Old emailed verification links still land here; show the outcome before moving on.
  useEffect(() => {
    logOut();
    const timer = setTimeout(() => navigate("/auth/login"), 4000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 text-center">
      <img src={config.logoUrl || defaultLogo} alt="" className="w-24 mx-auto mb-6" />
      <h2 className="text-2xl font-bold mb-2 text-slate-800">{token ? "Email verified" : "Verification"}</h2>
      {message && <p className="text-slate-600 mb-4">{message}</p>}
      <p className="text-sm text-slate-500">Taking you to the login page...</p>
    </div>
  );
}

export default Verify;
