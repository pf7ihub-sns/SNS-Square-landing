
"use client";

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, UserPlus, Users, Search, Filter, ChevronLeft, ChevronDown, X, ArrowDownAZ } from "lucide-react";
import PatientList from "../components/PatientList";

export default function NurseDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name"); // name, age, date
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Redirect to login if no user or incorrect role
  useEffect(() => {
    if (!user || user.role !== "nurse") {
      navigate("../login/nurse", { replace: true });
    }
  }, [user, navigate]);

  // Fetch patients from backend
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_DOCSENTRA || "http://localhost:8080";
        const response = await fetch(`${API_BASE_URL}/patients/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }
        const data = await response.json();
        setPatients(data);
        setFilteredPatients(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter and sort patients
  useEffect(() => {
    let filtered = [...patients];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((patient) =>
        patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Gender filter
    if (genderFilter) {
      filtered = filtered.filter((patient) => patient.gender === genderFilter);
    }

    // Age filter
    if (ageFilter !== "all") {
      const age = parseInt(ageFilter);
      filtered = filtered.filter((patient) => {
        const patientAge = parseInt(patient.age);
        if (age === 0) return patientAge < 18; // Children
        if (age === 1) return patientAge >= 18 && patientAge < 65; // Adults
        if (age === 2) return patientAge >= 65; // Seniors
        return false;
      });
    }

    // Sort patients
    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.full_name.localeCompare(b.full_name);
      } else if (sortBy === "age") {
        return parseInt(b.age) - parseInt(a.age);
      } else if (sortBy === "date") {
        return new Date(b.registration_timestamp) - new Date(a.registration_timestamp);
      }
      return 0;
    });

    setFilteredPatients(filtered);
  }, [searchTerm, genderFilter, ageFilter, sortBy, patients]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/agent-playground/agent/Doc-Sentra/");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setGenderFilter("");
    setAgeFilter("all");
    setSortBy("name");
  };

  const applyFilters = () => {
    setIsFilterOpen(false);
  };

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
      <div className="mx-auto px-6 lg:px-8 py-2 lg:py-3" style={{ maxWidth: '89rem' }}>
        {/* Card 1: Welcome Section */}
        <div className="bg-white rounded-xl border-1 border-[#B6B9BE] p-6 lg:p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left Side - Welcome Text */}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                Welcome, {user.name || "Swetha"}!
              </h2>
              <p className="text-base text-slate-500 font-regular">Manage patient registration and records</p>
            </div>

            {/* Right Side - Action Button */}
            <div className="flex items-center gap-3 lg:flex-shrink-0">
              <button
                onClick={() => navigate("../new-patient", { relative: "path" })}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg  transition-all duration-200 transform"
              >
                <span>New Patient</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Search and Filter Section */}
        <div className="bg-white rounded-xl  border-1 border-[#B6B9BE] p-6 lg:p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            {/* Left Side - Section Info */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Search and Filter Patients</h3>
              <p className="text-sm text-gray-600">A descriptive body text comes here</p>
            </div>

            {/* Right Side - Search Bar, Sort and Filter Buttons */}
            <div className="flex items-center gap-3 lg:w-auto w-full">
              <div className="flex-1 relative lg:min-w-[400px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search"
                  style={{ backgroundColor: '#F3F7FF' }}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-blue-600 transition-all duration-200"
                />
              </div>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-3 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700 font-medium transition-all duration-200 cursor-pointer hover:border-gray-400"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="age">Age</option>
                  <option value="date">Date</option>
                </select>
                <ArrowDownAZ className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 pointer-events-none" />
              </div>

              {/* Filter Button */}
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center justify-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-gray-700 whitespace-nowrap"
              >
                <Filter className="w-4 h-4 text-gray-600" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Divider Line */}
          <div className="border-t border-gray-200 mb-8"></div>

          {/* Patients List Section - Inside Card 2 */}
          <PatientList patients={filteredPatients} loading={loading} error={error} />
          
          {/* Logout Button - Below Pagination */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-left">
            <button
              onClick={handleLogout}
              className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Filter Modal Popup */}
        {isFilterOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  aria-label="Close filter"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Filter Options */}
              <div className="space-y-5">
                {/* Gender Filter */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Gender</label>
                  <select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 font-medium appearance-none"
                  >
                    <option value="">All</option> 
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute right-3 top-[calc(50%+12px)] -translate-y-1/2 rounded-md p-1.5 pointer-events-none flex items-center justify-center" style={{ backgroundColor: '#EFEFEF' }}>
                    <ChevronDown className="w-5 h-5" style={{ color: '#555E67' }} />
                  </div>
                </div>

                {/* Age Group Filter */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Age Group</label>
                  <select
                    value={ageFilter}
                    onChange={(e) => setAgeFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 font-medium appearance-none"
                  >
                    <option value="all">Adults</option>
                    <option value="0">Children (0-17)</option>
                    <option value="1">Adults (18-64)</option>
                    <option value="2">Seniors (65+)</option>
                  </select>
                  <div className="absolute right-3 top-[calc(50%+12px)] -translate-y-1/2 rounded-md p-1.5 pointer-events-none flex items-center justify-center" style={{ backgroundColor: '#EFEFEF' }}>
                    <ChevronDown className="w-5 h-5" style={{ color: '#555E67' }} />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={applyFilters}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-semibold"
                >
                  Apply Filters
                </button>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}