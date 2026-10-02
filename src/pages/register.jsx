import { useCallback, useEffect, useState } from "react";
import defaultLogo from "../assets/nurselogo.jpeg";
import config from "../config";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import FormInput from "../components/forminput";
import AlertModal from "../components/AlertModal";
import CodeInput from "../components/codeinput";
import { useAuthStore } from "../store/auth";
import { useFormik } from "formik";
import * as Yup from "yup";

const CODE_LENGTH = 6;

const postJson = async (path, body) => {
  const response = await fetch(`${config.baseUrl}/api/v1/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let result;
  try {
    result = await response.json();
  } catch (e) {
    throw new Error("Something went wrong. Please try again.");
  }
  if (!response.ok || !result.ok) {
    const fieldError = result.errors && result.errors[0] && result.errors[0].message;
    throw new Error(fieldError || result.message || "Something went wrong. Please try again.");
  }
  return result;
};

// Sign-up in two steps: email + password, then the 6-digit code emailed to them.
// The account only exists once the code is accepted, and they are logged straight in.
function Register() {
  const logIn = useAuthStore((state) => state.logIn);
  const [step, setStep] = useState("details"); // details | code
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const [modal, setModal] = useState({ open: false, type: "error", message: "" });

  const showError = (error) => setModal({ open: true, type: "error", message: error.message });
  // Stable so AlertModal's auto-close timer isn't restarted by the countdown re-renders.
  const closeModal = useCallback(() => setModal((m) => ({ ...m, open: false })), []);

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const register = useMutation({
    mutationFn: (values) => postJson("register", values),
    onSuccess: (result) => {
      setEmail(result.data.email);
      setCode("");
      setResendIn(result.data.resendAfter || 60);
      setStep("code");
    },
    onError: showError,
  });

  const verify = useMutation({
    mutationFn: (values) => postJson("register/verify", values),
    // Logging in flips AuthLayout over to the portal home page.
    onSuccess: (result) => logIn(result.data.user, result.data.token),
    onError: (error) => {
      setCode("");
      showError(error);
      // The pending sign-up is gone after too many attempts or expiry; start again.
      if (/register again/i.test(error.message)) setStep("details");
    },
  });

  const resend = useMutation({
    mutationFn: () => postJson("register/resend", { email }),
    onSuccess: (result) => {
      setCode("");
      setResendIn(result.data.resendAfter || 60);
      setModal({ open: true, type: "success", message: `A new code has been sent to ${email}.` });
    },
    onError: (error) => {
      showError(error);
      if (/register again/i.test(error.message)) setStep("details");
    },
  });

  const formik = useFormik({
    initialValues: { email: "", password: "", confirmPassword: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().min(8, "Password must be at least 8 characters").required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords do not match")
        .required("Required"),
    }),
    onSubmit: ({ email, password }) => register.mutate({ email: email.trim(), password }),
  });

  const cleanCode = code.replace(/\D/g, "");

  // Submit as soon as the last digit is entered.
  useEffect(() => {
    if (step === "code" && cleanCode.length === CODE_LENGTH && !verify.isPending) {
      verify.mutate({ email, code: cleanCode });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cleanCode, step]);

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 backdrop-blur-sm bg-white/50">
      <div className="mb-6">
        <img src={config.logoUrl || defaultLogo} alt="" className="w-24 mx-auto" />
      </div>

      {step === "details" ? (
        <>
          <h2 className="text-2xl font-bold text-center mb-2 text-slate-800">Create Account</h2>
          <p className="text-center text-slate-600 mb-6">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-pink-600 hover:text-pink-700 font-medium">
              Sign In
            </Link>
          </p>
          <form onSubmit={formik.handleSubmit}>
            <FormInput label="Email" placeholder="Enter your email" name="email" type="email" formik={formik} />
            <FormInput label="Password" placeholder="Create a password" name="password" type="password" formik={formik} />
            <FormInput label="Confirm Password" placeholder="Re-enter your password" name="confirmPassword" type="password" formik={formik} />
            <button
              disabled={register.isPending}
              type="submit"
              className="w-full bg-pink-600 text-white p-3 rounded-md hover:bg-pink-700 transition-colors disabled:bg-pink-400 focus:ring-2 focus:ring-pink-500/20 font-medium mt-2"
            >
              {register.isPending ? "Sending code..." : "Continue"}
            </button>
          </form>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-center mb-2 text-slate-800">Verify your email</h2>
          <p className="text-center text-slate-600 mb-6 text-sm">
            Enter the 6-digit code we sent to <span className="font-medium text-slate-800">{email}</span>.
            It expires in 15 minutes.
          </p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (cleanCode.length === CODE_LENGTH) verify.mutate({ email, code: cleanCode });
            }}
          >
            <CodeInput value={code} onChange={setCode} length={CODE_LENGTH} disabled={verify.isPending} />
            <button
              disabled={verify.isPending || cleanCode.length !== CODE_LENGTH}
              type="submit"
              className="w-full bg-pink-600 text-white p-3 rounded-md hover:bg-pink-700 transition-colors disabled:bg-pink-400 focus:ring-2 focus:ring-pink-500/20 font-medium mt-6"
            >
              {verify.isPending ? "Verifying..." : "Verify and continue"}
            </button>
          </form>
          <div className="flex items-center justify-between mt-4 text-sm">
            <button
              type="button"
              onClick={() => setStep("details")}
              className="text-slate-600 hover:text-slate-800"
            >
              Change email
            </button>
            <button
              type="button"
              disabled={resendIn > 0 || resend.isPending}
              onClick={() => resend.mutate()}
              className="text-pink-600 hover:text-pink-700 font-medium disabled:text-slate-400"
            >
              {resend.isPending ? "Sending..." : resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
            </button>
          </div>
          <p className="text-center text-xs text-slate-500 mt-4">
            Can't find it? Check your spam or promotions folder.
          </p>
        </>
      )}

      <AlertModal
        isOpen={modal.open}
        onClose={closeModal}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
}

export default Register;
