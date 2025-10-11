import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { SquareChevronLeft } from 'lucide-react';
import { FaCheckCircle } from 'react-icons/fa';
import moment from "moment";

// --- Sub-components for repeatable elements ---
const MedicationInput = ({ medication, index, onChange, onRemove, readOnly = false }) => (
  <div className="flex gap-2 mb-2 items-center">
    <input
      type="text"
      name="drugName"
      value={medication.drugName || ""}
      onChange={(e) => onChange(index, e)}
      placeholder="Drug name"
      className={`flex-1 p-2 border rounded ${readOnly ? 'bg-gray-100' : ''}`}
      readOnly={readOnly}
    />
    <input
      type="text"
      name="dosage"
      value={medication.dosage || ""}
      onChange={(e) => onChange(index, e)}
      placeholder="Dosage"
      className={`flex-1 p-2 border rounded ${readOnly ? 'bg-gray-100' : ''}`}
      readOnly={readOnly}
    />
    <input
      type="text"
      name="duration"
      value={medication.duration || ""}
      onChange={(e) => onChange(index, e)}
      placeholder="Duration"
      className={`flex-1 p-2 border rounded ${readOnly ? 'bg-gray-100' : ''}`}
      readOnly={readOnly}
    />
    {!readOnly && (
      <button type="button" onClick={() => onRemove(index)} className="text-red-500 hover:text-red-700 p-1">
        <i className="fas fa-times"></i>
      </button>
    )}
  </div>
);

const LabResultInput = ({ result, index, onChange, onRemove, readOnly = false }) => (
  <div className="flex flex-wrap md:flex-nowrap gap-2 mb-2 items-center">
    <input type="text" name="testName" value={result.testName || ""} onChange={(e) => onChange(index, e)} placeholder="Test Name" className={`flex-1 p-2 border rounded ${readOnly ? 'bg-gray-100' : ''}`} readOnly={readOnly} />
    <input type="text" name="value" value={result.value || ""} onChange={(e) => onChange(index, e)} placeholder="Value" className={`flex-1 p-2 border rounded ${readOnly ? 'bg-gray-100' : ''}`} readOnly={readOnly} />
    <input type="text" name="unit" value={result.unit || ""} onChange={(e) => onChange(index, e)} placeholder="Unit" className={`w-20 p-2 border rounded ${readOnly ? 'bg-gray-100' : ''}`} readOnly={readOnly} />
    <input type="date" name="resultDate" value={moment(result.resultDate).format("YYYY-MM-DD") || ""} onChange={(e) => onChange(index, e)} className={`w-32 p-2 border rounded ${readOnly ? 'bg-gray-100' : ''}`} readOnly={readOnly} />
    {!readOnly && (
      <button type="button" onClick={() => onRemove(index)} className="text-red-500 hover:text-red-700 p-1">
        <i className="fas fa-times"></i>
      </button>
    )}
  </div>
);

const PrescriptionInput = ({ prescription, index, onChange, onRemove, readOnly = false }) => (
  <div className="flex flex-wrap md:flex-nowrap gap-2 mb-2 items-center">
    <input type="text" name="medication" value={prescription.medication || ""} onChange={(e) => onChange(index, e)} placeholder="Medication" className={`flex-1 p-2 border rounded ${readOnly ? 'bg-gray-100' : ''}`} readOnly={readOnly} />
    <input type="text" name="dosage" value={prescription.dosage || ""} onChange={(e) => onChange(index, e)} placeholder="Dosage" className={`flex-1 p-2 border rounded ${readOnly ? 'bg-gray-100' : ''}`} readOnly={readOnly} />
    <input type="text" name="frequency" value={prescription.frequency || ""} onChange={(e) => onChange(index, e)} placeholder="Frequency" className={`flex-1 p-2 border rounded ${readOnly ? 'bg-gray-100' : ''}`} readOnly={readOnly} />
    <input type="text" name="duration" value={prescription.duration || ""} onChange={(e) => onChange(index, e)} placeholder="Duration" className={`flex-1 p-2 border rounded ${readOnly ? 'bg-gray-100' : ''}`} readOnly={readOnly} />
    {!readOnly && (
      <button type="button" onClick={() => onRemove(index)} className="text-red-500 hover:text-red-700 p-1">
        <i className="fas fa-times"></i>
      </button>
    )}
  </div>
);

const VisitDetailsDisplay = ({ visit, isExpanded, onToggleExpand, visitNumber }) => (
  <div className="border border-gray-300 p-4 rounded-lg bg-white shadow-sm mb-2">
    <div className="flex justify-between items-center cursor-pointer" onClick={onToggleExpand}>
      <h3 className="text-md font-semibold text-gray-800">
        <i className="fas fa-calendar-check mr-2 text-blue-600"></i>
        Visit #{visitNumber} - {moment(visit.visitDate).format("YYYY-MM-DD")} - {visit.reasonForVisit}
      </h3>
      <i className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} text-gray-500`}></i>
    </div>
    {isExpanded && (
      <div className="mt-4 text-sm text-gray-700 border-t pt-4">
        <p className="mb-2"><strong>Doctor Notes:</strong> {visit.doctorNotes || "N/A"}</p>
        {visit.vitals && Object.values(visit.vitals).some(v => v !== null && v !== "" && v !== undefined) && (
          <div className="mb-2">
            <strong className="text-gray-800">Vitals:</strong>
            <ul className="list-disc list-inside ml-4">
              {visit.vitals.bloodPressure && <li>BP: {visit.vitals.bloodPressure}</li>}
              {visit.vitals.pulseRate && <li>HR: {visit.vitals.pulseRate} bpm</li>}
              {visit.vitals.temperature && <li>Temp: {visit.vitals.temperature}°C</li>}
              {visit.vitals.spo2 && <li>SpO₂: {visit.vitals.spo2}%</li>}
              {visit.vitals.weight && <li>Weight: {visit.vitals.weight} kg</li>}
              {visit.vitals.height && <li>Height: {visit.vitals.height} cm</li>}
              {visit.vitals.bmi && <li>BMI: {visit.vitals.bmi}</li>}
            </ul>
          </div>
        )}
        {visit.labResults && visit.labResults.length > 0 && (
          <div className="mb-2">
            <strong className="text-gray-800">Lab Results:</strong>
            <ul className="list-disc list-inside ml-4">
              {visit.labResults.map((lr, i) => (
                <li key={i}>{lr.testName}: {lr.value} {lr.unit} ({moment(lr.resultDate).format("YYYY-MM-DD")})</li>
              ))}
            </ul>
          </div>
        )}
        {visit.prescriptions && visit.prescriptions.length > 0 && (
          <div className="mb-2">
            <strong className="text-gray-800">Prescriptions:</strong>
            <ul className="list-disc list-inside ml-4">
              {visit.prescriptions.map((p, i) => (
                <li key={i}>{p.medication} {p.dosage} {p.frequency} ({p.duration})</li>
              ))}
            </ul>
          </div>
        )}
        {visit.lifestyleSuggestions && <p className="mb-2"><strong>Lifestyle Suggestions:</strong> {visit.lifestyleSuggestions}</p>}
      </div>
    )}
  </div>
);

const PatientProfile = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showAddVisitModal, setShowAddVisitModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successType, setSuccessType] = useState(""); // "profile" or "visit"
  const [activeTab, setActiveTab] = useState("overview");
  const [newVisitData, setNewVisitData] = useState({
    visitDate: moment().format("YYYY-MM-DD"),
    reasonForVisit: "",
    doctorNotes: "",
    vitals: {},
    labResults: [],
    prescriptions: [],
    lifestyleSuggestions: ""
  });
  const [expandedVisits, setExpandedVisits] = useState({});

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_DOCSENTRA || "http://localhost:8080";

  const fetchPatientData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/patients/${patientId}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      const backendData = response.data;
      console.log("Backend data received:", backendData); // Debug log
      
      // Extract nested data structures
      const medicalHistory = backendData.medicalHistory || {};
      const currentHealth = backendData.currentHealth || {};
      const lifestyle = backendData.lifestyle || {};
      const visitHistory = backendData.visitHistory || {};
      
      console.log("Nested data structures:", {
        medicalHistory,
        currentHealth,
        lifestyle,
        visitHistory
      });
      
      const transformedData = {
        fullName: backendData.full_name || "",
        patientId: backendData.patient_id,
        abhaId: backendData.abha_id || "",
        gender: backendData.gender || "",
        dateOfBirth: backendData.dob || "",
        age: backendData.age || 0,
        maritalStatus: backendData.marital_status || "",
        bloodGroup: backendData.blood_group || "",
        occupation: backendData.occupation || "",
        mobileNumber: backendData.mobile_number || "",
        alternateNumber: backendData.alternate_number || "",
        addressLine1: backendData.address_line_1 || "",
        addressLine2: backendData.address_line_2 || "",
        city: backendData.city || "",
        district: backendData.district || "",
        state: backendData.state || "",
        pinCode: backendData.pin_code || "",
        emergencyContactName: backendData.emergency_name || "",
        emergencyContactRelation: backendData.emergency_relation || "",
        emergencyContactPhone: backendData.emergency_phone || "",
        aadhaarNumber: backendData.aadhaar_number || "",
        insuranceProvider: backendData.insurance_provider || "",
        policyNumber: backendData.policy_number || "",
        idVerified: backendData.id_verified || false,
        consentTaken: backendData.consent_taken || false,
        nurseId: backendData.nurse_id || "",
        nurseName: backendData.nurse_name || "",
        
        // Current Health - from nested currentHealth object
        latestVitals: currentHealth.latestVitals || backendData.latest_vitals || {},
        symptoms: currentHealth.currentSymptoms || backendData.symptoms || [],
        otherSymptoms: currentHealth.otherSymptoms || backendData.other_symptoms || "",
        durationOfComplaint: currentHealth.durationOfComplaint || backendData.duration_of_complaint || "",
        severityOfComplaint: currentHealth.severityOfComplaint || backendData.severity_of_complaint || "",
        contextualDetails: currentHealth.contextualDetails || backendData.contextual_details || {},
        currentMedications: currentHealth.currentMedications || backendData.current_medications || [],
        ongoingTreatments: currentHealth.ongoingTreatments || backendData.ongoing_treatments || "",
        primaryReasonForVisit: backendData.primary_reason_for_visit || "",
        
        // Medical History - from nested medicalHistory object
        chronicConditionsList: medicalHistory.chronicConditions || backendData.chronic_conditions_list || [],
        pastIllnesses: medicalHistory.pastIllnesses || backendData.past_illnesses || [],
        surgicalHistory: medicalHistory.surgicalHistory || backendData.surgical_history || "",
        allergiesFromImage: medicalHistory.allergiesFromImage || backendData.allergies_from_image || [],
        otherAllergiesDetails: medicalHistory.otherAllergiesDetails || backendData.other_allergies_details || "",
        allergiesList: medicalHistory.allergiesList || backendData.allergies_list || [],
        otherChronicConditionsDetails: medicalHistory.otherChronicConditionsDetails || backendData.other_chronic_conditions_details || "",
        
        // Lifestyle - from nested lifestyle object and lifestyleHabits sub-object
        lifestyleHabits: lifestyle.lifestyleHabits || backendData.lifestyle_habits || {},
        smoking: lifestyle.smoking || lifestyle.lifestyleHabits?.smoking || backendData.smoking || "",
        alcohol: lifestyle.alcohol || lifestyle.lifestyleHabits?.alcohol || backendData.alcohol || "",
        exercise: lifestyle.exercise || lifestyle.lifestyleHabits?.exercise || backendData.exercise || "",
        diet: lifestyle.diet || backendData.diet || "",
        sleepPattern: lifestyle.sleepPattern || backendData.sleep_pattern || "",
        
        // Visit History - from nested visitHistory object
        pastMedicalHistory: visitHistory.pastMedicalHistory || backendData.pastMedicalHistory || [],
        
        // Other fields
        department: backendData.department || "",
        assignedDoctor: backendData.assigned_doctor || "",
        climate: backendData.climate || "",
      };

      console.log("Transformed data for UI:", transformedData); // Debug log
      console.log("Key fields after transformation:", {
        latestVitals: transformedData.latestVitals,
        symptoms: transformedData.symptoms,
        pastIllnesses: transformedData.pastIllnesses,
        smoking: transformedData.smoking,
        alcohol: transformedData.alcohol,
        pastMedicalHistory: transformedData.pastMedicalHistory
      });
      setPatientData(transformedData);
    } catch (err) {
      console.error("Fetch Patient Data Error:", err);
      setError(err.response?.data?.detail || "Failed to fetch patient profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [patientId]);

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    return moment().diff(moment(dob), 'years');
  };

  const handlePatientDataChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (["pastIllnesses", "allergiesFromImage", "symptoms", "allergiesList", "chronicConditionsList"].includes(name)) {
      setPatientData(prev => {
        const currentList = new Set(prev[name] || []);
        if (checked) {
          currentList.add(value);
        } else {
          currentList.delete(value);
        }
        return { ...prev, [name]: Array.from(currentList) };
      });
    } else {
      setPatientData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const handleNestedChange = (parentField, subField, value) => {
    setPatientData(prev => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] || {}),
        [subField]: value
      }
    }));
  };

  const handleArrayFieldChange = (fieldName, index, e) => {
    const { name, value } = e.target;
    const updatedArray = [...(patientData[fieldName] || [])];
    updatedArray[index] = { ...updatedArray[index], [name]: value };
    setPatientData(prev => ({ ...prev, [fieldName]: updatedArray }));
  };

  const handleAddArrayItem = (fieldName, newItem) => {
    setPatientData(prev => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] || []), newItem]
    }));
  };

  const handleRemoveArrayItem = (fieldName, index) => {
    setPatientData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");

      const backendData = {
        full_name: patientData.fullName,
        patient_id: patientData.patientId,
        abha_id: patientData.abhaId,
        gender: patientData.gender,
        dob: patientData.dateOfBirth,
        age: patientData.age,
        marital_status: patientData.maritalStatus,
        blood_group: patientData.bloodGroup,
        occupation: patientData.occupation,
        mobile_number: patientData.mobileNumber,
        alternate_number: patientData.alternateNumber,
        address_line_1: patientData.addressLine1,
        address_line_2: patientData.addressLine2,
        city: patientData.city,
        district: patientData.district,
        state: patientData.state,
        pin_code: patientData.pinCode,
        emergency_name: patientData.emergencyContactName,
        emergency_relation: patientData.emergencyContactRelation,
        emergency_phone: patientData.emergencyContactPhone,
        aadhaar_number: patientData.aadhaarNumber,
        insurance_provider: patientData.insuranceProvider,
        policy_number: patientData.policyNumber,
        id_verified: patientData.idVerified,
        consent_taken: patientData.consentTaken,
        nurse_id: patientData.nurseId,
        nurse_name: patientData.nurseName,
        department: patientData.department,
        assigned_doctor: patientData.assignedDoctor,
        climate: patientData.climate,
        latest_vitals: patientData.latestVitals,
        chronic_conditions_list: patientData.chronicConditionsList,
        past_illnesses: patientData.pastIllnesses,
        surgical_history: patientData.surgicalHistory,
        allergies_from_image: patientData.allergiesFromImage,
        other_allergies_details: patientData.otherAllergiesDetails,
        symptoms: patientData.symptoms,
        other_symptoms: patientData.otherSymptoms,
        duration_of_complaint: patientData.durationOfComplaint,
        severity_of_complaint: patientData.severityOfComplaint,
        contextual_details: patientData.contextualDetails,
        lifestyle_habits: patientData.lifestyleHabits,
        // Individual lifestyle fields
        smoking: patientData.smoking,
        alcohol: patientData.alcohol,
        exercise: patientData.exercise,
        diet: patientData.diet,
        sleep_pattern: patientData.sleepPattern,
        // Additional current health fields
        primary_reason_for_visit: patientData.primaryReasonForVisit,
        current_medications: patientData.currentMedications,
        ongoing_treatments: patientData.ongoingTreatments,
        allergies_list: patientData.allergiesList,
        other_chronic_conditions_details: patientData.otherChronicConditionsDetails,
        pastMedicalHistory: patientData.pastMedicalHistory || []
      };

      console.log("Sending data to backend:", backendData); // Debug log
      console.log("Patient data before transformation:", {
        latestVitals: patientData.latestVitals,
        symptoms: patientData.symptoms,
        pastIllnesses: patientData.pastIllnesses,
        smoking: patientData.smoking,
        alcohol: patientData.alcohol
      });
      
      await axios.put(`${API_BASE_URL}/patients/${patientId}`, backendData, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      // Show success popup and immediately refresh data
      setSuccessType("profile");
      setShowSuccessPopup(true);
      setEditMode(false);
      
      // Immediately fetch updated data to ensure UI reflects saved changes
      await fetchPatientData();
      
      // Hide popup after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
        setSuccessType("");
      }, 3000);
    } catch (err) {
      console.error("Update Profile Error:", err);
      setError(err.response?.data?.detail || "Failed to update patient profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAddVisitChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("vitals.")) {
      const vitalField = name.split(".")[1];
      setNewVisitData(prev => ({
        ...prev,
        vitals: {
          ...(prev.vitals || {}),
          [vitalField]: value
        }
      }));
    } else {
      setNewVisitData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddVisitLabResult = () => {
    setNewVisitData(prev => ({
      ...prev,
      labResults: [...prev.labResults, { testName: "", value: "", unit: "", resultDate: moment().format("YYYY-MM-DD") }]
    }));
  };

  const handleVisitLabResultChange = (index, e) => {
    const { name, value } = e.target;
    const updatedLabResults = [...newVisitData.labResults];
    updatedLabResults[index] = { ...updatedLabResults[index], [name]: value };
    setNewVisitData(prev => ({ ...prev, labResults: updatedLabResults }));
  };

  const handleRemoveVisitLabResult = (index) => {
    setNewVisitData(prev => ({
      ...prev,
      labResults: prev.labResults.filter((_, i) => i !== index)
    }));
  };

  const handleAddVisitPrescription = () => {
    setNewVisitData(prev => ({
      ...prev,
      prescriptions: [...prev.prescriptions, { medication: "", dosage: "", frequency: "", duration: "" }]
    }));
  };

  const handleVisitPrescriptionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPrescriptions = [...newVisitData.prescriptions];
    updatedPrescriptions[index] = { ...updatedPrescriptions[index], [name]: value };
    setNewVisitData(prev => ({ ...prev, prescriptions: updatedPrescriptions }));
  };

  const handleRemoveVisitPrescription = (index) => {
    setNewVisitData(prev => ({
      ...prev,
      prescriptions: prev.prescriptions.filter((_, i) => i !== index)
    }));
  };

  const handleAddNewVisit = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE_URL}/patients/${patientId}/visits`, newVisitData, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      
      // Show success popup for visit
      setShowAddVisitModal(false);
      setSuccessType("visit");
      setShowSuccessPopup(true);
      
      // Reset form data
      setNewVisitData({
        visitDate: moment().format("YYYY-MM-DD"),
        reasonForVisit: "",
        doctorNotes: "",
        vitals: {}, labResults: [], prescriptions: [], lifestyleSuggestions: ""
      });
      
      // Hide popup after 3 seconds and refresh data
      setTimeout(() => {
        setShowSuccessPopup(false);
        setSuccessType("");
        fetchPatientData();
      }, 3000);
      
    } catch (err) {
      console.error("Add Visit Error:", err);
      setError(err.response?.data?.detail || "Failed to add checkup history");
    } finally {
      setLoading(false);
    }
  };

  const toggleVisitExpansion = (index) => {
    setExpandedVisits(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (loading) return <p className="text-gray-600 text-center py-8">Loading patient profile...</p>;
  if (error) return <p className="text-red-500 text-center py-8">Error: {error}</p>;
  if (!patientData) return <p className="text-gray-600 text-center py-8">No patient data available for ID: {patientId}</p>;

  const genderOptions = ["", "Male", "Female", "Other"];
  const bloodGroupOptions = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const maritalStatusOptions = ["", "Single", "Married", "Divorced", "Widowed"];
  const complaintDurationOptions = ["", "Hours", "Days", "Weeks", "Months"];
  const severityOptions = ["", "Mild", "Moderate", "Severe", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const symptomChecklistOptions = [
    "Fever", "Cough", "Cold", "Shortness of Breath", "Nausea", "Vomiting", "Diarrhea",
    "Chest Pain", "Palpitations", "Dizziness", "Headache", "Fatigue", "Rash", "Swelling", "Pain (joint/muscle)"
  ];
  const onsetOptions = ["", "Sudden", "Gradual"];
  const smokingOptions = ["", "No", "Occasional", "Heavy", "Former"];
  const alcoholOptions = ["", "No", "Occasional", "Heavy"];
  const exerciseOptions = ["", "Sedentary", "Light", "Moderate", "Active", "Very Active"];
  const dietOptions = ["", "Vegetarian", "Non-vegetarian", "Vegan", "Mixed"];
  const sleepPatternOptions = ["", "<5 hours", "5-6 hours", "6-8 hours", ">8 hours"];
  const commonAllergens = ["Penicillin", "Dust", "Pollen", "Shellfish", "Peanuts", "Dairy", "Gluten"];
  const commonChronicConditions = ["Hypertension", "Diabetes", "Asthma", "Thyroid Disorder", "Arthritis", "Heart Disease", "Kidney Disease"];
  const pastIllnessesImageOptions = ["Diabetes", "Hypertension", "TB", "Asthma"];
  const allergiesFromImageOptions = ["Drug", "Food", "Environmental", "Latex"];

  const tabs = [
    { id: "overview", label: "Overview", icon: "fa-user" },
    { id: "medical", label: "Medical History", icon: "fa-notes-medical" },
    { id: "current", label: "Current Health", icon: "fa-heartbeat" },
    { id: "lifestyle", label: "Lifestyle", icon: "fa-running" },
    { id: "history", label: "Visit History", icon: "fa-history" }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col ">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-40 pt-25">
        <div className="max-w-7xl mx-auto px-4 py-4 ">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.location.href = '/agent-playground/agent/Doc-Sentra/nurse/dashboard'}
                className="text-[#3B82F6] hover:text-[#2563EB] transition-colors"
              >
                < SquareChevronLeft className="w-full h-full text-[#3B82F6] mb-3" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#1E293B]">Patient Profile</h1>
                <p className="text-[#5F5F60] text-sm">{patientData.fullName} - ID: {patientData.patientId}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-medium py-2 px-4 rounded transition"
                >
                  <i className="fas fa-edit mr-2"></i> Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSaveProfile}
                    className="bg-[#E9F0FF] hover:bg-[#155DFC] text-[#155DFC] font-medium py-2 px-4 rounded transition hover:text-white"
                    disabled={loading}
                  >
                    <i className="fas fa-save mr-2"></i> {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => { setEditMode(false); fetchPatientData(); }}
                    className="bg-[#155DFC] hover:bg-[#E9F0FF] text-white hover:text-[#155DFC]  font-medium py-2 px-4 rounded transition"
                    disabled={loading}
                  >
                    <i className="fas fa-times mr-2"></i> Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-[#E2E8F0] overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 font-medium transition whitespace-nowrap ${activeTab === tab.id
                  ? 'text-[#2563EB] border-b-2 border-[#2563EB]'
                  : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
              >
                <i className={`fas ${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Patient Summary */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
                <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center">
                  <i className="fas fa-user-circle mr-2 text-[#2563EB]"></i> Patient Summary
                </h2>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[#475569] text-sm font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={patientData.fullName || ""}
                      onChange={handlePatientDataChange}
                      readOnly={!editMode}
                      className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[#475569] text-sm font-medium mb-1">ABHA ID</label>
                      <input
                        type="text"
                        name="abhaId"
                        value={patientData.abhaId || ""}
                        onChange={handlePatientDataChange}
                        readOnly={!editMode}
                        className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[#475569] text-sm font-medium mb-1">Age</label>
                      <input
                        type="text"
                        value={calculateAge(patientData.dateOfBirth)}
                        readOnly
                        className="w-full px-3 py-2 border border-[#CBD5E1] rounded bg-[#F1F5F9]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[#475569] text-sm font-medium mb-1">Gender</label>
                      <select
                        name="gender"
                        value={patientData.gender || ""}
                        onChange={handlePatientDataChange}
                        disabled={!editMode}
                        className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                      >
                        {genderOptions.map(option => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#475569] text-sm font-medium mb-1">Blood Group</label>
                      <select
                        name="bloodGroup"
                        value={patientData.bloodGroup || ""}
                        onChange={handlePatientDataChange}
                        disabled={!editMode}
                        className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                      >
                        {bloodGroupOptions.map(option => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[#475569] text-sm font-medium mb-1">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={moment(patientData.dateOfBirth).format('YYYY-MM-DD')}
                        onChange={handlePatientDataChange}
                        readOnly={!editMode}
                        className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[#475569] text-sm font-medium mb-1">Marital Status</label>
                      <select
                        name="maritalStatus"
                        value={patientData.maritalStatus || ""}
                        onChange={handlePatientDataChange}
                        disabled={!editMode}
                        className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                      >
                        {maritalStatusOptions.map(option => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#475569] text-sm font-medium mb-1">Insurance Provider</label>
                    <input
                      type="text"
                      name="insuranceProvider"
                      value={patientData.insuranceProvider || ""}
                      onChange={handlePatientDataChange}
                      readOnly={!editMode}
                      className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                    />
                  </div>
                </div>
              </div>

              {/* Vital Signs */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
                <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center">
                  <i className="fas fa-heartbeat mr-2 text-[#2563EB]"></i> Latest Vitals
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#475569] text-sm font-medium mb-1">BP (mmHg)</label>
                    <input
                      type="text"
                      name="bloodPressure"
                      value={patientData.latestVitals?.bloodPressure || ""}
                      onChange={(e) => handleNestedChange("latestVitals", "bloodPressure", e.target.value)}
                      readOnly={!editMode}
                      className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[#475569] text-sm font-medium mb-1">Pulse (bpm)</label>
                    <input
                      type="number"
                      name="pulseRate"
                      value={patientData.latestVitals?.pulseRate || ""}
                      onChange={(e) => handleNestedChange("latestVitals", "pulseRate", e.target.value)}
                      readOnly={!editMode}
                      className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[#475569] text-sm font-medium mb-1">Temp (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="temperature"
                      value={patientData.latestVitals?.temperature || ""}
                      onChange={(e) => handleNestedChange("latestVitals", "temperature", e.target.value)}
                      readOnly={!editMode}
                      className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[#475569] text-sm font-medium mb-1">SpO₂ (%)</label>
                    <input
                      type="number"
                      name="spo2"
                      value={patientData.latestVitals?.spo2 || ""}
                      onChange={(e) => handleNestedChange("latestVitals", "spo2", e.target.value)}
                      readOnly={!editMode}
                      className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[#475569] text-sm font-medium mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="weight"
                      value={patientData.latestVitals?.weight || ""}
                      onChange={(e) => handleNestedChange("latestVitals", "weight", e.target.value)}
                      readOnly={!editMode}
                      className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[#475569] text-sm font-medium mb-1">Height (cm)</label>
                    <input
                      type="number"
                      name="height"
                      value={patientData.latestVitals?.height || ""}
                      onChange={(e) => handleNestedChange("latestVitals", "height", e.target.value)}
                      readOnly={!editMode}
                      className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Medical History Tab */}
          {activeTab === "medical" && (
            <div className="space-y-6">
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
                <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Past Illnesses</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {pastIllnessesImageOptions.map(illness => (
                    <label key={illness} className="flex items-center">
                      <input
                        type="checkbox"
                        name="pastIllnesses"
                        value={illness}
                        checked={patientData.pastIllnesses?.includes(illness) || false}
                        onChange={handlePatientDataChange}
                        disabled={!editMode}
                        className="form-checkbox h-4 w-4 text-[#2563EB] rounded"
                      />
                      <span className="ml-2 text-[#475569]">{illness}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
                <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Surgical History</h2>
                <textarea
                  name="surgicalHistory"
                  value={patientData.surgicalHistory || ""}
                  onChange={handlePatientDataChange}
                  readOnly={!editMode}
                  placeholder="Enter surgical procedures and year"
                  className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                  rows="3"
                ></textarea>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
                <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Allergies</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {allergiesFromImageOptions.map(allergy => (
                    <label key={allergy} className="flex items-center">
                      <input
                        type="checkbox"
                        name="allergiesFromImage"
                        value={allergy}
                        checked={patientData.allergiesFromImage?.includes(allergy) || false}
                        onChange={handlePatientDataChange}
                        disabled={!editMode}
                        className="form-checkbox h-4 w-4 text-[#2563EB] rounded"
                      />
                      <span className="ml-2 text-[#475569]">{allergy}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="block text-[#475569] text-sm font-medium mb-1">Other Allergies</label>
                  <input
                    type="text"
                    name="otherAllergiesDetails"
                    value={patientData.otherAllergiesDetails || ""}
                    onChange={handlePatientDataChange}
                    readOnly={!editMode}
                    placeholder="List other allergies"
                    className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                  />
                </div>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
                <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Chronic Conditions</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {commonChronicConditions.map(condition => (
                    <label key={condition} className="flex items-center">
                      <input
                        type="checkbox"
                        name="chronicConditionsList"
                        value={condition}
                        checked={patientData.chronicConditionsList?.includes(condition) || false}
                        onChange={handlePatientDataChange}
                        disabled={!editMode}
                        className="form-checkbox h-4 w-4 text-[#2563EB] rounded"
                      />
                      <span className="ml-2 text-[#475569]">{condition}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="block text-[#475569] text-sm font-medium mb-1">Other Conditions</label>
                  <textarea
                    name="otherChronicConditionsDetails"
                    value={patientData.otherChronicConditionsDetails || ""}
                    onChange={handlePatientDataChange}
                    readOnly={!editMode}
                    placeholder="List any other chronic conditions"
                    className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                    rows="2"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* Current Health Tab */}
          {activeTab === "current" && (
            <div className="space-y-6">
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
                <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Chief Complaint</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#475569] text-sm font-medium mb-1">Primary Reason for Visit</label>
                    <textarea
                      name="primaryReasonForVisit"
                      value={patientData.primaryReasonForVisit || ""}
                      onChange={handlePatientDataChange}
                      readOnly={!editMode}
                      placeholder="Describe current symptoms and complaints"
                      className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#475569] text-sm font-medium mb-1">Duration</label>
                      <select
                        name="durationOfComplaint"
                        value={patientData.durationOfComplaint || ""}
                        onChange={handlePatientDataChange}
                        disabled={!editMode}
                        className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                      >
                        {complaintDurationOptions.map(option => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#475569] text-sm font-medium mb-1">Severity</label>
                      <select
                        name="severityOfComplaint"
                        value={patientData.severityOfComplaint || ""}
                        onChange={handlePatientDataChange}
                        disabled={!editMode}
                        className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                      >
                        {severityOptions.map(option => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
                <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Symptom Checklist</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {symptomChecklistOptions.map(symptom => (
                    <label key={symptom} className="flex items-center">
                      <input
                        type="checkbox"
                        name="symptoms"
                        value={symptom}
                        checked={patientData.symptoms?.includes(symptom) || false}
                        onChange={handlePatientDataChange}
                        disabled={!editMode}
                        className="form-checkbox h-4 w-4 text-[#2563EB] rounded"
                      />
                      <span className="ml-2 text-[#475569] text-sm">{symptom}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <label className="block text-[#475569] text-sm font-medium mb-1">Other Symptoms</label>
                  <textarea
                    name="otherSymptoms"
                    value={patientData.otherSymptoms || ""}
                    onChange={handlePatientDataChange}
                    readOnly={!editMode}
                    placeholder="Describe any other symptoms"
                    className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                    rows="2"
                  ></textarea>
                </div>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
                <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Current Medications</h2>
                {(patientData.currentMedications || []).map((med, index) => (
                  <MedicationInput
                    key={index}
                    medication={med}
                    index={index}
                    onChange={(idx, e) => handleArrayFieldChange("currentMedications", idx, e)}
                    onRemove={() => handleRemoveArrayItem("currentMedications", index)}
                    readOnly={!editMode}
                  />
                ))}
                {editMode && (
                  <button
                    type="button"
                    onClick={() => handleAddArrayItem("currentMedications", { drugName: "", dosage: "", duration: "" })}
                    className="bg-[#DBEAFE] hover:bg-[#BFDBFE] text-[#2563EB] text-sm px-3 py-2 rounded transition mt-2"
                  >
                    <i className="fas fa-plus mr-1"></i> Add Medication
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Lifestyle Tab */}
          {activeTab === "lifestyle" && (
            <div className="space-y-6">
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
                <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Lifestyle & Habits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#475569] text-sm font-medium mb-1">Smoking</label>
                    <select
                      name="smoking"
                      value={patientData.smoking || ""}
                      onChange={handlePatientDataChange}
                      disabled={!editMode}
                      className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                    >
                      {smokingOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#475569] text-sm font-medium mb-1">Alcohol</label>
                    <select
                      name="alcohol"
                      value={patientData.alcohol || ""}
                      onChange={handlePatientDataChange}
                      disabled={!editMode}
                      className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                    >
                      {alcoholOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#475569] text-sm font-medium mb-1">Exercise</label>
                    <select
                      name="exercise"
                      value={patientData.exercise || ""}
                      onChange={handlePatientDataChange}
                      disabled={!editMode}
                      className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                    >
                      {exerciseOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#475569] text-sm font-medium mb-1">Diet</label>
                    <select
                      name="diet"
                      value={patientData.diet || ""}
                      onChange={handlePatientDataChange}
                      disabled={!editMode}
                      className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                    >
                      {dietOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[#475569] text-sm font-medium mb-1">Sleep Pattern</label>
                    <select
                      name="sleepPattern"
                      value={patientData.sleepPattern || ""}
                      onChange={handlePatientDataChange}
                      disabled={!editMode}
                      className={`w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${!editMode ? 'bg-[#F1F5F9]' : 'bg-white'}`}
                    >
                      {sleepPatternOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Visit History Tab */}
          {activeTab === "history" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#1E293B]">Past Medical History</h2>
                <button
                  onClick={() => setShowAddVisitModal(true)}
                  className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-medium py-2 px-4 rounded transition"
                >
                  <i className="fas fa-plus mr-2"></i> Add Visit
                </button>
              </div>
              <div className="space-y-3">
                {patientData.pastMedicalHistory && patientData.pastMedicalHistory.length > 0 ? (
                  [...patientData.pastMedicalHistory].reverse().map((visit, index) => (
                    <VisitDetailsDisplay
                      key={index}
                      visit={visit}
                      visitNumber={patientData.pastMedicalHistory.length - index}
                      isExpanded={expandedVisits[index]}
                      onToggleExpand={() => toggleVisitExpansion(index)}
                    />
                  ))
                ) : (
                  <p className="text-[#64748B] text-center py-8">No past checkup history available.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-white border-t border-[#E2E8F0] sticky bottom-0 z-30 mt-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-end">
          <button
            className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-medium py-2 px-6 rounded transition"
            onClick={() => {
              navigate(`../../recommendation/${patientId}`, { relative: "path" });
            }}
          >
            Fix Appointment <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>

      {/* Add Visit Modal */}
      {showAddVisitModal && (
        <div 
          className="fixed inset-0 bg-black/80 bg-opacity-50 flex justify-center items-center z-50 p-4 pt-32"
          onClick={() => setShowAddVisitModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-[#E2E8F0] p-6 z-10">
              <h2 className="text-xl font-bold text-[#1E293B]">Add New Checkup History</h2>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleAddNewVisit(); }} className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#475569] text-sm font-medium mb-1">Visit Date *</label>
                    <input type="date" name="visitDate" value={newVisitData.visitDate} onChange={handleAddVisitChange} required className="w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                  </div>
                  <div>
                    <label className="block text-[#475569] text-sm font-medium mb-1">Reason for Visit *</label>
                    <input type="text" name="reasonForVisit" value={newVisitData.reasonForVisit} onChange={handleAddVisitChange} required placeholder="e.g., Follow-up for high BP" className="w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                  </div>
                </div>
                <div>
                  <label className="block text-[#475569] text-sm font-medium mb-1">Doctor Notes</label>
                  <textarea name="doctorNotes" value={newVisitData.doctorNotes} onChange={handleAddVisitChange} placeholder="Detailed doctor's observations" className="w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB]" rows="3"></textarea>
                </div>

                <div className="border-t pt-2">
                  <h3 className="font-semibold text-[#1E293B] mb-3">Vitals</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[#475569] text-sm font-medium mb-1">BP (mmHg)</label>
                      <input type="text" name="vitals.bloodPressure" value={newVisitData.vitals?.bloodPressure || ""} onChange={handleAddVisitChange} placeholder="e.g., 120/80" className="w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                    </div>
                    <div>
                      <label className="block text-[#475569] text-sm font-medium mb-1">Pulse (bpm)</label>
                      <input type="number" name="vitals.pulseRate" value={newVisitData.vitals?.pulseRate || ""} onChange={handleAddVisitChange} className="w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                    </div>
                    <div>
                      <label className="block text-[#475569] text-sm font-medium mb-1">Temp (°C)</label>
                      <input type="number" step="0.1" name="vitals.temperature" value={newVisitData.vitals?.temperature || ""} onChange={handleAddVisitChange} className="w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                    </div>
                    <div>
                      <label className="block text-[#475569] text-sm font-medium mb-1">SpO₂ (%)</label>
                      <input type="number" name="vitals.spo2" value={newVisitData.vitals?.spo2 || ""} onChange={handleAddVisitChange} className="w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                    </div>
                    <div>
                      <label className="block text-[#475569] text-sm font-medium mb-1">Weight (kg)</label>
                      <input type="number" step="0.1" name="vitals.weight" value={newVisitData.vitals?.weight || ""} onChange={handleAddVisitChange} className="w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                    </div>
                    <div>
                      <label className="block text-[#475569] text-sm font-medium mb-1">Height (cm)</label>
                      <input type="number" name="vitals.height" value={newVisitData.vitals?.height || ""} onChange={handleAddVisitChange} className="w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-[#1E293B] mb-3">Lab Results</h3>
                  {(newVisitData.labResults || []).map((lr, index) => (
                    <LabResultInput key={index} result={lr} index={index} onChange={handleVisitLabResultChange} onRemove={handleRemoveVisitLabResult} />
                  ))}
                  <button type="button" onClick={handleAddVisitLabResult} className="bg-[#DBEAFE] hover:bg-[#BFDBFE] text-[#2563EB] text-sm px-3 py-2 rounded transition mt-2">
                    <i className="fas fa-plus mr-1"></i> Add Lab Result
                  </button>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-[#1E293B] mb-3">Prescriptions</h3>
                  {(newVisitData.prescriptions || []).map((p, index) => (
                    <PrescriptionInput key={index} prescription={p} index={index} onChange={handleVisitPrescriptionChange} onRemove={handleRemoveVisitPrescription} />
                  ))}
                  <button type="button" onClick={handleAddVisitPrescription} className="bg-[#DBEAFE] hover:bg-[#BFDBFE] text-[#2563EB] text-sm px-3 py-2 rounded transition mt-2">
                    <i className="fas fa-plus mr-1"></i> Add Prescription
                  </button>
                </div>

                <div className="border-t pt-4">
                  <label className="block text-[#475569] text-sm font-medium mb-1">Lifestyle Suggestions</label>
                  <textarea name="lifestyleSuggestions" value={newVisitData.lifestyleSuggestions} onChange={handleAddVisitChange} placeholder="e.g., Reduce salt intake, increase physical activity" className="w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB]" rows="2"></textarea>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button type="button" onClick={() => setShowAddVisitModal(false)} className="bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#475569] font-medium py-2 px-4 rounded transition">
                  Cancel
                </button>
                <button type="submit" className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-medium py-2 px-4 rounded transition" disabled={loading}>
                  {loading ? "Adding..." : "Add Checkup"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl animate-fade-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-green-500 text-5xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {successType === "profile" ? "Profile Updated!" : "Success!"}
            </h3>
            <p className="text-gray-600">
              {successType === "profile" 
                ? "Patient profile updated successfully!" 
                : "New checkup history added successfully."
              }
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {successType === "profile" ? "Refreshing..." : "Refreshing data..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientProfile;