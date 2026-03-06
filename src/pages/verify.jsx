import React, { useEffect } from "react";
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
  useEffect(() => {
    logOut();
    navigate("/auth/login");
  }, []);

  return (
    <div>
      <h1>Verification</h1>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Verify;
