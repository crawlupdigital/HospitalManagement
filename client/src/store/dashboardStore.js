import { create } from 'zustand';

const useDashboardStore = create((set) => ({
  stats: {
    total_patients: 0,
    today_appointments: 0,
    total_revenue: 0,
    bed_occupancy: { occupied: 0, total: 0, rate: 0 }
  },
  patientFlow: [],
  departmentLoad: [],
  revenueChart: [],
  recentActivity: [],
  isConnected: false,
  isLoading: true,

  setStats: (stats) => set({ stats }),
  setPatientFlow: (flow) => set({ patientFlow: flow }),
  setDepartmentLoad: (load) => set({ departmentLoad: load }),
  setRevenueChart: (data) => set({ revenueChart: data }),
  setRecentActivity: (data) => set({ recentActivity: data }),
  setConnected: (val) => set({ isConnected: val }),
  setLoading: (val) => set({ isLoading: val }),
}));

export default useDashboardStore;
