import React from 'react';
import { Menu, Bell, User as UserIcon, LogOut } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';

const Topbar = () => {
  const { toggleSidebar } = useUIStore();
  const { logout, user } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
        {/* Can put a global search bar here later */}
        <h2 className="hidden md:block text-xl font-semibold font-jakarta text-gray-800 capitalize">
            {/* Dynamic Title mapping based on route could go here */}
            Overview
        </h2>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          {/* Badge */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

        <button 
            onClick={logout}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
        >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
