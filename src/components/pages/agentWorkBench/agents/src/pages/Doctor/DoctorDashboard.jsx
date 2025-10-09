"use client";

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
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

  const totalPages = Math.ceil(patients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPatients = patients.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-manrope pt-20">
      {/* Back Navigation */}
      <div className="px-6 pt-8 pb-2">
        <button 
          onClick={() => window.location.href = 'http://localhost:5173/agent-playground/agent/Doc-Sentra'}
          className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium text-sm">Back to Home</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="px-6 py-6">
        {/* Main Container Box - Contains Welcome + Patients */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
          {/* Welcome Section */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                  Welcome, {user.name || "Doctor"}!
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Let's provide the best care for your patients today.
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Patients Section */}
          <div className="p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                Your Patients <span className="text-blue-600 dark:text-blue-400 text-sm ml-2">Total: {patients.length}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Here's the list of patients scheduled for your consultation today.
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                    S.no
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Age
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Gender
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Scheduled Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Visit Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800">
                {paginatedPatients.length > 0 ? (
                  paginatedPatients.map((p, index) => (
                    <tr
                      key={p.appointment_id}
                      className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300 text-xs">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-4 py-3 text-slate-900 dark:text-slate-100 text-xs font-medium">
                        {p.name || "Unknown"}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300 text-xs">
                        {p.phone || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300 text-xs">
                        {p.age || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300 text-xs">
                        {p.gender || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300 text-xs">
                        {formatDateTime(p.scheduled_time)}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300 text-xs">
                        {formatDateTime(p.visit_date)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleViewPatient(p.patient_id, p.visit_id)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-medium text-xs transition-colors"
                        >
                          Consult
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm"
                    >
                      No patients assigned
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {patients.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
              >
                ‹ Back
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Next ›
              </button>
            </div>
          )}
          </div>
        </div>
      </main>
    </div>
  );
}