import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaBrain, FaStethoscope, FaRegCalendarAlt, FaCheckCircle, } from "react-icons/fa";
import { TbStethoscope } from "react-icons/tb";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DoctorRecommendation() {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const navigate = useNavigate();
  const { patientId } = useParams();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_DOCSENTRA || "http://localhost:8080";

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/appointments/doctors`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to fetch doctors. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

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
        toast.error("Failed to fetch patient data. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
        setLoading(false);
      }
    };

    fetchDoctors();

    if (patientId) {
      fetchPatientData();
    } else {
      setError("Patient ID is missing from the URL. Cannot fetch patient profile.");
      toast.error("Patient ID is missing from the URL.", {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
    }
  }, [patientId, API_BASE_URL]);

  const handleConfirm = async () => {
    if (!selectedDoctor) {
      toast.warning("Please select a doctor to proceed.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!appointmentDate || !appointmentTime) {
      toast.warning("Please select appointment date and time.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!patientId) {
      toast.error("Patient ID is missing. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsScheduling(true);

    try {
      const token = localStorage.getItem("token");
      const scheduledTime = `${appointmentDate}T${appointmentTime}:00Z`;

      const response = await axios.post(`${API_BASE_URL}/appointments/schedule`, {
        patient_id: patientId,
        doctor_id: selectedDoctor,
        scheduled_time: scheduledTime,
        visit_date: appointmentDate
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          'Content-Type': 'application/json'
        },
      });

      console.log("Appointment response:", response.data);

      if (response.data.success || response.status === 200 || response.status === 201) {
        toast.success("Appointment scheduled successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
        setShowSuccessPopup(true);
        setTimeout(() => {
          navigate("../../dashboard", { relative: "path" });
        }, 2000);
      } else {
        toast.error(response.data.message || "Failed to schedule appointment. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error scheduling appointment:", error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.detail
          || error.response.data?.message
          || `Server error: ${error.response.status}`;
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 4000,
        });
      } else if (error.request) {
        // Request made but no response received
        toast.error("No response from server. Please check your connection.", {
          position: "top-right",
          autoClose: 4000,
        });
      } else {
        // Something else happened
        toast.error("Failed to schedule appointment. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setIsScheduling(false);
    }
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "";

  const patientSummaryDisplay = patientData ? {
    full_name: patientData.full_name || "N/A",
    age: patientData.age || "N/A",
    gender: patientData.gender || "N/A",
    mobile_number: patientData.mobile_number || "N/A",
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
    <div className="min-h-screen bg-white py-6 px-4 pt-20 ">
      {/* Toast Container */}
      <ToastContainer />

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl animate-fade-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-green-500 text-5xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Appointment Scheduled!</h3>
            <p className="text-gray-600">Your appointment has been successfully scheduled.</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting to dashboard...</p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto mt-5 bg-white rounded-xl p-4 border  border-[#A4C3FF] transition-all duration-200 shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#155DFC] mb-2">Doctor Recommendation</h1>
          <p className="text-[#000000]">Select a doctor and schedule an appointment</p>
        </div>

        {/* Patient Summary */}
        <section className="mb-6 bg-gray-50 p-5 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Patient Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="font-medium text-[#5F5F60]">Name:</span>{" "}
              <span className="text-[#000000]">{patientSummaryDisplay.full_name}</span>
            </div>
            <div>
              <span className="font-medium text-[#5F5F60]">Age:</span>{" "}
              <span className="text-[#000000]">{patientSummaryDisplay.age}</span>
            </div>
            <div>
              <span className="font-medium text-[#5F5F60]">Gender:</span>{" "}
              <span className="text-[#000000]">{patientSummaryDisplay.gender}</span>
            </div>
            <div>
              <span className="font-medium text-[#5F5F60]">Phone:</span>{" "}
              <span className="text-[#000000]">{patientSummaryDisplay.mobile_number}</span>
            </div>
            <div className="md:col-span-2 lg:col-span-4">
              <span className="font-medium text-[#5F5F60]">Current Problem:</span>{" "}
              <span className="text-[#000000]">{patientSummaryDisplay.otherSymptoms}</span>
            </div>
          </div>
        </section>

        {/* Appointment Schedule */}
        <section className="mb-6 bg-gray-50 p-5 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Schedule Appointment</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
              min={new Date().toISOString().split('T')[0]}
            />
            <input
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            />
          </div>
        </section>

        {/* Available Doctors */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl text-blue-600 bg-blue-100 rounded-full p-2">
              <TbStethoscope />
            </span>
            <h2 className="text-xl font-semibold text-gray-900">Available Doctors</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doc) => (
              <div
                key={doc.doctor_id}
                className={`bg-white rounded-xl p-4 border-2 transition-all duration-200 shadow-sm ${selectedDoctor === doc.doctor_id
                  ? "border-blue-500 shadow-lg ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-blue-400 hover:shadow-md"
                  }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {getInitials(doc.name)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                    <p className="text-[#5F5F60] text-sm font-medium">{doc.specialization}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-[#5F5F60] text-sm">
                    <FaStethoscope className="text-blue-500" />
                    <span>{doc.experience_years} years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#5F5F60] text-sm">
                    <FaRegCalendarAlt className="text-blue-500" />
                    <span>Contact: {doc.phone_number}</span>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name="doctor"
                    value={doc.doctor_id}
                    checked={selectedDoctor === doc.doctor_id}
                    onChange={() => setSelectedDoctor(doc.doctor_id)}
                    className="w-4 h-4 text-blue-600 border-2 border-gray-400 focus:ring-blue-500"
                  />
                  <span className="text-gray-900 font-medium text-sm">Select Doctor</span>
                </label>
              </div>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleConfirm}
            disabled={isScheduling}
          >
            {isScheduling ? (
              <>
                <span className="animate-spin">⏳</span> Scheduling...
              </>
            ) : (
              <>✓ Schedule Appointment</>
            )}
          </button>
          <button
            className="bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            onClick={() =>
              navigate(`/agent-playground/agent/Doc-Sentra/nurse/patient-profile/${patientId}`)
            }
          >
            ← Back to Patient Profile
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default DoctorRecommendation;