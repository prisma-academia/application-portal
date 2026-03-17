import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import configs from "../config";
import { useAuthStore } from "../store/auth";

export function useAdmissionOffer() {
  const navigate = useNavigate();
  const { user, token } = useAuthStore((state) => state);

  const result = useQuery({
    queryKey: ["admission"],
    refetchIntervalInBackground: true,
    refetchInterval: 5000,
    queryFn: async () => {
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

      const res = await response.json();
      if (res.ok) return res.data;
      throw new Error(res.message);
    },
  });

  return {
    data: result.data,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
    user,
    token,
  };
}
