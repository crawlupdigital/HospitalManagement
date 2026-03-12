import React from 'react';

const presets = {
  'WAITING': 'bg-yellow-100 text-yellow-700',
  'IN-PROGRESS': 'bg-blue-100 text-blue-700',
  'COMPLETED': 'bg-green-100 text-green-700',
  'CANCELLED': 'bg-red-100 text-red-700',
  'NO-SHOW': 'bg-gray-100 text-gray-500',
  'PENDING': 'bg-yellow-100 text-yellow-700',
  'PAID': 'bg-green-100 text-green-700',
  'PARTIAL': 'bg-orange-100 text-orange-700',
  'DRAFT': 'bg-gray-100 text-gray-600',
  'available': 'bg-green-100 text-green-700',
  'occupied': 'bg-rose-100 text-rose-700',
  'maintenance': 'bg-amber-100 text-amber-700',
  'NORMAL': 'bg-blue-100 text-blue-700',
  'URGENT': 'bg-orange-100 text-orange-700',
  'EMERGENCY': 'bg-red-100 text-red-700',
  'reception': 'bg-gray-100 text-gray-700',
  'triage': 'bg-yellow-100 text-yellow-700',
  'consultation': 'bg-blue-100 text-blue-700',
  'pharmacy': 'bg-purple-100 text-purple-700',
  'nursing': 'bg-rose-100 text-rose-700',
  'lab': 'bg-indigo-100 text-indigo-700',
  'radiology': 'bg-cyan-100 text-cyan-700',
  'billing': 'bg-green-100 text-green-700',
  'discharged': 'bg-emerald-100 text-emerald-700',
  'admitted': 'bg-orange-100 text-orange-700',
};

const StatusBadge = ({ status, className = '', size = 'sm' }) => {
  const colorClass = presets[status] || 'bg-gray-100 text-gray-700';
  const sizeClass = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center rounded-full font-semibold capitalize ${colorClass} ${sizeClass} ${className}`}>
      {status?.replace(/[-_]/g, ' ')}
    </span>
  );
};

export default StatusBadge;
