import { useEffect, useState } from "react";
import defaultLogo from "../assets/nurselogo.jpeg";
import config from "../config";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth";
import FormInput from "../components/forminput";
import AlertModal from "../components/AlertModal";
import { useFormik } from "formik";
import * as Yup from "yup";

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("error");
  const queryClient = useQueryClient();
  const logIn = useAuthStore((state) => state.logIn);
  const navigate = useNavigate();

  const loginUser = async (credentials) => {
    const response = await fetch(`${config.baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

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

  const { mutate, isError, error, isPending, data } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      handleLoginSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["login"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      setIsLoading(true);
      mutate(values);
    },
  });

  useEffect(() => {
    if (isPending) return;
    
    if (error) {
      let errorMessage;
      try {
        errorMessage = JSON.parse(error?.message)?.message || error.message;
      } catch (e) {
        errorMessage = error.message;
      }
      setMessage(errorMessage);
      setModalType("error");
      setIsModalOpen(true);
      setIsLoading(false);
    }
  }, [isError, error, isPending]);

  // Handle successful login
  const handleLoginSuccess = (data) => {
    if (data) {
      const { user, token } = data;
      logIn(user, token);
      setMessage("Login successful");
      setModalType("success");
      setIsModalOpen(true);
      setIsLoading(false);
      
      // Slight delay before redirecting
      setTimeout(() => {
        if (user.role === "admin") {
          window.location.href = "/admin";
        }
      }, 1000);
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 backdrop-blur-sm bg-white/30">
      <div className="mb-8">
        <img src={config.logoUrl || defaultLogo} alt="" className="w-28 mx-auto" />
      </div>
      <h1 className="text-3xl font-bold text-center mb-3 text-slate-800">
        Welcome Back
      </h1>
      <h2 className="text-xl font-medium text-center mb-6 text-slate-600 leading-relaxed">
        {config.appName} Portal
      </h2>
      <p className="text-center text-slate-600 mb-8">
        New to our platform?{" "}
        <Link to="/auth/register" className="text-pink-600 hover:text-pink-700 font-semibold transition-colors">
          Create an account
        </Link>
      </p>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <FormInput
          label="Email"
          placeholder="Enter your email"
          name="email"
          type="email"
          formik={formik}
        />
        <FormInput
          label="Password"
          placeholder="Enter your password"
          name="password"
          type="password"
          formik={formik}
        />
        
        <div className="flex items-center justify-end mb-2">
          <Link 
            to="/auth/forgot-password" 
            className="text-slate-600 hover:text-pink-600 text-sm font-medium transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        
        <button
          disabled={isLoading}
          type="submit"
          className="w-full bg-pink-600 text-white py-3.5 rounded-lg hover:bg-pink-700 
            transition-colors disabled:bg-pink-400 focus:ring-2 focus:ring-pink-500/20 
            font-semibold text-base shadow-sm"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      
      <AlertModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={message}
        type={modalType}
      />
    </div>
  );
}

export default Login;
