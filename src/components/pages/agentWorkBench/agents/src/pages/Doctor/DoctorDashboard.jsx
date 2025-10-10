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
    
    // For UTC dates (ending with Z), use UTC date
    if (dateStr.includes('Z')) {
      return d.toLocaleDateString('en-US', { 
        timeZone: 'UTC',
        month: 'numeric',
        day: 'numeric', 
        year: 'numeric' 
      });
    }
    
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
    
    // Parse the datetime string and extract time
    const d = new Date(timeStr);
    if (isNaN(d.getTime())) return "Invalid time";
    
    // For UTC times (ending with Z), we want to show the actual UTC time, not local time
    if (timeStr.includes('Z')) {
      // Extract hours and minutes from UTC time
      const hours = d.getUTCHours();
      const minutes = d.getUTCMinutes();
      
      // Format in 12-hour format
      const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedMinutes = minutes.toString().padStart(2, '0');
      
      return `${hour12}:${formattedMinutes} ${ampm}`;
    }
    
    // For non-UTC times, use local time
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
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
      <div className="px-6 pt-6 pb-1">
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
      <main className="mx-auto px-6 lg:px-8 py-2 lg:py-3" style={{ maxWidth: '89rem' }}>
        {/* Card 1: Welcome Section */}
        <div className="bg-white rounded-xl border-1 border-[#B6B9BE] p-6 lg:p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left Side - Welcome Text */}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                Welcome, {user.name || "Doctor"}!
              </h2>
              <p className="text-base text-slate-500 font-regular">Let's provide the best care for your patients today.</p>
            </div>
          </div>
        </div>

        {/* Card 2: Patients Section */}
        <div className="bg-white rounded-xl border-1 border-[#B6B9BE] p-6 lg:p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            {/* Left Side - Section Info */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Your Patients <span className="text-blue-600 text-base ml-2">Total: {patients.length}</span>
              </h3>
              <p className="text-sm text-gray-600">Here's the list of patients scheduled for your consultation today.</p>
            </div>
          </div>

          {/* Divider Line */}
          <div className="border-t border-gray-200 mb-8"></div>

            {/* Table or Empty State */}
            {patients.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-left text-[17px] font-semibold text-slate-1000">
                        S.no
                      </th>
                      <th className="px-4 py-3 text-left text-[17px] font-semibold text-slate-1000">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-[17px] font-semibold text-slate-1000">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-[17px] font-semibold text-slate-1000">
                        Age
                      </th>
                      <th className="px-4 py-3 text-left text-[17px] font-semibold text-slate-1000">
                        Gender
                      </th>
                      <th className="px-4 py-3 text-left text-[17px] font-semibold text-slate-1000">
                        Scheduled Time
                      </th>
                      <th className="px-4 py-3 text-left text-[17px] font-semibold text-slate-1000">
                        Visit Date
                      </th>
                      <th className="px-4 py-3 text-left text-[17px] font-semibold text-slate-1000">
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
                        <td className="px-4 py-3 text-slate-1000 text-[16px] font-regular">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-4 py-3 text-slate-900 text-[16px] font-medium">
                          {p.name || "Unknown"}
                        </td>
                        <td className="px-4 py-3 text-slate-700 text-[16px] font-regular">
                          {p.phone || "-"}
                        </td>
                        <td className="px-4 py-3 text-slate-700 text-[16px] font-regular">
                          {p.age || "-"}
                        </td>
                        <td className="px-4 py-3 text-slate-700 text-[16px] font-regular">
                          {p.gender || "-"}
                        </td>
                        <td className="px-4 py-3 text-slate-700 text-[16px] font-regular">
                          {formatTime(p.scheduled_time)}
                        </td>
                        <td className="px-4 py-3 text-slate-700 text-[16px] font-regular">
                          {formatDate(p.scheduled_time)}
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

          {/* Logout Button - Below Pagination */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex justify-left">
            <button
              onClick={handleLogout}
              className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
