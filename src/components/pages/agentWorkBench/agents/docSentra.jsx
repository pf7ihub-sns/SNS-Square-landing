import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './src/pages/Home';
import Login from './src/pages/Login';
import NewPatientRegistration from './src/pages/Nurse/NewPatientRegistration';
import PatientProfile from './src/pages/Nurse/PatientProfile';
import NurseDashboard from './src/pages/Nurse/NurseDashboard';
import DoctorDashboard from './src/pages/Doctor/DoctorDashboard';
import DoctorRecommendation from './src/pages/Nurse/Recommendation';
import DoctorVisit from './src/pages/Doctor/DoctorVisit';
import AIsuggestion from './src/pages/Doctor/AIsuggestions';
import './src/App.css';
import './src/index.css';

// ProtectedRoute component to check authentication and role
function ProtectedRoute({ element, allowedRole }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  
  // Check if user is authenticated and has the correct role
  if (!token || !user || user.role !== allowedRole) {
    return <Navigate to={`login/${allowedRole}`} replace />;
  }

  return element;
}

const DocSentra = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="docsentra-wrapper" style={{ width: '100%', height: '100vh', overflow: 'auto' }}>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="login/:role" element={<Login />} />
        {/* If the path is exactly /nurse/new-patient, show the registration form as the default */}
        <Route path="nurse/new-patient" element={<NewPatientRegistration />} />
        <Route path="nurse/new-patient/*" element={<NewPatientRegistration />} />
        <Route
          path="nurse/patient-profile/:patientId"
          element={
            <ProtectedRoute element={<PatientProfile />} allowedRole="nurse" />
          }
        />
        <Route
          path="nurse/dashboard"
          element={
            <ProtectedRoute element={<NurseDashboard />} allowedRole="nurse" />
          }
        />
        <Route
          path="doctor/dashboard"
          element={
            <ProtectedRoute element={<DoctorDashboard />} allowedRole="doctor" />
          }
        />
        <Route
          path="doctor/visit/:patientId/:visitId"
          element={
            <ProtectedRoute element={<DoctorVisit />} allowedRole="doctor" />
          }
        />
        <Route
          path="doctor/visit/:patientId/:visitId/suggestion"
          element={
            <ProtectedRoute element={<AIsuggestion />} allowedRole="doctor" />
          }
        />
        <Route
          path="nurse/recommendation/:patientId"
          element={
            <ProtectedRoute
              element={<DoctorRecommendation />}
              allowedRole="nurse"
            />
          }
        />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </div>
  );
};

export default DocSentra;