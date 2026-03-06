import { useState, useEffect } from "react";
import defaultLogo from "../assets/nurselogo.jpeg";
import config from "../config";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import FormInput from "../components/forminput";
import AlertModal from "../components/AlertModal";
import { useFormik } from "formik";
import * as Yup from "yup";

function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("error");

  const forgotPassword = async (credentials) => {
    const response = await fetch(
      `${config.baseUrl}/api/v1/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      return result.message;
    }
    throw new Error(result.message);
  };

  const { mutate, isError, error, isPending, data } = useMutation({
    mutationFn: forgotPassword,
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: (values) => {
      setIsLoading(true);
      setMessage("");
      mutate(values);
    },
  });

  useEffect(() => {
    if (isPending) return;

    if (data) {
      setMessage(data);
      setModalType("success");
      setIsModalOpen(true);
      setIsLoading(false);
      formik.resetForm();
    }
    
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
  }, [data, isError, error, isPending]);

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 backdrop-blur-sm bg-white/30">
      <div className="mb-8">
        <img src={config.logoUrl || defaultLogo} alt="" className="w-28 mx-auto" />
      </div>
      <h1 className="text-3xl font-bold text-center mb-3 text-slate-800">
        Reset Password
      </h1>
      <p className="text-center text-slate-600 mb-8 leading-relaxed max-w-sm mx-auto">
        Enter your email address and we'll send you instructions to reset your password
      </p>
      
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <FormInput
          label="Email"
          placeholder="Enter your email"
          name="email"
          type="email"
          formik={formik}
        />
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-pink-600 text-white py-3.5 rounded-lg hover:bg-pink-700 
            transition-colors disabled:bg-pink-400 focus:ring-2 focus:ring-pink-500/20 
            font-semibold text-base shadow-sm mt-4"
        >
          {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
        </button>
        
        <div className="text-center mt-6">
          <Link 
            to="/auth/login" 
            className="text-slate-600 hover:text-pink-600 font-medium transition-colors inline-flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Sign In
          </Link>
        </div>
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

export default ForgotPassword;

// import img from '../assets/nurselogo.jpeg'
// export default function ForgotPassword(){
//     return (
//         <main className="w-full h-screen flex flex-col items-center justify-center px-4">
//             <div className="max-w-sm w-full text-gray-600 space-y-8">
//                 <div className="text-center">
//                     <img src={img} width={150} className="mx-auto" />
//                     <div className="mt-5 space-y-2">
//                         <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Log in to your account</h3>
//                         <p className="">Don't have an account? <a href="javascript:void(0)" className="font-medium text-red-800 hover:text-red-800">Sign up</a></p>
//                     </div>
//                 </div>
//                 <form
//                     onSubmit={(e) => e.preventDefault()}
//                 >
//                     <div>
//                         <label className="font-medium">
//                             Email
//                         </label>
//                         <input
//                             type="email"
//                             required
//                             className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-red-800 shadow-sm rounded-lg"
//                         />
//                     </div>
//                     <button
//                         className="w-full mt-4 px-4 py-2 text-white font-medium bg-red-800 hover:bg-red-800 active:bg-red-800 rounded-lg duration-150"
//                     >
//                         Sign in
//                     </button>
//                 </form>

//                 <div className="text-center">
//                     <a href="javascript:void(0)" className="text-red-800 hover:text-red-800">Forgot password?</a>
//                 </div>
//             </div>
//         </main>
//     )
// }
