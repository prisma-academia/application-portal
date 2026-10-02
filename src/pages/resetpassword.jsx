import React, { useEffect, useState } from "react";
import defaultLogo from "../assets/nurselogo.jpeg";
import config from "../config";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Also serves /auth/set-password (invite): staff-onboarded applicants choose their
// first password from the emailed link and are logged straight in.
function ResetPassword({ invite = false }) {
  const logIn = useAuthStore((state) => state.logIn);
  const query = useQuery();
  const token = query.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();

  const resetPassword = async (credentials) => {
    const response = await fetch(
      `${config.baseUrl}/api/v1/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(credentials),
      }
    );

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

  const { data, mutate, isError, error, isPending, failureReason } =
    useMutation({
      mutationFn: resetPassword,
      // onSuccess: () => QueryClient.invalidateQueries({ queryKey: ["login"] }),
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters");
    } else if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      mutate({ password, token });
      setMessage("");
    }
  };
  useEffect(() => {
    if (data && invite) {
      logIn(data.user, data.token);
    } else if (data) {
      alert("Password has been reset successfully");
      navigate("/auth/login")
    }
    if (error) {
      let errorMessage;
      try {
        errorMessage = JSON.parse(error?.message)?.message || error.message;
      } catch (e) {
        errorMessage = error.message;
      }
      setMessage(errorMessage);
      setisLoading(false);
    }
  }, [data, isError, error, isPending, failureReason]);

  return (
    <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
      <div className="mb-8">
        <img src={config.logoUrl || defaultLogo} alt="" className="w-24 mx-auto" />
      </div>
      <h2 className="text-2xl font-bold text-center mb-4">{invite ? "Set Your Password" : "Reset Password"}</h2>
      {invite && (
        <p className="text-center text-slate-600 mb-6 text-sm">
          Choose a password for your application portal account.
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="text-gray-700 flex justify-start"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            required
            className="mt-1 w-full p-3 border border-gray-300 rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="text-gray-700 flex justify-start"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            required
            className="mt-1 w-full p-3 border border-gray-300 rounded"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <p className="text-red-900 text-center mb-4 text-weight-500">
          {message}
        </p>
        <button
          type="submit"
          className="w-full bg-red-800 text-white p-3 rounded-lg hover:bg-red-700 transition-colors"
        >
          {isPending ? "Saving..." : invite ? "Set Password" : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
