import { useEffect, useState } from "react";
import defaultLogo from "../assets/nurselogo.jpeg";
import config from "../config";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import FormInput from "../components/forminput";
import AlertModal from "../components/AlertModal";
import { useFormik } from "formik";
import * as Yup from "yup";

function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("error");
  const navigate = useNavigate();

  const registerUser = async (credentials) => {
    const response = await fetch(`${config.baseUrl}/api/v1/auth/register`, {
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

  const { mutate, isError, error, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      setModalType("success");
      setMessage("Registration Successful! Please check your inbox to verify your email");
      setIsModalOpen(true);
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Required"),
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

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 backdrop-blur-sm bg-white/50">
      <div className="mb-6">
        <img src={config.logoUrl || defaultLogo} alt="" className="w-24 mx-auto" />
      </div>
      <h2 className="text-2xl font-bold text-center mb-2 text-slate-800">Create Account</h2>
      <p className="text-center text-slate-600 mb-6">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-pink-600 hover:text-pink-700 font-medium">
          Sign In
        </Link>
      </p>
      <form onSubmit={formik.handleSubmit}>
        <FormInput
          label="Email"
          placeholder="Enter your email"
          name="email"
          type="email"
          formik={formik}
        />
        <FormInput
          label="Password"
          placeholder="Create a password"
          name="password"
          type="password"
          formik={formik}
        />
        
        <button
          disabled={isLoading}
          type="submit"
          className="w-full bg-pink-600 text-white p-3 rounded-md hover:bg-pink-700 transition-colors disabled:bg-pink-400 focus:ring-2 focus:ring-pink-500/20 font-medium mt-2"
        >
          {isLoading ? "Creating Account..." : "Register"}
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

export default Register;

// import img from '../assets/nurselogo.jpeg'
// export default function Register(){
//     return (
//         <main className="w-full h-screen flex flex-col items-center justify-center px-4">
//             <div className="max-w-sm w-full text-gray-600 space-y-5">
//                 <div className="text-center pb-8">
//                     <img src={img} width={150} className="mx-auto" />
//                     <div className="mt-5">
//                         <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Log in to your account</h3>
//                     </div>
//                 </div>
//                 <form
//                     onSubmit={(e) => e.preventDefault()}
//                     className="space-y-5"
//                 >
//                     <div>
//                         <label className="font-medium">
//                             Email
//                         </label>
//                         <input
//                             type="email"
//                             required
//                             className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
//                         />
//                     </div>
//                     <div>
//                         <label className="font-medium">
//                             Password
//                         </label>
//                         <input
//                             type="password"
//                             required
//                             className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
//                         />
//                     </div>
//                     <div className="flex items-center justify-between text-sm">
//                         <div className="flex items-center gap-x-3">
//                             <input type="checkbox" id="remember-me-checkbox" className="checkbox-item peer hidden" />
//                             <label
//                                 htmlFor="remember-me-checkbox"
//                                 className="relative flex w-5 h-5 bg-white peer-checked:bg-red-800 rounded-md border ring-offset-2 ring-indigo-600 duration-150 peer-active:ring cursor-pointer after:absolute after:inset-x-0 after:top-[3px] after:m-auto after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45"
//                             >
//                             </label>
//                             <span>Remember me</span>
//                         </div>
//                         <a href="javascript:void(0)" className="text-center text-red-800 hover:text-indigo-500">Forgot password?</a>
//                     </div>
//                     <button
//                         className="w-full px-4 py-2 text-white font-medium bg-red-800 hover:bg-red-800 active:bg-red-800 rounded-lg duration-150"
//                     >
//                         Sign in
//                     </button>
//                 </form>

//                 <p className="text-center">Don't have an account? <a href="javascript:void(0)" className="font-medium text-red-800 hover:text-indigo-500">Sign up</a></p>
//             </div>
//         </main>
//     )
// }
