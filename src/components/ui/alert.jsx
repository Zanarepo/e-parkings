// src/components/ui/alert.jsx
import * as React from "react";

export function Alert({ children, className = "", type = "info" }) {
  const colors = {
    info: "bg-blue-50 border-blue-300 text-blue-700",
    success: "bg-green-50 border-green-300 text-green-700",
    warning: "bg-yellow-50 border-yellow-300 text-yellow-700",
    error: "bg-red-50 border-red-300 text-red-700",
  };

  return (
    <div
      className={`border-l-4 p-4 rounded-md ${colors[type] || colors.info} ${className}`}
      role="alert"
    >
      {children}
    </div>
  );
}

export function AlertTitle({ children }) {
  return <h4 className="font-semibold mb-1">{children}</h4>;
}

export function AlertDescription({ children }) {
  return <p className="text-sm">{children}</p>;
}
