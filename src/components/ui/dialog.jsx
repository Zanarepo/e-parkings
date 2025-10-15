import * as React from "react";

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl mx-4 relative">
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl"
          onClick={() => onOpenChange(false)}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export function DialogTrigger({ asChild, children }) {
  return <>{children}</>;
}

export function DialogContent({ children, className }) {
  return <div className={`p-6 ${className || ""}`}>{children}</div>;
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-xl font-bold text-gray-900">{children}</h2>;
}

export function DialogDescription({ children }) {
  return <p className="text-gray-600">{children}</p>;
}
