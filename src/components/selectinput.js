// SelectInput.js
import React from "react";

const SelectInput = ({
  label,
  name,
  formik,
  options = [],
  onChange,
  onBlur,
  value,
  disabled = false,
  className = "",
  placeholder = "Select an option"
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    } else {
      formik.handleChange(e);
    }
  };

  const handleBlur = (e) => {
    if (onBlur) {
      onBlur(e);
    } else {
      formik.handleBlur(e);
    }
  };

  const hasError = formik?.touched?.[name] && formik?.errors?.[name];
  const currentValue = value || (formik?.values?.[name] || "");

  return (
    <div className="mb-4">
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-slate-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          value={currentValue}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          className={`w-full px-3 py-2 bg-white border appearance-none ${
            hasError
              ? "border-pink-500 focus:ring-pink-500 focus:border-pink-500"
              : "border-slate-300 focus:ring-pink-500 focus:border-pink-500"
          } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-20 text-sm ${
            disabled ? "bg-slate-50 text-slate-500 cursor-not-allowed" : ""
          } ${className}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
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

export default SelectInput;