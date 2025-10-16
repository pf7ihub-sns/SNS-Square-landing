import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NewPatientRegistration from "../pages/Nurse/NewPatientRegistration";
import PatientProfile from "../pages/Nurse/PatientProfile";
import NurseDashboard from "../pages/Nurse/NurseDashboard";
import DoctorDashboard from "../pages/Doctor/DoctorDashboard";
import DoctorRecommendation from "../pages/Nurse/Recommendation";
import DoctorVisit from "../pages/Doctor/DoctorVisit";

// ProtectedRoute component to check authentication and role
function ProtectedRoute({ element, allowedRole }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Check if user is authenticated and has the correct role
  if (!token || !user || user.role !== allowedRole) {
    return <Navigate to={`/login/${allowedRole}`} replace />;
  }

  return element;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login/:role" element={<Login />} />
      <Route path="/nurse/new-patient" element={<NewPatientRegistration />} />
      <Route
        path="/nurse/patient-profile/:patientId"
        element={
          <ProtectedRoute element={<PatientProfile />} allowedRole="nurse" />
        }
      />
      <Route
        path="/nurse/dashboard"
        element={
          <ProtectedRoute element={<NurseDashboard />} allowedRole="nurse" />
        }
      />
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute element={<DoctorDashboard />} allowedRole="doctor" />
        }
      />
      <Route
        path="/doctor/visit/:patientId/:visitId"
        element={
          <ProtectedRoute element={<DoctorVisit />} allowedRole="doctor" />
        }
      />


      <Route
        path="/nurse/recommendation/:patientId"
        element={
          <ProtectedRoute
            element={<DoctorRecommendation />}
            allowedRole="nurse"
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
