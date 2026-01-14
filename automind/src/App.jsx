import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

// Landing sections
import HeroSection from "./components/landing/HeroSection.jsx";
import FeaturesSection from "./components/landing/FeaturesSection.jsx";
import ProblemSection from "./components/landing/ProblemSection.jsx";
import HowItWorksSection from "./components/landing/HowItWorksSection.jsx";
import StakeholdersSection from "./components/landing/StakeholdersSection.jsx";
import CTASection from "./components/landing/CTASection.jsx";
import Footer from "./components/landing/Footer.jsx";

// Pages
import RoleSelection from "./pages/RoleSelection.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import CustomerServices from "./pages/CustomerServices.jsx";
import CustomerAlerts from "./pages/CustomerAlerts.jsx";
import OEMAnalytics from "./pages/OEMAnalytics.jsx";
import OEMDashboard from "./pages/OEMDashboard.jsx";
import OEMInsights from "./pages/OEMInsights.jsx";
import OEMSecurity from "./pages/OEMSecurity.jsx";
import ServiceDashboard from "./pages/ServiceDashboard.jsx";
import ServiceInventory from "./pages/ServiceInventory.jsx";
import ServiceSchedule from "./pages/ServiceSchedule.jsx";
import ServiceTechnicians from "./pages/ServiceTechnicians.jsx";
import Settings from "./pages/Settings.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// Landing Page Wrapper
function Landing() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ProblemSection />
      <HowItWorksSection />
      <StakeholdersSection />
      <CTASection />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* 🌐 Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔐 Authenticated but role not chosen */}
      <Route
        path="/role-selection"
        element={
          <ProtectedRoute>
            <RoleSelection />
          </ProtectedRoute>
        }
      />

      {/* 🔐 Generic dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* 🔐 CUSTOMER */}
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/services"
        element={
          <ProtectedRoute>
            <CustomerServices />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/alerts"
        element={
          <ProtectedRoute>
            <CustomerAlerts />
          </ProtectedRoute>
        }
      />

      {/* 🔐 OEM */}
      <Route
        path="/oem/dashboard"
        element={
          <ProtectedRoute>
            <OEMDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/oem/analytics"
        element={
          <ProtectedRoute>
            <OEMAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/oem/insights"
        element={
          <ProtectedRoute>
            <OEMInsights />
          </ProtectedRoute>
        }
      />
      <Route
        path="/oem/security"
        element={
          <ProtectedRoute>
            <OEMSecurity />
          </ProtectedRoute>
        }
      />

      {/* 🔐 SERVICE */}
      <Route
        path="/service/dashboard"
        element={
          <ProtectedRoute>
            <ServiceDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/service/inventory"
        element={
          <ProtectedRoute>
            <ServiceInventory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/service/schedule"
        element={
          <ProtectedRoute>
            <ServiceSchedule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/service/technicians"
        element={
          <ProtectedRoute>
            <ServiceTechnicians />
          </ProtectedRoute>
        }
      />

      {/* 🔐 COMMON */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
