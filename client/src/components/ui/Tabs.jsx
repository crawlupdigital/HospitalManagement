import React from 'react';

const Tabs = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex border-b border-gray-200 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === (tab.value || tab);
        const label = tab.label || tab;
        const value = tab.value || tab;
        const count = tab.count;
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap
              ${isActive 
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-[1px]' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
          >
            {label}
            {count !== undefined && (
              <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
