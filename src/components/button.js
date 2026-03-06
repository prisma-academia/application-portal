import React from "react";
import PropTypes from "prop-types";

const MyButton = ({
  text,
  type = "button",
  onClick,
  disabled = false,
  className = "",
  variant = "filled",
  size = "md",
  icon,
  iconPosition = "right",
  full = false
}) => {
  // Base styles
  const baseClasses = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-20 rounded-lg";
  
  // Size variants
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  
  // Style variants
  const variantClasses = {
    filled: `bg-pink-600 text-white hover:bg-pink-700 focus:ring-pink-500/20 ${disabled ? "opacity-50 cursor-not-allowed bg-pink-300" : ""}`,
    outlined: `border border-pink-600 text-pink-600 hover:bg-pink-50 focus:ring-pink-500/20 ${disabled ? "opacity-50 cursor-not-allowed border-pink-300 text-pink-300" : ""}`,
    text: `text-pink-600 hover:bg-pink-50 focus:ring-pink-500/20 ${disabled ? "opacity-50 cursor-not-allowed text-pink-300" : ""}`,
    secondary: `bg-slate-800 text-white hover:bg-slate-900 focus:ring-slate-500/20 ${disabled ? "opacity-50 cursor-not-allowed bg-slate-300" : ""}`,
  };
  
  const widthClass = full ? "w-full" : "";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${sizeClasses[size] || sizeClasses.md}
        ${variantClasses[variant] || variantClasses.filled}
        ${widthClass}
        ${className}
      `}
    >
      {icon && iconPosition === "left" && (
        <span className="mr-2">{icon}</span>
      )}
      {text}
      {icon && iconPosition === "right" && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

MyButton.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  variant: PropTypes.oneOf(["filled", "outlined", "text", "secondary"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  full: PropTypes.bool,
};

export default MyButton;
