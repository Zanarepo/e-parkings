import React, { useState, createContext, useContext } from "react";

const TabsContext = createContext();

export function Tabs({ defaultValue, value, onValueChange, children, className }) {
  const [activeTab, setActiveTab] = useState(defaultValue || value);

  const handleChange = (val) => {
    setActiveTab(val);
    if (onValueChange) onValueChange(val);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleChange }}>
      <div className={`w-full ${className || ""}`}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }) {
  return <div className={`flex border-b bg-gray-50 rounded-t-lg ${className || ""}`}>{children}</div>;
}

export function TabsTrigger({ value, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`flex-1 px-4 py-3 text-center text-sm font-medium transition-all duration-200
        ${isActive
          ? "border-b-2 border-emerald-600 text-emerald-700 bg-white"
          : "text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
        }`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;
  return <div className={`mt-6 ${className || ""}`}>{children}</div>;
}
