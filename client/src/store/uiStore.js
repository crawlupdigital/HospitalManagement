import { create } from 'zustand';

// Simple store to control UI states like sidebar visibility
export const useUIStore = create((set) => ({
  isSidebarOpen: true,        // For mobile: drawer open/close
  isSidebarCollapsed: false,  // For desktop/tablet: collapsed to icon-only
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  toggleCollapse: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
}));
