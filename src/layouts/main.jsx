import React from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { useAuthStore } from "../store/auth";
import { io } from "socket.io-client";
import configs from "../config";

function PrivateLayout({ children }) {
  const isAuth = useAuthStore((state) => state.user);
  if (!isAuth) {
    return <Navigate to={"/auth/login"} />;
  }
  const socket = io(configs.baseUrl);
  socket.on("connect", () => {
    console.log("Connected to the socket server");
    socket.emit("register", isAuth.email);
  });
  socket.on("message", (msg) => {
    console.log(`message from server ${msg}`);
  });
  socket.on("private_message", (msg) => {
    console.log(`private_message from server ${msg}`);
  });
  

  return (
    <div className="min-h-screen bg-surface p-4 sm:p-8">
      <div className="max-w-7xl bg-surface mx-auto">
        <Navbar className="mb-4" />
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default PrivateLayout;
