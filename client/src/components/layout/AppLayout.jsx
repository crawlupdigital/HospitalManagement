import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
const AppLayout = () => {
  const { isSidebarOpen } = useUIStore();
  const { user } = useAuthStore();

  React.useEffect(() => {
     if (!user) return;

     const socket = io(SOCKET_URL, {
        auth: {
           token: localStorage.getItem('auth_token')
        }
     });

     socket.on('connect', () => {
         console.log('Connected to real-time server', socket.id);
         // Join the role channel so we get targeted notifications
         if (user.role) {
           socket.emit('join-role', user.role);
         }
         if (user.id) {
           socket.emit('join-user', user.id);
         }
     });

     socket.on('new_order', (data) => {
         // If user is pharmacist/lab_tech and the route matches their dept
         if (['pharmacist', 'lab_tech', 'admin', 'radiologist', 'nurse'].includes(user.role)) {
             toast(`New Order: ${data.message}`, {
                 icon: '🔔',
                 duration: 6000,
             });
         }
     });

     socket.on('stage_update', (data) => {
         // E.g. notify nurses/doctors when patient arrives
         if (['doctor', 'nurse', 'admin'].includes(user.role)) {
             toast(`Patient Update: ${data.message || data.stage}`, {
                 icon: '👤',
             });
         }
     });

     return () => {
         socket.disconnect();
     };
  }, [user]);

  return (
    <div className="flex h-screen bg-neutral-50 font-sans text-gray-900">
      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" />
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-0' : 'ml-0'}`}>
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
