
"use client";

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, UserPlus, Users, Search, Filter } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Sidebar */}
  <div className="w-80 bg-white shadow-xl border-r border-gray-200 fixed left-0 top-0 h-full z-30">
  <div className="p-6 pt-29">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#669BBC] rounded-xl mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Nurse Dashboard</h1>
            <p className="text-sm text-gray-600">Manage patient records</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate("../new-patient", { relative: "path" })}
              className="w-full flex items-center p-4 rounded-xl bg-blue-50 border-2 border-blue-200 shadow-sm hover:bg-blue-100 transition-all duration-200 cursor-pointer"
            >
              <UserPlus className="w-5 h-5 text-[#003049] mr-3" />
              <div className="flex-1 text-left">
                <div className="font-semibold text-sm text-[#003049]">New Patient</div>
                <div className="text-xs text-gray-500 mt-1">Register a new patient</div>
              </div>
            </button>
          </div>
        </div>
      </div>

  {/* Main Content */}
  <div className="flex-1 ml-80 p-8 pt-40">
        <header className="bg-gradient-to-r from-[#003049] to-[#669BBC] rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome, {user.name || "Nurse"}!</h1>
              <p className="text-blue-100 text-sm mt-1">Manage patient registrations and records</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl transition-all duration-200 animate-pop"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          {/* Search and Filter Section */}
          <div className="mb-6">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h3 className="text-lg font-medium text-[#003049] mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Search & Filter Patients
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Search className="w-4 h-4 mr-2 text-gray-500" />
                    Search by Name or ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search patients..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Gender Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Age Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
                  <select
                    value={ageFilter}
                    onChange={(e) => setAgeFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="all">All Ages</option>
                    <option value="0">Children (0-17)</option>
                    <option value="1">Adults (18-64)</option>
                    <option value="2">Seniors (65+)</option>
                  </select>
                </div>
              </div>

              {/* Sort Options */}
              <div className="mt-4 flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="age">Age (Newest)</option>
                  <option value="date">Registration Date (Newest)</option>
                </select>

                {/* Clear Filters Button */}
                {(searchTerm || genderFilter || ageFilter !== "all" || sortBy !== "name") && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Results Count */}
              <div className="mt-3 text-sm text-gray-600">
                Showing {filteredPatients.length} of {patients.length} patients
              </div>
            </div>
          </div>

          {/* Patients Section */}
          <h3 className="text-lg font-medium text-[#003049] mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            All Patients ({filteredPatients.length})
          </h3>
          <PatientList patients={filteredPatients} loading={loading} error={error} />
        </main>
      </div>
    </div>
  );
}