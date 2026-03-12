import React from 'react';
import { Card, CardContent } from './Card';
import { useNavigate } from 'react-router-dom';

const ClickableStat = ({ title, value, icon: Icon, colorClass = 'bg-blue-100 text-blue-600', onClick, href, trend, loading, className = '' }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) onClick();
    else if (href) navigate(href);
  };

  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 border ${className}`}
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold font-jakarta text-gray-900">
              {loading ? <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" /> : value}
            </h3>
          </div>
          {Icon && (
            <div className={`p-3 rounded-xl ${colorClass}`}>
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>
        {trend !== undefined && !loading && (
          <div className="mt-3 flex items-center text-sm">
            <span className={trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'}>
              {trend > 0 ? '↑ +' : trend < 0 ? '↓ ' : ''}{Math.abs(trend)}%
            </span>
            <span className="text-gray-400 ml-2">vs last week</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClickableStat;
