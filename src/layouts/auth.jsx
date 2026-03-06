import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

const AuthLayout = ({ children }) => {
    const isAuth = useAuthStore((state) => state.user);
    if (isAuth) {
      return <Navigate to={"/"} />;
    }
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
        {/* <progress className="progress w-full"></progress> */}
        {children}
      </div>
    )
  }
  export default AuthLayout