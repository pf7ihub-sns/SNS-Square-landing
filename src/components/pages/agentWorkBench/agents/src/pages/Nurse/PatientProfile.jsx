import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment"; // Make sure to install: npm install moment

// --- Sub-components for repeatable elements ---
// Reusable input component for medications
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

// Reusable input component for lab results (for New Visit Modal)
const LabResultInput = ({ result, index, onChange, onRemove, readOnly = false }) => (
  <div className="flex flex-wrap md:flex-nowrap gap-2 mb-2 items-center">
    <input type="text" name="testName" value={result.testName || ""} onChange={(e) => onChange(index, e)} placeholder="Test Name" className={`flex-1 p-2 border rounded ${readOnly ? 'bg-gray-100' : ''}`} readOnly={readOnly}/>
    <input type="text" name="value" value={result.value || ""} onChange={(e) => onChange(index, e)} placeholder="Value" className={`flex-1 p-2 border rounded ${readOnly ? 'bg-gray-100' : ''}`} readOnly={readOnly}/>
    <input type="text" name="unit" value={result.unit || ""} onChange={(e) => onChange(index, e)} placeholder="Unit" className={`w-20 p-2 border rounded ${readOnly ? 'bg-gray-100' : ''}`} readOnly={readOnly}/>
    <input type="date" name="resultDate" value={moment(result.resultDate).format("YYYY-MM-DD") || ""} onChange={(e) => onChange(index, e)} className={`w-32 p-2 border rounded ${readOnly ? 'bg-gray-100' : ''}`} readOnly={readOnly}/>
    {!readOnly && (
      <button type="button" onClick={() => onRemove(index)} className="text-red-500 hover:text-red-700 p-1">
        <i className="fas fa-times"></i>
      </button>
    )}
  </div>
);

// Reusable input component for prescriptions (for New Visit Modal)
const PrescriptionInput = ({ prescription, index, onChange, onRemove, readOnly = false }) => (
  <div className="flex flex-wrap md:flex-nowrap gap-2 mb-2 items-center">
    <input type="text" name="medication" value={prescription.medication || ""} onChange={(e) => onChange(index, e)} placeholder="Medication" className={`flex-1 p-2 border rounded ${readOnly ? 'bg-gray-100' : ''}`} readOnly={readOnly}/>
    <input type="text" name="dosage" value={prescription.dosage || ""} onChange={(e) => onChange(index, e)} placeholder="Dosage" className={`flex-1 p-2 border rounded ${readOnly ? 'bg-gray-100' : ''}`} readOnly={readOnly}/>
    <input type="text" name="frequency" value={prescription.frequency || ""} onChange={(e) => onChange(index, e)} placeholder="Frequency" className={`flex-1 p-2 border rounded ${readOnly ? 'bg-gray-100' : ''}`} readOnly={readOnly}/>
    <input type="text" name="duration" value={prescription.duration || ""} onChange={(e) => onChange(index, e)} placeholder="Duration" className={`flex-1 p-2 border rounded ${readOnly ? 'bg-gray-100' : ''}`} readOnly={readOnly}/>
    {!readOnly && (
      <button type="button" onClick={() => onRemove(index)} className="text-red-500 hover:text-red-700 p-1">
        <i className="fas fa-times"></i>
      </button>
    )}
  </div>
);

// Component to display individual visit details (expandable)
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
  const [editMode, setEditMode] = useState(false); // Controls if the main profile is editable
  const [showAddVisitModal, setShowAddVisitModal] = useState(false); // Controls the "Add Checkup History" modal
  const [newVisitData, setNewVisitData] = useState({ // State for the new visit form
    visitDate: moment().format("YYYY-MM-DD"),
    reasonForVisit: "",
    doctorNotes: "",
    vitals: {},
    labResults: [],
    prescriptions: [],
    lifestyleSuggestions: ""
  });
  const [expandedVisits, setExpandedVisits] = useState({}); // State to manage which visit history items are expanded

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_DOCSENTRA || "http://localhost:8080";

  // --- Data Fetching ---
  const fetchPatientData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/patients/${patientId}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      const backendData = response.data;

      // NEW: Comprehensive field mapping from snake_case to camelCase
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
        latestVitals: backendData.latest_vitals || {},
        chronicConditionsList: backendData.chronic_conditions_list || [],
        pastIllnesses: backendData.past_illnesses || [],
        surgicalHistory: backendData.surgical_history || "",
        allergiesFromImage: backendData.allergies_from_image || [],
        otherAllergiesDetails: backendData.other_allergies_details || "",
        symptoms: backendData.symptoms || [],
        otherSymptoms: backendData.other_symptoms || "",
        durationOfComplaint: backendData.duration_of_complaint || "",
        severityOfComplaint: backendData.severity_of_complaint || "",
        contextualDetails: backendData.contextual_details || {},
        lifestyleHabits: backendData.lifestyle_habits || {},
        currentMedications: backendData.current_medications || [],
        ongoingTreatments: backendData.ongoing_treatments || "",
        department: backendData.department || "",
        assignedDoctor: backendData.assigned_doctor || "",
        climate: backendData.climate || "",
        allergiesList: backendData.allergies_list || [],
        otherChronicConditionsDetails: backendData.other_chronic_conditions_details || "",
        pastMedicalHistory: backendData.pastMedicalHistory || [],
        // Add any other fields as needed
      };

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

  // --- Helper Functions ---
  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    return moment().diff(moment(dob), 'years');
  };

  // Generic handler for most patientData top-level fields
  const handlePatientDataChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle array fields (checkboxes for lists)
    if (["pastIllnesses", "allergiesFromImage", "symptoms", "allergiesList", "chronicConditionsList"].includes(name)) {
      setPatientData(prev => {
        const currentList = new Set(prev[name] || []); // Use Set for efficient checking and unique items
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

  // Handler for nested objects (e.g., latestVitals)
  const handleNestedChange = (parentField, subField, value) => {
    setPatientData(prev => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] || {}), // Ensure nested object exists
        [subField]: value
      }
    }));
  };

  // Handler for arrays of objects (e.g., currentMedications)
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

  // --- Main Profile Actions ---
const handleSaveProfile = async () => {
  setLoading(true);
  setError("");
  try {
    const token = localStorage.getItem("token");
    
    // Complete field mapping from camelCase to snake_case
    const backendData = {
      // Basic patient info (stays in patients collection)
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
      
      // Clinical data (will be moved to visits collection by backend)
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
      current_medications: patientData.currentMedications,
      ongoing_treatments: patientData.ongoingTreatments,
      allergies_list: patientData.allergiesList,
      other_chronic_conditions_details: patientData.otherChronicConditionsDetails,
      
      // Include visit history for proper handling
      pastMedicalHistory: patientData.pastMedicalHistory || []
    };

    await axios.put(`${API_BASE_URL}/patients/${patientId}`, backendData, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    
    alert("Patient profile updated successfully!");
    setEditMode(false);
    fetchPatientData();
  } catch (err) {
    console.error("Update Profile Error:", err);
    setError(err.response?.data?.detail || "Failed to update patient profile");
  } finally {
    setLoading(false);
  }
};

  // --- Add New Visit Modal Handlers ---
  const handleAddVisitChange = (e) => {
    const { name, value } = e.target;
    // Handle nested vitals fields
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
      alert("New checkup history added successfully!");
      setShowAddVisitModal(false);
      setNewVisitData({ // Reset form after successful submission
        visitDate: moment().format("YYYY-MM-DD"),
        reasonForVisit: "",
        doctorNotes: "",
        vitals: {}, labResults: [], prescriptions: [], lifestyleSuggestions: ""
      });
      fetchPatientData(); // Re-fetch to update the profile with the new visit
    } catch (err) {
      console.error("Add Visit Error:", err);
      setError(err.response?.data?.detail || "Failed to add checkup history");
    } finally {
      setLoading(false);
    }
  };

  // --- Visit History Expansion ---
  const toggleVisitExpansion = (index) => {
    setExpandedVisits(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };


  if (loading) return <p className="text-gray-600 text-center py-8">Loading patient profile...</p>;
  if (error) return <p className="text-red-500 text-center py-8">Error: {error}</p>;
  if (!patientData) return <p className="text-gray-600 text-center py-8">No patient data available for ID: {patientId}</p>;

  // --- Options for Dropdowns/Checklists ---
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


  return (
    <div className="min-h-screen bg-gray-100 p-4 pt-24">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-4 text-center">Patient Profile</h1>
        <p className="text-gray-600 mb-6 text-center">Complete patient information and medical records</p>

        {/* Edit/Save/Cancel Buttons */}
        <div className="flex justify-end mb-4">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition"
            >
              <i className="fas fa-edit mr-2"></i> Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSaveProfile}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition mr-2"
                disabled={loading}
              >
                <i className="fas fa-save mr-2"></i> {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => { setEditMode(false); fetchPatientData(); }} // Re-fetch to discard changes
                className="bg-gray-400 hover:bg-gray-500 text-gray-800 font-bold py-2 px-4 rounded transition"
                disabled={loading}
              >
                <i className="fas fa-times mr-2"></i> Cancel
              </button>
            </>
          )}
        </div>


        {/* Patient Summary & Medical History (Top Section - matching image structure) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b pb-4">
          {/* Patient Summary */}
          <section className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
              <i className="fas fa-user-circle mr-2"></i> Patient Summary
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">Full Name:</label>
                <input
                  type="text"
                  name="fullName"
                  value={patientData.fullName || ""}
                  onChange={handlePatientDataChange}
                  readOnly={!editMode}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">Patient ID:</label>
                <input
                  type="text"
                  name="patientId"
                  value={patientData.patientId || ""}
                  readOnly
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">ABHA ID:</label>
                <input
                  type="text"
                  name="abhaId"
                  value={patientData.abhaId || ""}
                  onChange={handlePatientDataChange}
                  readOnly={!editMode}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">Age:</label>
                <input
                  type="text"
                  value={calculateAge(patientData.dateOfBirth)}
                  readOnly
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">Gender:</label>
                 <select
                  name="gender"
                  value={patientData.gender || ""}
                  onChange={handlePatientDataChange}
                  disabled={!editMode}
                  className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                >
                  {genderOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">Date of Birth:</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={moment(patientData.dateOfBirth).format('YYYY-MM-DD')}
                  onChange={handlePatientDataChange}
                  readOnly={!editMode}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">Blood Group:</label>
                 <select
                  name="bloodGroup"
                  value={patientData.bloodGroup || ""}
                  onChange={handlePatientDataChange}
                  disabled={!editMode}
                  className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                >
                  {bloodGroupOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                {/* Added Marital Status field here */}
                <label className="block text-gray-700 text-sm font-bold mb-1">Marital Status:</label>
                <select
                  name="maritalStatus"
                  value={patientData.maritalStatus || ""}
                  onChange={handlePatientDataChange}
                  disabled={!editMode}
                  className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                >
                  {maritalStatusOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">Insurance Provider:</label>
                <input
                  type="text"
                  name="insuranceProvider"
                  value={patientData.insuranceProvider || ""}
                  onChange={handlePatientDataChange}
                  readOnly={!editMode}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">Emergency Contact:</label>
                <input
                  type="text"
                  name="emergencyContactInfo" // Combined field for display
                  value={patientData.emergencyContactInfo || ""}
                  readOnly
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline"
                />
                {/* For actual editing, you'd want separate inputs for name, relation, phone */}
              </div>
            </div>
          </section>

          {/* Medical History from Image */}
          <section className="p-4 border border-purple-200 rounded-lg bg-purple-50">
            <h2 className="text-xl font-semibold text-purple-800 mb-4 flex items-center">
              <i className="fas fa-notes-medical mr-2"></i> Medical History
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Past Illnesses:</label>
              <div className="grid grid-cols-2 gap-2">
                {pastIllnessesImageOptions.map(illness => (
                  <label key={illness} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="pastIllnesses"
                      value={illness}
                      checked={patientData.pastIllnesses?.includes(illness) || false}
                      onChange={handlePatientDataChange}
                      disabled={!editMode}
                      className="form-checkbox h-4 w-4 text-purple-600"
                    />
                    <span className="ml-2 text-gray-700">{illness}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-1">Surgical History:</label>
              <textarea
                name="surgicalHistory"
                value={patientData.surgicalHistory || ""}
                onChange={handlePatientDataChange}
                readOnly={!editMode}
                placeholder="Enter surgical procedures and year"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                rows="2"
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Allergies:</label>
              <div className="grid grid-cols-2 gap-2">
                {allergiesFromImageOptions.map(allergy => (
                  <label key={allergy} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="allergiesFromImage"
                      value={allergy}
                      checked={patientData.allergiesFromImage?.includes(allergy) || false}
                      onChange={handlePatientDataChange}
                      disabled={!editMode}
                      className="form-checkbox h-4 w-4 text-purple-600"
                    />
                    <span className="ml-2 text-gray-700">{allergy}</span>
                  </label>
                ))}
              </div>
              <label className="block text-gray-700 text-sm font-bold mt-2 mb-1">Other allergies:</label>
              <input
                type="text"
                name="otherAllergiesDetails" // Mapped from backend 'otherAllergies'
                value={patientData.otherAllergiesDetails || ""}
                onChange={handlePatientDataChange}
                readOnly={!editMode}
                placeholder="List other allergies"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
              />
            </div>
          </section>
        </div>


        {/* Current Health Status & Vitals (Middle Section - matching image structure) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b pb-4">
          {/* Current Health Status */}
          <section className="p-4 border border-green-200 rounded-lg bg-green-50">
            <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
              <i className="fas fa-stethoscope mr-2"></i> Current Health Status
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-1">Presenting Complaints:</label>
              <textarea
                name="primaryReasonForVisit"
                value={patientData.primaryReasonForVisit || ""}
                onChange={handlePatientDataChange}
                readOnly={!editMode}
                placeholder="Describe current symptoms and complaints"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                rows="3"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-1">Current Medications:</label>
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
                  className="bg-blue-200 hover:bg-blue-300 text-blue-800 text-sm px-3 py-1 rounded transition mt-2"
                >
                  <i className="fas fa-plus mr-1"></i> Add Medication
                </button>
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1">Ongoing Treatments:</label>
              <textarea
                name="ongoingTreatments"
                value={patientData.ongoingTreatments || ""}
                onChange={handlePatientDataChange}
                readOnly={!editMode}
                placeholder="Dialysis, Physiotherapy, etc."
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                rows="2"
              ></textarea>
            </div>
          </section>

          {/* Vital Signs (Latest) */}
          <section className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <h2 className="text-xl font-semibold text-yellow-800 mb-4 flex items-center">
              <i className="fas fa-heartbeat mr-2"></i> Vital Signs (Latest)
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">Blood Pressure (mmHg):</label>
                <input
                  type="text"
                  name="bloodPressure"
                  value={patientData.latestVitals?.bloodPressure || ""}
                  onChange={(e) => handleNestedChange("latestVitals", "bloodPressure", e.target.value)}
                  readOnly={!editMode}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">Pulse Rate (bpm):</label>
                <input
                  type="number"
                  name="pulseRate"
                  value={patientData.latestVitals?.pulseRate || ""}
                  onChange={(e) => handleNestedChange("latestVitals", "pulseRate", e.target.value)}
                  readOnly={!editMode}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">Temperature (°C):</label>
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={patientData.latestVitals?.temperature || ""}
                  onChange={(e) => handleNestedChange("latestVitals", "temperature", e.target.value)}
                  readOnly={!editMode}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">SpO₂ (%):</label>
                <input
                  type="number"
                  name="spo2"
                  value={patientData.latestVitals?.spo2 || ""}
                  onChange={(e) => handleNestedChange("latestVitals", "spo2", e.target.value)}
                  readOnly={!editMode}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">Weight (kg):</label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={patientData.latestVitals?.weight || ""}
                  onChange={(e) => handleNestedChange("latestVitals", "weight", e.target.value)}
                  readOnly={!editMode}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">Height (cm):</label>
                <input
                  type="number"
                  name="height"
                  value={patientData.latestVitals?.height || ""}
                  onChange={(e) => handleNestedChange("latestVitals", "height", e.target.value)}
                  readOnly={!editMode}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">BMI:</label>
                <input
                  type="number"
                  step="0.1"
                  name="bmi"
                  value={patientData.latestVitals?.bmi || ""}
                  onChange={(e) => handleNestedChange("latestVitals", "bmi", e.target.value)}
                  readOnly={!editMode}
                  placeholder="Calculated or provided"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                />
              </div>
            </div>
          </section>
        </div>

        {/* --- ADDITIONAL SECTIONS BASED ON REQUIREMENTS --- */}

        {/* Patient Identification (More Details) */}
        <section className="mb-8 border-b pb-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                <i className="fas fa-id-card-alt mr-2"></i> Patient Identification (More Details)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Profession:</label>
                    <input type="text" name="profession" value={patientData.profession || ""} onChange={handlePatientDataChange} readOnly={!editMode} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}/>
                </div>

                <div className="col-span-2">
                    <h3 className="text-md font-semibold text-gray-800 mt-2 mb-2">Location Details (Optional):</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1">City:</label>
                            <input type="text" name="city" value={patientData.city || ""} onChange={handlePatientDataChange} readOnly={!editMode} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}/>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1">State:</label>
                            <input type="text" name="state" value={patientData.state || ""} onChange={handlePatientDataChange} readOnly={!editMode} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}/>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1">Climate:</label>
                            <input type="text" name="climate" value={patientData.climate || ""} onChange={handlePatientDataChange} readOnly={!editMode} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}/>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Chief Complaint */}
        <section className="mb-8 border-b pb-4 p-4 border border-red-200 rounded-lg bg-red-50">
            <h2 className="text-xl font-semibold text-red-800 mb-4 flex items-center">
                <i className="fas fa-notes mr-2"></i> Chief Complaint
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Primary Reason for Visit:</label>
                    <textarea
                        name="primaryReasonForVisit"
                        value={patientData.primaryReasonForVisit || ""}
                        onChange={handlePatientDataChange}
                        readOnly={!editMode}
                        placeholder="Fever, Chest Pain, Cough, Headache, Abdominal Pain, Fatigue..."
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                        rows="2"
                    ></textarea>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Duration of Complaint:</label>
                    <select
                        name="durationOfComplaint"
                        value={patientData.durationOfComplaint || ""}
                        onChange={handlePatientDataChange}
                        disabled={!editMode}
                        className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                    >
                        {complaintDurationOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Severity:</label>
                    <select
                        name="severityOfComplaint"
                        value={patientData.severityOfComplaint || ""}
                        onChange={handlePatientDataChange}
                        disabled={!editMode}
                        className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                    >
                        {severityOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
            </div>
        </section>

        {/* Symptom Checklist */}
        <section className="mb-8 border-b pb-4 p-4 border border-green-200 rounded-lg bg-green-50">
            <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                <i className="fas fa-list-check mr-2"></i> Symptom Checklist
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {symptomChecklistOptions.map(symptom => (
                    <label key={symptom} className="inline-flex items-center">
                        <input
                            type="checkbox"
                            name="symptoms"
                            value={symptom}
                            checked={patientData.symptoms?.includes(symptom) || false}
                            onChange={handlePatientDataChange}
                            disabled={!editMode}
                            className="form-checkbox h-4 w-4 text-green-600"
                        />
                        <span className="ml-2 text-gray-700">{symptom}</span>
                    </label>
                ))}
            </div>
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">Other Symptoms:</label>
                <textarea
                    name="otherSymptoms"
                    value={patientData.otherSymptoms || ""}
                    onChange={handlePatientDataChange}
                    readOnly={!editMode}
                    placeholder="Describe any other symptoms"
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                    rows="2"
                ></textarea>
            </div>
        </section>

        {/* Contextual Details */}
        <section className="mb-8 border-b pb-4 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <h2 className="text-xl font-semibold text-yellow-800 mb-4 flex items-center">
                <i className="fas fa-info-circle mr-2"></i> Contextual Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Recent Travel History:</label>
                    <select
                        name="recentTravelHistory"
                        value={patientData.recentTravelHistory === true ? "Yes" : patientData.recentTravelHistory === false ? "No" : ""}
                        onChange={(e) => handlePatientDataChange({ target: { name: 'recentTravelHistory', value: e.target.value === "Yes" ? true : e.target.value === "No" ? false : null }})}
                        disabled={!editMode}
                        className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                    >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Place & Duration (if Yes):</label>
                    <input
                        type="text"
                        name="travelPlaceDuration"
                        value={patientData.travelPlaceDuration || ""}
                        onChange={handlePatientDataChange}
                        readOnly={!editMode || !patientData.recentTravelHistory}
                        placeholder="Place & Duration"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode || !patientData.recentTravelHistory ? 'bg-gray-100' : ''}`}
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Exposure to Sick Contacts:</label>
                    <select
                        name="exposureToSickContacts"
                        value={patientData.exposureToSickContacts === true ? "Yes" : patientData.exposureToSickContacts === false ? "No" : ""}
                        onChange={(e) => handlePatientDataChange({ target: { name: 'exposureToSickContacts', value: e.target.value === "Yes" ? true : e.target.value === "No" ? false : null }})}
                        disabled={!editMode}
                        className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                    >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Known Allergic Reactions:</label>
                    <select
                        name="knownAllergicReactions"
                        value={patientData.knownAllergicReactions === true ? "Yes" : patientData.knownAllergicReactions === false ? "No" : ""}
                        onChange={(e) => handlePatientDataChange({ target: { name: 'knownAllergicReactions', value: e.target.value === "Yes" ? true : e.target.value === "No" ? false : null }})}
                        disabled={!editMode}
                        className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                    >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>
                <div className="col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Allergic Reaction Details (if Yes):</label>
                    <textarea
                        name="allergicReactionDetails"
                        value={patientData.allergicReactionDetails || ""}
                        onChange={handlePatientDataChange}
                        readOnly={!editMode || !patientData.knownAllergicReactions}
                        placeholder="Details of allergic reactions"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode || !patientData.knownAllergicReactions ? 'bg-gray-100' : ''}`}
                        rows="2"
                    ></textarea>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Onset:</label>
                    <select
                        name="onset"
                        value={patientData.onset || ""}
                        onChange={handlePatientDataChange}
                        disabled={!editMode}
                        className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                    >
                        {onsetOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Aggravating Factors:</label>
                    <input type="text" name="aggravatingFactors" value={patientData.aggravatingFactors || ""} onChange={handlePatientDataChange} readOnly={!editMode} placeholder="Activity, food, time of day, etc." className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}/>
                </div>
                <div className="col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Relieving Factors:</label>
                    <input type="text" name="relievingFactors" value={patientData.relievingFactors || ""} onChange={handlePatientDataChange} readOnly={!editMode} placeholder="Free text" className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}/>
                </div>
            </div>
        </section>

        {/* Lifestyle & Habits */}
        <section className="mb-8 border-b pb-4 p-4 border border-pink-200 rounded-lg bg-pink-50">
            <h2 className="text-xl font-semibold text-pink-800 mb-4 flex items-center">
                <i className="fas fa-shoe-prints mr-2"></i> Lifestyle & Habits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Smoking:</label>
                    <select
                        name="smoking"
                        value={patientData.smoking || ""}
                        onChange={handlePatientDataChange}
                        disabled={!editMode}
                        className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                    >
                        {smokingOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Alcohol:</label>
                    <select
                        name="alcohol"
                        value={patientData.alcohol || ""}
                        onChange={handlePatientDataChange}
                        disabled={!editMode}
                        className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                    >
                        {alcoholOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Exercise:</label>
                    <select
                        name="exercise"
                        value={patientData.exercise || ""}
                        onChange={handlePatientDataChange}
                        disabled={!editMode}
                        className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                    >
                        {exerciseOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Diet:</label>
                    <select
                        name="diet"
                        value={patientData.diet || ""}
                        onChange={handlePatientDataChange}
                        disabled={!editMode}
                        className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                    >
                        {dietOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
                <div className="col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Sleep Pattern:</label>
                    <select
                        name="sleepPattern"
                        value={patientData.sleepPattern || ""}
                        onChange={handlePatientDataChange}
                        disabled={!editMode}
                        className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                    >
                        {sleepPatternOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
            </div>
        </section>

        {/* Allergies (Detailed) */}
        <section className="mb-8 border-b pb-4 p-4 border border-orange-200 rounded-lg bg-orange-50">
            <h2 className="text-xl font-semibold text-orange-800 mb-4 flex items-center">
                <i className="fas fa-allergies mr-2"></i> Allergies (Detailed)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Known Allergens:</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {commonAllergens.map(allergen => (
                            <label key={allergen} className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    name="allergiesList"
                                    value={allergen}
                                    checked={patientData.allergiesList?.includes(allergen) || false}
                                    onChange={handlePatientDataChange}
                                    disabled={!editMode}
                                    className="form-checkbox h-4 w-4 text-red-600"
                                />
                                <span className="ml-2 text-gray-700">{allergen}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mt-2 mb-1">Other allergies (free text):</label>
                    <textarea
                        name="otherAllergiesDetails"
                        value={patientData.otherAllergiesDetails || ""}
                        onChange={handlePatientDataChange}
                        readOnly={!editMode}
                        placeholder="List any other allergies not specified above"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                        rows="2"
                    ></textarea>
                </div>
            </div>
        </section>

        {/* Chronic Conditions (Detailed) */}
        <section className="mb-8 border-b pb-4 p-4 border border-red-300 rounded-lg bg-red-100">
            <h2 className="text-xl font-semibold text-red-800 mb-4 flex items-center">
                <i className="fas fa-heart-crack mr-2"></i> Chronic Conditions (Detailed)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Diagnosed Conditions:</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {commonChronicConditions.map(condition => (
                            <label key={condition} className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    name="chronicConditionsList"
                                    value={condition}
                                    checked={patientData.chronicConditionsList?.includes(condition) || false}
                                    onChange={handlePatientDataChange}
                                    disabled={!editMode}
                                    className="form-checkbox h-4 w-4 text-red-600"
                                />
                                <span className="ml-2 text-gray-700">{condition}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mt-2 mb-1">Other conditions (free text):</label>
                    <textarea
                        name="otherChronicConditionsDetails"
                        value={patientData.otherChronicConditionsDetails || ""}
                        onChange={handlePatientDataChange}
                        readOnly={!editMode}
                        placeholder="List any other chronic conditions"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`}
                        rows="2"
                    ></textarea>
                </div>
            </div>
        </section>

        {/* Records & Reports (from image) - Placeholder for file uploads */}
        <section className="mb-8 border-b pb-4 p-4 border border-indigo-200 rounded-lg bg-indigo-50">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center">
            <i className="fas fa-folder-open mr-2"></i> Records & Reports
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-dashed p-4 text-center rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
              <i className="fas fa-upload text-3xl text-gray-400 mb-2"></i>
              <p className="text-gray-600">Click to upload lab reports</p>
            </div>
            <div className="border border-dashed p-4 text-center rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
              <i className="fas fa-upload text-3xl text-gray-400 mb-2"></i>
              <p className="text-gray-600">Click to upload scans/X-rays</p>
            </div>
            <div className="border border-dashed p-4 text-center rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
              <i className="fas fa-upload text-3xl text-gray-400 mb-2"></i>
              <p className="text-gray-600">Click to upload prescriptions</p>
            </div>
          </div>
        </section>

        {/* Past Medical History (Visits & Doctor Notes) */}
        <section className="mb-8 p-4 border border-gray-300 rounded-lg bg-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-history mr-2"></i> Past Medical History (Checkup Records)
          </h2>
          <div className="space-y-4">
            {patientData.pastMedicalHistory && patientData.pastMedicalHistory.length > 0 ? (
              // Reverse to show latest first
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
              <p className="text-gray-600">No past checkup history available.</p>
            )}
          </div>
          <button
            onClick={() => setShowAddVisitModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition mt-4"
          >
            <i className="fas fa-plus mr-2"></i> Add Checkup History
          </button>
        </section>
        <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
         onClick={() => {
          navigate(`../../recommendation/${patientId}`, { relative: "path" }); // Navigate to nurse/recommendation page
          }}
        >
         Fix Appointment
        </button>

        {/* Add Visit Modal */}
        {showAddVisitModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 pt-20 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4 text-blue-700">Add New Checkup History</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleAddNewVisit(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Visit Date *</label>
                    <input type="date" name="visitDate" value={newVisitData.visitDate} onChange={handleAddVisitChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"/>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Reason for Visit *</label>
                    <input type="text" name="reasonForVisit" value={newVisitData.reasonForVisit} onChange={handleAddVisitChange} required placeholder="e.g., Follow-up for high BP" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"/>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Doctor Notes</label>
                    <textarea name="doctorNotes" value={newVisitData.doctorNotes} onChange={handleAddVisitChange} placeholder="Detailed doctor's observations and assessments" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight" rows="3"></textarea>
                  </div>

                  {/* Vitals for New Visit */}
                  <div className="col-span-2 border-t pt-4 mt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Vitals for this Visit</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1">BP (mmHg)</label>
                        <input type="text" name="vitals.bloodPressure" value={newVisitData.vitals?.bloodPressure || ""} onChange={handleAddVisitChange} placeholder="e.g., 120/80" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"/>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1">Pulse (bpm)</label>
                        <input type="number" name="vitals.pulseRate" value={newVisitData.vitals?.pulseRate || ""} onChange={handleAddVisitChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"/>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1">Temp (°C)</label>
                        <input type="number" step="0.1" name="vitals.temperature" value={newVisitData.vitals?.temperature || ""} onChange={handleAddVisitChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"/>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1">SpO₂ (%)</label>
                        <input type="number" name="vitals.spo2" value={newVisitData.vitals?.spo2 || ""} onChange={handleAddVisitChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"/>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1">Weight (kg)</label>
                        <input type="number" step="0.1" name="vitals.weight" value={newVisitData.vitals?.weight || ""} onChange={handleAddVisitChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"/>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1">Height (cm)</label>
                        <input type="number" name="vitals.height" value={newVisitData.vitals?.height || ""} onChange={handleAddVisitChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"/>
                      </div>
                    </div>
                  </div>

                  {/* Lab Results for New Visit */}
                  <div className="col-span-2 border-t pt-4 mt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Lab Results</h3>
                    {(newVisitData.labResults || []).map((lr, index) => (
                      <LabResultInput key={index} result={lr} index={index} onChange={handleVisitLabResultChange} onRemove={handleRemoveVisitLabResult}/>
                    ))}
                    <button type="button" onClick={handleAddVisitLabResult} className="bg-blue-200 hover:bg-blue-300 text-blue-800 text-sm px-3 py-1 rounded transition mt-2"><i className="fas fa-plus mr-1"></i> Add Lab Result</button>
                  </div>

                  {/* Prescriptions for New Visit */}
                  <div className="col-span-2 border-t pt-4 mt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Prescriptions</h3>
                    {(newVisitData.prescriptions || []).map((p, index) => (
                      <PrescriptionInput key={index} prescription={p} index={index} onChange={handleVisitPrescriptionChange} onRemove={handleRemoveVisitPrescription}/>
                    ))}
                    <button type="button" onClick={handleAddVisitPrescription} className="bg-blue-200 hover:bg-blue-300 text-blue-800 text-sm px-3 py-1 rounded transition mt-2"><i className="fas fa-plus mr-1"></i> Add Prescription</button>
                  </div>

                  {/* Lifestyle Suggestions */}
                  <div className="col-span-2 border-t pt-4 mt-4">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Lifestyle Suggestions</label>
                    <textarea name="lifestyleSuggestions" value={newVisitData.lifestyleSuggestions} onChange={handleAddVisitChange} placeholder="e.g., Reduce salt intake, increase physical activity" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight" rows="2"></textarea>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button type="button" onClick={() => setShowAddVisitModal(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition">
                    Cancel
                  </button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition" disabled={loading}>
                    {loading ? "Adding..." : "Add Checkup"}
                  </button>

                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PatientProfile;