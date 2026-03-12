import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { 
  LayoutDashboard, 
  Users, 
  Pill, 
  Stethoscope, 
  Microscope,
  CreditCard,
  Settings,
  HeartPulse,
  Activity,
  RadioReceiver,
  Droplet,
  BedDouble,
  ShieldCheck,
  CalendarDays,
  Truck,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const { isSidebarOpen, setSidebarOpen, isSidebarCollapsed, setCollapsed, toggleCollapse } = useUIStore();
  const { user } = useAuthStore();

  // Auto-collapse sidebar on medium screens, hide on mobile
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        // Mobile: close drawer
        setSidebarOpen(false);
        setCollapsed(false);
      } else if (width < 1280) {
        // Tablet / small desktop: collapse to icons
        setSidebarOpen(true);
        setCollapsed(true);
      } else {
        // Large desktop: full sidebar
        setSidebarOpen(true);
        setCollapsed(false);
      }
    };

    handleResize(); // Run on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen, setCollapsed]);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'receptionist'] },
    { name: 'Appointments', href: '/appointments', icon: CalendarDays, roles: ['admin', 'receptionist', 'doctor'] },
    { name: 'Doctor Console', href: '/doctor', icon: Stethoscope, roles: ['admin', 'doctor'] },
    { name: 'Patients Queue', href: '/patients', icon: Users, roles: ['admin', 'receptionist', 'doctor', 'nurse'] },
    { name: 'Pharmacy', href: '/pharmacy', icon: Pill, roles: ['admin', 'pharmacist'] },
    { name: 'Laboratory', href: '/lab', icon: Microscope, roles: ['admin', 'lab_tech'] },
    { name: 'Radiology', href: '/radiology', icon: RadioReceiver, roles: ['admin', 'radiologist'] },
    { name: 'Blood Bank', href: '/bloodbank', icon: Droplet, roles: ['admin', 'lab_tech', 'nurse'] },
    { name: 'Nursing', href: '/nursing', icon: HeartPulse, roles: ['admin', 'nurse'] },
    { name: 'ICU & Beds', href: '/icu', icon: BedDouble, roles: ['admin', 'nurse', 'doctor'] },
    { name: 'Ambulance', href: '/ambulance', icon: Truck, roles: ['admin', 'receptionist', 'ambulance'] },
    { name: 'Billing', href: '/billing', icon: CreditCard, roles: ['admin', 'billing'] },
    { name: 'Insurance Claims', href: '/insurance', icon: ShieldCheck, roles: ['admin', 'billing'] },
    { name: 'Analytics', href: '/analytics', icon: Activity, roles: ['admin'] },
    { name: 'Adoption Reports', href: '/analytics/adoption', icon: Users, roles: ['admin'] },
    { name: 'Query Builder', href: '/analytics/query', icon: Settings, roles: ['admin'] },
    { name: 'My Profile', href: '/settings', icon: User, roles: ['admin', 'receptionist', 'doctor', 'nurse', 'pharmacist', 'lab_tech', 'radiologist', 'billing', 'ambulance'] },
  ];

  // Filter nav items based on user role
  const filteredNav = navigation.filter(item => 
    !item.roles || (user && item.roles.includes(user.role))
  );

  const sidebarWidth = isSidebarCollapsed ? 'w-[72px]' : 'w-64';

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-30 h-full bg-white border-r border-gray-200 
          flex flex-col transition-all duration-300 ease-in-out
          ${sidebarWidth}
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:inset-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center h-16 border-b border-gray-200 px-4 flex-shrink-0">
          <div className={`flex items-center gap-2 ${isSidebarCollapsed ? 'justify-center w-full' : ''}`}>
            <Stethoscope className="w-6 h-6 text-blue-600 flex-shrink-0" />
            {!isSidebarCollapsed && (
              <h1 className="text-xl font-bold font-jakarta text-blue-600 whitespace-nowrap">
                MediFlow HMS
              </h1>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                title={isSidebarCollapsed ? item.name : undefined}
                onClick={() => {
                  // Close drawer on mobile after navigation
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg transition-colors font-medium text-sm
                  ${isSidebarCollapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2'}
                  ${isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isSidebarCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse toggle button — visible on md+ screens */}
        <button
          onClick={toggleCollapse}
          className="hidden md:flex items-center justify-center h-10 border-t border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* User Mini Profile at bottom */}
        {user && (
           <div className={`p-3 border-t border-gray-200 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                 {user.name.charAt(0)}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex-1 min-w-0">
                   <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                   <p className="text-xs text-gray-500 capitalize truncate">{user.role}</p>
                </div>
              )}
           </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
