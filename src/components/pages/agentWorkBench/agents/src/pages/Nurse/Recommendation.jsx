import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaBrain, FaStethoscope, FaRegCalendarAlt } from "react-icons/fa";
import axios from "axios";

function DoctorRecommendation() {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { patientId } = useParams(); // Correctly extracts patientId from the URL

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_DOCSENTRA || "http://localhost:8080"; // DocSentra API URL

  useEffect(() => {
    // Function to fetch available doctors
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming doctor fetching might also need a token
        const response = await axios.get(`${API_BASE_URL}/appointments/doctors`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        alert("Failed to fetch doctors");
      }
    };

    // Function to fetch patient data using the patientId from URL params
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/patients/${patientId}`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        setPatientData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setError("Failed to fetch patient data. Please try again.");
        setLoading(false);
      }
    };

    fetchDoctors(); // Fetch doctors on component mount
    
    // Fetch patient data only if patientId is available
    if (patientId) {
      fetchPatientData();
    } else {
      setError("Patient ID is missing from the URL. Cannot fetch patient profile.");
      setLoading(false);
    }
  }, [patientId, API_BASE_URL]); // Dependency array includes patientId and API_BASE_URL

  const handleConfirm = async () => {
    if (!selectedDoctor) {
      alert("Please select a doctor to proceed.");
      return;
    }
    if (!appointmentDate || !appointmentTime) {
      alert("Please select appointment date and time.");
      return;
    }
    if (!patientId) {
      alert("Patient ID is missing. Please try again.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const scheduledTime = `${appointmentDate}T${appointmentTime}:00Z`; // Format for backend
      const response = await axios.post(`${API_BASE_URL}/appointments/schedule`, {
        patient_id: patientId,
        doctor_id: selectedDoctor,
        scheduled_time: scheduledTime,
        visit_date: appointmentDate // Added visit_date as per your backend schema
      }, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      if (response.data.success) {
        alert("Appointment scheduled successfully!");
        navigate("../../dashboard", { relative: "path" }); // Redirect to nurse dashboard
      } else {
        alert(response.data.message || "Failed to schedule appointment. Please try again.");
      }
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      alert(error.response?.data?.detail || "Failed to schedule appointment");
    }
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "";

  // Patient summary for display - uses fetched patientData
  // Note: The keys here should match the backend response keys (camelCase or snake_case as they are from the backend)
  const patientSummaryDisplay = patientData ? {
    full_name: patientData.full_name || "N/A",
    age: patientData.age || "N/A",
    gender: patientData.gender || "N/A",
    mobile_number: patientData.mobile_number || "N/A",
    // Ensure 'otherSymptoms' or similar field exists in your backend patient data
    // If it's part of a 'latest_vitals' or 'visits' object, you'll need to adjust how you access it.
    // For now, assuming it's a direct property as it was passed in state previously.
    // If not, you'd need to adapt this, e.g., patientData.latest_vitals?.symptoms || "Not specified"
    otherSymptoms: patientData.symptoms?.join(", ") || patientData.other_symptoms || "Not specified"
  } : {
    full_name: "Loading...",
    age: "Loading...",
    gender: "Loading...",
    mobile_number: "Loading...",
    otherSymptoms: "Loading..."
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-white py-8 px-4 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading patient data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-8 px-4 flex items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Doctor Recommendation</h1>
          <p className="text-gray-600 text-lg">
            Select a doctor and schedule an appointment
          </p>
        </div>

        {/* Patient Summary */}
        <section className="mb-12 bg-gray-50 p-6 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-semibold text-black mb-4">Patient Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <span className="font-medium text-gray-700">Name:</span> {patientSummaryDisplay.full_name}
            </div>
            <div>
              <span className="font-medium text-gray-700">Age:</span> {patientSummaryDisplay.age}
            </div>
            <div>
              <span className="font-medium text-gray-700">Gender:</span> {patientSummaryDisplay.gender}
            </div>
            <div>
              <span className="font-medium text-gray-700">Phone:</span> {patientSummaryDisplay.mobile_number}
            </div>
            <div className="md:col-span-2 lg:col-span-4">
              <span className="font-medium text-gray-700">Current Problem:</span>{" "}
              {patientSummaryDisplay.otherSymptoms}
            </div>
          </div>
        </section>

        {/* Appointment Schedule */}
        <section className="mb-12 bg-gray-50 p-6 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-semibold text-black mb-4">Schedule Appointment</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black flex-1"
              min={new Date().toISOString().split('T')[0]} // Prevents selecting past dates
            />
            <input
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black flex-1"
            />
          </div>
        </section>

        {/* Available Doctors */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl text-black bg-gray-100 rounded-full p-2">
              <FaBrain />
            </span>
            <h2 className="text-2xl font-semibold text-black">Available Doctors</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <div
                key={doc.doctor_id}
                className={`bg-white rounded-2xl p-6 border-2 transition-all duration-200 ${
                  selectedDoctor === doc.doctor_id
                    ? "border-[#003049] shadow-lg"
                    : "border-gray-200 hover:border-[#003049]"
                }`}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-[#003049] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {getInitials(doc.name)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-black text-lg">{doc.name}</h3>
                    <p className="text-gray-700 font-medium">{doc.specialization}</p>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-gray-700">
                    <FaStethoscope className="text-base" />
                    <span className="text-sm">{doc.experience_years} years experience</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <FaRegCalendarAlt className="text-base" />
                    <span className="text-sm">Contact: {doc.phone_number}</span>
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
                  <input
                    type="radio"
                    name="doctor"
                    value={doc.doctor_id}
                    checked={selectedDoctor === doc.doctor_id}
                    onChange={() => setSelectedDoctor(doc.doctor_id)}
                    className="w-4 h-4 text-black border-2 border-gray-400 focus:ring-black"
                  />
                  <span className="text-black font-medium">Select Doctor</span>
                </label>
              </div>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="bg-[#003049] text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-[#00243a] transition-colors shadow-lg"
            onClick={handleConfirm}
          >
            ✓ Schedule Appointment
          </button>
          <button
            className="bg-white border-2 border-[#003049] text-[#003049] px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors"
            onClick={() => navigate(`../patient-profile/${patientId}`)}
          >
            ← Back to Patient Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default DoctorRecommendation;