import React, { Children } from "react";

const Button = ({
  children,
  type = "button",
  className = "",
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${className} inline-block w-fit items-center justify-center whitespace-nowrap px-4 py-2 border-2 border-black bg-transparent shadow-md rounded-4xl   hover:shadow-lg hover:-translate-y-1 hover:scale-105 active:scale-90 transition duration-300 md:px-6 md:py-3`}
    >
      {children}
    </button>
  );
};

export default Button;
