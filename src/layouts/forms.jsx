import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useSnackStore } from "../store/auth";
import { useActiveSession } from "../hooks/use-active-session";

function FormsLayout({ children }) {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { setAlert } = useSnackStore();

  const { session, isLoading: sessionLoading, isClosed, error: sessionError } = useActiveSession({
    token,
    onUnauthorized: () => navigate("/logout"),
  });

  useEffect(() => {
    if (sessionLoading || sessionError) return;
    if (!session || isClosed) {
      setAlert({ variant: "danger", message: "Application Deadline" });
      navigate("/");
    }
  }, [sessionLoading, sessionError, session, isClosed, navigate, setAlert]);

  if (sessionLoading) {
    return <h3>Loading session...</h3>;
  }
  if (sessionError || !session || isClosed) {
    return null;
  }

  return (
    <div className="border w-[100%]  mx-auto bg-white shadow-lg rounded-lg flex justify-center  flex-col">
      <div className="w-full">{children}</div>
    </div>
  );
}

export default FormsLayout;
