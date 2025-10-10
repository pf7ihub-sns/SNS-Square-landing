"use client";

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Loader2, Sparkles, CheckCircle } from "lucide-react";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [consultLoading, setConsultLoading] = useState(false);
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

  const handleViewPatient = async (patient_id, visit_id) => {
    setConsultLoading(true);
    // Small delay to show the loading animation
    await new Promise(resolve => setTimeout(resolve, 800));
    navigate(`../doctor/visit/${patient_id}/${visit_id}`);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString();
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    
    // Check if the time is midnight (00:00:00), which indicates date-only data
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const seconds = d.getSeconds();
    
    if (hours === 0 && minutes === 0 && seconds === 0) {
      return d.toLocaleDateString();
    } else {
      return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "Not scheduled";
    
    // If it's a time-only string like "14:30"
    if (timeStr.includes(":") && timeStr.length <= 8) {
      return timeStr;
    }
    
    const d = new Date(timeStr);
    if (isNaN(d.getTime())) return timeStr;
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Professional Consultation Loading Screen
  if (consultLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Enhanced Consultation Loader */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="w-32 h-32 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
          
          {/* Inner pulsing circle */}
          <div className="absolute inset-4 w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center animate-pulse shadow-lg">
            <Sparkles className="w-8 h-8 text-white animate-bounce" />
          </div>
          
          {/* Floating particles */}
          <div className="absolute -top-2 -left-2 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping delay-75"></div>
          <div className="absolute -bottom-3 -left-1 w-1 h-1 bg-blue-300 rounded-full animate-ping delay-150"></div>
          <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-blue-600 rounded-full animate-ping delay-300"></div>
        </div>
        
        {/* Professional loading text */}
        <div className="mt-8 text-center">
          <h3 className="text-2xl font-semibold text-slate-800 mb-2 animate-pulse">
            Preparing Consultation
          </h3>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
          <p className="text-slate-600 text-lg font-medium mb-2">
            Setting Up Patient Consultation
          </p>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            Loading patient information and preparing the consultation workspace for optimal care delivery
          </p>
        </div>
        
        {/* Progress steps */}
        <div className="mt-12 flex items-center space-x-8">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mb-2">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-slate-600 font-medium">Patient Selected</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mb-2 animate-pulse">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
            <span className="text-xs text-slate-600 font-medium">Loading Data</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center mb-2">
              <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Starting Session</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-manrope pt-20">
      {/* Back Navigation */}
      <div className="px-6 pt-8 pb-2">
        <button 
          onClick={() => window.location.href = 'http://localhost:5173/agent-playground/agent/Doc-Sentra'}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-900 px-3 py-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium text-base">Back to Home</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="px-6 py-6">
        {/* Main Container Box - Contains Welcome + Patients */}
        <div className="bg-white border border-slate-200 rounded-lg">
          {/* Welcome Section */}
          <div className="p-8 border-b border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                  Welcome, {user.name || "Doctor"}!
                </h1>
                <p className="text-base text-slate-500">
                  Let's provide the best care for your patients today.
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 border border-slate-300 hover:bg-slate-100 text-slate-700 py-2.5 px-5 rounded-lg transition-all duration-200 text-base font-medium shadow-sm hover:shadow"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>

          {/* Patients Section */}
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Your Patients <span className="text-blue-600 text-base ml-2">Total: {patients.length}</span>
              </h2>
              <p className="text-sm text-slate-500">
                Here's the list of patients scheduled for your consultation today.
              </p>
            </div>

            {/* Table or Empty State */}
            {patients.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        S.no
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        Age
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        Gender
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        Scheduled Time
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        Visit Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {paginatedPatients.map((p, index) => (
                      <tr
                        key={p.appointment_id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-slate-700 text-sm">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-4 py-3 text-slate-900 text-sm font-medium">
                          {p.name || "Unknown"}
                        </td>
                        <td className="px-4 py-3 text-slate-700 text-sm">
                          {p.phone || "-"}
                        </td>
                        <td className="px-4 py-3 text-slate-700 text-sm">
                          {p.age || "-"}
                        </td>
                        <td className="px-4 py-3 text-slate-700 text-sm">
                          {p.gender || "-"}
                        </td>
                        <td className="px-4 py-3 text-slate-700 text-sm">
                          {formatTime(p.scheduled_time)}
                        </td>
                        <td className="px-4 py-3 text-slate-700 text-sm">
                          {formatDate(p.visit_date)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleViewPatient(p.patient_id, p.visit_id)}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                          >
                            Consult
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No Patients yet!</h3>
                <p className="text-base text-slate-500">Patient will appear here when they arrive</p>
              </div>
            )}

          {/* Pagination */}
          {patients.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-slate-200">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
              >
                ‹ Back
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-4 py-2 text-sm rounded font-medium transition-colors ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
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
