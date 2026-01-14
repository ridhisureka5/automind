import * as React from "react";

export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
