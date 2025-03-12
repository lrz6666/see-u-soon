import React, { Children } from "react";

const Button = ({ children, type = "button", className = "" }) => {
  return (
    <button
      className={`bg-fuchsia-900${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
