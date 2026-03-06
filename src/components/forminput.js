// Component: Modern floating label input with validation
import React from "react";

const FormInput = ({
  label,
  name,
  type = "text",
  placeholder = "",
  formik,
  className = "",
  disabled = false,
}) => {
  const hasError = formik.touched[name] && formik.errors[name];

  return (
    <div className="mb-4">
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-slate-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          id={name}
          placeholder={placeholder}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[name]}
          disabled={disabled}
          className={`w-full px-3 py-2 bg-white border ${
            hasError
              ? "border-pink-500 focus:ring-pink-500 focus:border-pink-500"
              : "border-slate-300 focus:ring-pink-500 focus:border-pink-500"
          } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-20 text-sm ${
            disabled ? "bg-slate-50 text-slate-500" : ""
          } ${className}`}
        />
        {type === "password" && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 text-slate-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
              />
            </svg>
          </div>
        )}
      </div>
      
      {hasError && (
        <div className="mt-1 text-xs text-pink-600 flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-3 w-3 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          {formik.errors[name]}
        </div>
      )}
    </div>
  );
};

export default FormInput;
