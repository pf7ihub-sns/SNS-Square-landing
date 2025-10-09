
"use client";

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, UserPlus, Users, Search, Filter, ChevronLeft } from "lucide-react";
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
    navigate("../login/nurse");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setGenderFilter("");
    setAgeFilter("all");
    setSortBy("name");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20">
      {/* Top Navigation Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate(-1)} 
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                aria-label="Go back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Docsentra</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("../new-patient", { relative: "path" })}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">+ New Patient</span>
                <span className="sm:hidden">+</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 text-gray-700 hover:text-gray-900 font-medium hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        {/* Welcome Section */}
        <div className="mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Welcome, {user.name || "Swetha"}!
          </h2>
          <p className="text-base lg:text-lg text-gray-600">Manage patient registration and records</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 lg:p-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Search and Filter Patients</h3>
          
          {/* Search Bar and Filter Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by patient name or ID..."
                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition-all duration-200 shadow-sm"
              />
            </div>
            <button 
              onClick={clearFilters}
              className="flex items-center justify-center space-x-2 px-5 py-3.5 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm font-medium text-gray-700"
            >
              <Filter className="w-5 h-5 text-gray-600" />
              <span>Filter</span>
            </button>
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
              <select
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm bg-white text-gray-900 font-medium"
              >
                <option value="all">Age Id</option>
                <option value="0">Children (0-17)</option>
                <option value="1">Adults (18-64)</option>
                <option value="2">Seniors (65+)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm bg-white text-gray-900 font-medium"
              >
                <option value="">Age Id</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm bg-white text-gray-900 font-medium"
              >
                <option value="name">Name (A-Z)</option>
                <option value="age">Age (Newest)</option>
                <option value="date">Registration Date</option>
              </select>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              A descriptive body text comes here
            </p>
            {(searchTerm || genderFilter || ageFilter !== "all") && (
              <span className="text-xs text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                Filters Active
              </span>
            )}
          </div>
        </div>

        {/* Patients List Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
          {/* Patients List with PatientList Component */}
          <PatientList patients={filteredPatients} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}