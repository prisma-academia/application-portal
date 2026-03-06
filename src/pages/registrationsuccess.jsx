// RegistrationSuccess.js
import React from "react";
import { Link } from "react-router-dom";

const RegistrationSuccess = () => (
  <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 backdrop-blur-sm bg-white/30">
    <div className="text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h1 className="text-3xl font-bold mb-3 text-slate-800">
        Registration Successful!
      </h1>
      
      <p className="text-slate-600 mb-8 leading-relaxed">
        Your account has been created successfully. You can now sign in to access your account.
      </p>

      <Link
        to="/auth/login"
        className="inline-block bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 
          transition-colors font-semibold text-base shadow-sm"
      >
        Sign In to Your Account
      </Link>
    </div>
  </div>
);

export default RegistrationSuccess;
