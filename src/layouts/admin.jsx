import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";


function AdminLayout({ children }) {
  const isAuth = useAuthStore((state) => state.user);
  if (isAuth.role !== "admin") {
    return <Navigate to={"/"} />;
  }

  return children;
}

export default AdminLayout;
