import React from 'react';

const EmptyState = ({ icon: Icon, title, message, action, className = '' }) => (
  <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
    {Icon && (
      <div className="p-4 bg-gray-100 rounded-full mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-gray-700 mb-1">{title || 'No data found'}</h3>
    {message && <p className="text-sm text-gray-500 text-center max-w-sm">{message}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
