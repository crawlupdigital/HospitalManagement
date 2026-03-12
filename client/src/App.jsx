import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

// Layouts
import AppLayout from './components/layout/AppLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
// Placeholder pages for core features
import PatientsPage from './pages/patients/PatientsPage';
import PharmacyPage from './pages/pharmacy/PharmacyPage';
import LabPage from './pages/lab/LabPage';
import RadiologyPage from './pages/lab/RadiologyPage';
import BloodBankPage from './pages/bloodbank/BloodBankPage';
import ICUDashboard from './pages/icu/ICUDashboard';
import BillingPage from './pages/billing/BillingPage';
import InsurancePage from './pages/billing/InsurancePage';
import DoctorDashboard from './pages/dashboard/DoctorDashboard';
import ConsultationPage from './pages/doctor/ConsultationPage';
import NursingDashboard from './pages/nursing/NursingDashboard';
import AppointmentsPage from './pages/appointments/AppointmentsPage';
import AmbulancePage from './pages/ambulance/AmbulancePage';
import SettingsPage from './pages/settings/SettingsPage';
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard';
import FeatureAdoptionPage from './pages/analytics/FeatureAdoptionPage';
import QueryBuilderPage from './pages/analytics/QueryBuilderPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
     return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route Wrapper
const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuthStore();
    
    if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    
    if (isAuthenticated) return <Navigate to="/dashboard" replace />;
    
    return children;
};

function App() {
  const { fetchUser, token } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token, fetchUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="doctor" element={<DoctorDashboard />} />
          <Route path="doctor/consultation/:id" element={<ConsultationPage />} />
          
          <Route path="patients" element={<PatientsPage />} />
          <Route path="nursing" element={<NursingDashboard />} />
          <Route path="pharmacy" element={<PharmacyPage />} />
          <Route path="lab" element={<LabPage />} />
          <Route path="radiology" element={<RadiologyPage />} />
          <Route path="bloodbank" element={<BloodBankPage />} />
          <Route path="icu" element={<ICUDashboard />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="insurance" element={<InsurancePage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="ambulance" element={<AmbulancePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="analytics/adoption" element={<FeatureAdoptionPage />} />
          <Route path="analytics/query" element={<QueryBuilderPage />} />
          
          {/* Catch all */}
          <Route path="*" element={<div className="p-8">404 - Page Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
