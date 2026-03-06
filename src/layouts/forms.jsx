import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import configs from "../config";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useSnackStore } from "../store/auth";

function FormsLayout({ children }) {
  const [pageHeader, setPageHeader] = useState("");
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { setAlert } = useSnackStore();

  const getPreference = async () => {
    const response = await fetch(`${configs.baseUrl}/api/v1/preference`, {
      method: "GET",
      redirect: "follow",
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
  const {
    data: preference,
    isLoading: prefrenceLoading,
    error: preferenceError,
    status: prefrenceStatus,
  } = useQuery({
    queryKey: ["preference"],
    queryFn: getPreference,
  });

  if (prefrenceLoading) {
    <h3>Loading prefrences</h3>;
  }
  if (preference?.minutesLeft < 1) {
    setAlert({variant:"danger", message:"Application Deadline"})
    navigate("/");
  }
  useEffect(() => {
    setPageHeader(pathname.split("/")[2]); // Updated to get the correct part of the path
  }, [pathname]);

  return (
    <div className="border w-[100%]  mx-auto bg-white shadow-lg rounded-lg flex justify-center  flex-col">
      <div className="w-full">{children}</div>
    </div>
  );
}

export default FormsLayout;
