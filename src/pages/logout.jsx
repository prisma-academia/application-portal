import React, { useEffect } from "react";
import { useAuthStore } from "../store/auth";

function Logout() {
  const logOut = useAuthStore((state) => state.logOut);
  useEffect(() => {
    logOut();
    window.location.reload();
  }, []);

  return <div>session expired.........</div>;
}

export default Logout;
