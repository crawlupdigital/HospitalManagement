import React from 'react';

export const Skeleton = ({ className = '', variant = 'text' }) => {
  const base = 'animate-pulse bg-gray-200 rounded';
  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-10 w-10 rounded-full',
    card: 'h-32 w-full rounded-xl',
    stat: 'h-20 w-full rounded-xl',
    table: 'h-8 w-full',
  };
  return <div className={`${base} ${variants[variant] || variants.text} ${className}`} />;
};

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="space-y-3 p-4">
    <div className="flex gap-4">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex gap-4">
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={c} className="h-6 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export default Skeleton;
