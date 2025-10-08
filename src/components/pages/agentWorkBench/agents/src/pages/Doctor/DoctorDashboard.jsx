"use client";

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  // Fetch patients from backend
  const fetchPatients = useCallback(async () => {
    if (!user?.id) {
      console.log("User ID not found, skipping fetch");
      return;
    }

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_DOCSENTRA || "http://localhost:8080";
    console.log("Fetching patients for doctor:", user.id);
    try {
      const res = await fetch(`${API_BASE_URL}/patient-list/${user.id}`);
      const data = await res.json();
      console.log("Received patients data:", data);
      setPatients(data.scheduled_appointments || []); // Updated key
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  }, [user?.id]);

  // Redirect to login if no user or incorrect role & fetch patients once
  useEffect(() => {
    console.log("useEffect triggered. User:", user);
    if (!user || user.role !== "doctor") {
      console.log("User not logged in or incorrect role, redirecting...");
      navigate("../login/doctor", { replace: true });
    } else {
      fetchPatients();
    }
  }, [user?.id, user?.role, navigate, fetchPatients]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("../login/doctor");
  };

  const handleViewPatient = (patient_id, visit_id) => {
    navigate(`../doctor/visit/${patient_id}/${visit_id}`);
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
  <div className="min-h-screen bg-slate-50 p-6 pt-32">
      <header className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center z-20 relative">
        <h1 className="text-2xl font-bold text-[#003049]">Doctor Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </header>

      <main className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Welcome, {user.name || "Doctor"}!
        </h2>

        <h3 className="text-lg font-medium text-slate-900 mb-4">Your Patients</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-slate-300 text-center">
            <thead className="bg-slate-100">
              <tr>
                <th className="py-3 px-4 border-b">S. No</th>
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Phone</th>
                <th className="py-3 px-4 border-b">Age</th>
                <th className="py-3 px-4 border-b">Gender</th>
                <th className="py-3 px-4 border-b">Scheduled Time</th>
                <th className="py-3 px-4 border-b">Visit Date</th>
                <th className="py-3 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.map((p, index) => (
                  <tr key={p.appointment_id} className="hover:bg-slate-50">
                    <td className="py-2 px-4 border-b">{index + 1}</td>
                    <td className="py-2 px-4 border-b">{p.name || "Unknown"}</td>
                    <td className="py-2 px-4 border-b">{p.phone || "-"}</td>
                    <td className="py-2 px-4 border-b">{p.age || "-"}</td>
                    <td className="py-2 px-4 border-b">{p.gender || "-"}</td>
                    <td className="py-2 px-4 border-b">{formatDateTime(p.scheduled_time)}</td>
                    <td className="py-2 px-4 border-b">{formatDateTime(p.visit_date)}</td>
                    <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleViewPatient(p.patient_id, p.visit_id)}
                      className="bg-[#003049] hover:bg-teal-900 text-white py-1 px-3 rounded-lg"
                    >
                      Consult
                    </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-slate-600">
                    No patients assigned
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
