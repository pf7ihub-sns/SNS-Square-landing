
"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  User,
  Phone,
  MapPin,
  AlertTriangle,
  CheckCircle,
  X,
  Check,
  Calendar,
  Heart,
  Briefcase,
  Home,
  Shield,
  CreditCard,
  UserCheck,
  FileText,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
} from "lucide-react"

function NewPatientRegistration() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  // Initialize formData with all schema fields
  const [formData, setFormData] = useState({
    full_name: "",
    gender: "",
    dob: "",
    age: "",
    marital_status: "",
    blood_group: "",
    occupation: "",
    mobile_number: "",
    alternate_number: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    district: "",
    state: "",
    pin_code: "",
    emergency_name: "",
    emergency_relation: "",
    emergency_phone: "",
    aadhaar_number: "",
    abha_id: "",
    insurance_provider: "",
    policy_number: "",
    id_verified: false,
    consent_taken: false,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [registeredPatientId, setRegisteredPatientId] = useState("")

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_DOCSENTRA || "http://localhost:8080"

  // Function to calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return ""
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age.toString()
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    // If date of birth is changed, automatically calculate and update age
    if (name === "dob") {
      const calculatedAge = calculateAge(value)
      setFormData((prevData) => ({
        ...prevData,
        dob: value,
        age: calculatedAge,
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setRegisteredPatientId("")

    const token = localStorage.getItem("token")
    if (!token) {
      setError("Authentication required. Please log in.")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/patients/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to register patient.")
      }

      const result = await response.json()
      console.log("Patient Registered Successfully:", result)

      if (result.success && result.patient_data) {
        const patientId = result.patient_data.patient_id
        alert(`Patient Registered Successfully! Patient ID: ${patientId}`)
        setRegisteredPatientId(patientId)
        navigate("../nurse/dashboard")
      } else {
        throw new Error(result.message || "Registration failed")
      }
    } catch (err) {
      console.error("Registration Error:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.full_name &&
          formData.gender &&
          formData.dob &&
          formData.marital_status &&
          formData.blood_group &&
          formData.occupation
        )
      case 2:
        return formData.mobile_number && formData.mobile_number.length === 10
      case 3:
        return (
          formData.address_line_1 &&
          formData.city &&
          formData.district &&
          formData.state &&
          formData.pin_code &&
          formData.pin_code.length === 6
        )
      case 4:
        return (
          formData.emergency_name &&
          formData.emergency_relation &&
          formData.emergency_phone &&
          formData.emergency_phone.length === 10
        )
      case 5:
        return formData.aadhaar_number && formData.id_verified && formData.consent_taken
      default:
        return true
    }
  }

  const handleReset = () => {
    setFormData({
      full_name: "",
      gender: "",
      dob: "",
      age: "",
      marital_status: "",
      blood_group: "",
      occupation: "",
      mobile_number: "",
      alternate_number: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      district: "",
      state: "",
      pin_code: "",
      emergency_name: "",
      emergency_relation: "",
      emergency_phone: "",
      aadhaar_number: "",
      abha_id: "",
      insurance_provider: "",
      policy_number: "",
      id_verified: false,
      consent_taken: false,
    })
    setError(null)
    setRegisteredPatientId("")
    setCurrentStep(1)
  }

  // Options for dropdowns
  const genderOptions = ["", "Male", "Female", "Other"]
  const bloodGroupOptions = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  const stateOptions = ["", "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "West Bengal"]
  const districtOptions = {
    "": [""],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Delhi: ["Central Delhi", "North Delhi", "South Delhi"],
    Karnataka: ["Bengaluru Urban", "Mysuru", "Hubballi-Dharwad"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi"],
    "West Bengal": ["Kolkata", "Howrah", "North 24 Parganas"],
  }
  const relationOptions = ["", "Parent", "Spouse", "Child", "Sibling", "Other"]
  const insuranceProviderOptions = ["", "Ayushman Bharat", "Star Health", "Max Bupa", "HDFC ERGO", "Others"]
  const maritalStatusOptions = ["", "Single", "Married", "Divorced", "Widowed"]

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Patient Identity"
      case 2:
        return "Contact Information"
      case 3:
        return "Address Information"
      case 4:
        return "Emergency Contact"
      case 5:
        return "Verification & Consent"
      default:
        return "Registration"
    }
  }

  const getStepIcon = () => {
    switch (currentStep) {
      case 1:
        return <User className="w-5 h-5" />
      case 2:
        return <Phone className="w-5 h-5" />
      case 3:
        return <MapPin className="w-5 h-5" />
      case 4:
        return <AlertTriangle className="w-5 h-5" />
      case 5:
        return <CheckCircle className="w-5 h-5" />
      default:
        return <User className="w-5 h-5" />
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Basic patient information and demographics"
      case 2:
        return "Phone numbers and contact details"
      case 3:
        return "Complete address and location details"
      case 4:
        return "Emergency contact person information"
      case 5:
        return "Document verification and consent"
      default:
        return ""
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="full_name" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <User className="w-4 h-4 mr-2 text-blue-600" />
            Full Name *
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            placeholder="Enter patient's full name"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="gender" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <User className="w-4 h-4 mr-2 text-blue-600" />
            Gender *
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          >
            {genderOptions.map((option) => (
              <option key={option} value={option}>
                {option || "Select Gender"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="dob" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
            Date of Birth *
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="age" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            Age (Auto-calculated)
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            readOnly
            placeholder="Age will be calculated from DOB"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="marital_status" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <Heart className="w-4 h-4 mr-2 text-blue-600" />
            Marital Status *
          </label>
          <select
            id="marital_status"
            name="marital_status"
            value={formData.marital_status}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          >
            {maritalStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option || "Select Marital Status"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="blood_group" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <Heart className="w-4 h-4 mr-2 text-red-500" />
            Blood Group *
          </label>
          <select
            id="blood_group"
            name="blood_group"
            value={formData.blood_group}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          >
            {bloodGroupOptions.map((option) => (
              <option key={option} value={option}>
                {option || "Select Blood Group"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="occupation" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
          <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
          Occupation *
        </label>
        <input
          type="text"
          id="occupation"
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          required
          placeholder="Enter occupation"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="mobile_number" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <Phone className="w-4 h-4 mr-2 text-blue-600" />
            Mobile Number *
          </label>
          <input
            type="tel"
            id="mobile_number"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            maxLength="10"
            placeholder="Enter 10-digit mobile number"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="alternate_number" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            Alternate Phone Number
          </label>
          <input
            type="tel"
            id="alternate_number"
            name="alternate_number"
            value={formData.alternate_number}
            onChange={handleChange}
            pattern="[0-9]{10}"
            maxLength="10"
            placeholder="Enter alternate 10-digit number (optional)"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          />
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <label htmlFor="address_line_1" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <Home className="w-4 h-4 mr-2 text-blue-600" />
            Address Line 1 *
          </label>
          <input
            type="text"
            id="address_line_1"
            name="address_line_1"
            value={formData.address_line_1}
            onChange={handleChange}
            required
            placeholder="House No., Street Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="address_line_2" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <Home className="w-4 h-4 mr-2 text-gray-400" />
            Address Line 2
          </label>
          <input
            type="text"
            id="address_line_2"
            name="address_line_2"
            value={formData.address_line_2}
            onChange={handleChange}
            placeholder="Apartment, Landmark (optional)"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="city" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="w-4 h-4 mr-2 text-blue-600" />
            City *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            placeholder="Enter city"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="state" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="w-4 h-4 mr-2 text-blue-600" />
            State *
          </label>
          <select
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          >
            {stateOptions.map((option) => (
              <option key={option} value={option}>
                {option || "Select State"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="district" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="w-4 h-4 mr-2 text-blue-600" />
            District *
          </label>
          <select
            id="district"
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          >
            {districtOptions[formData.state || ""].map((option) => (
              <option key={option} value={option}>
                {option || "Select District"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="pin_code" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="w-4 h-4 mr-2 text-blue-600" />
            Pin Code *
          </label>
          <input
            type="text"
            id="pin_code"
            name="pin_code"
            value={formData.pin_code}
            onChange={handleChange}
            required
            pattern="[0-9]{6}"
            maxLength="6"
            placeholder="Enter 6-digit pin code"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          />
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="emergency_name" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <User className="w-4 h-4 mr-2 text-red-500" />
            Name *
          </label>
          <input
            type="text"
            id="emergency_name"
            name="emergency_name"
            value={formData.emergency_name}
            onChange={handleChange}
            required
            placeholder="Enter emergency contact name"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="emergency_relation" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <Heart className="w-4 h-4 mr-2 text-red-500" />
            Relation *
          </label>
          <select
            id="emergency_relation"
            name="emergency_relation"
            value={formData.emergency_relation}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          >
            {relationOptions.map((option) => (
              <option key={option} value={option}>
                {option || "Select Relation"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="emergency_phone" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <Phone className="w-4 h-4 mr-2 text-red-500" />
            Phone Number *
          </label>
          <input
            type="tel"
            id="emergency_phone"
            name="emergency_phone"
            value={formData.emergency_phone}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            maxLength="10"
            placeholder="Enter 10-digit phone number"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          />
        </div>
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="aadhaar_number" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
            Aadhaar Number *
          </label>
          <input
            type="text"
            id="aadhaar_number"
            name="aadhaar_number"
            value={formData.aadhaar_number}
            onChange={handleChange}
            required
            placeholder="XXXX-XXXX-XXXX"
            pattern="[0-9]{4}-?[0-9]{4}-?[0-9]{4}"
            maxLength="14"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="abha_id" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <Shield className="w-4 h-4 mr-2 text-green-600" />
            ABHA ID
          </label>
          <input
            type="text"
            id="abha_id"
            name="abha_id"
            value={formData.abha_id}
            onChange={handleChange}
            placeholder="Enter ABHA ID (if available)"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="insurance_provider" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <Shield className="w-4 h-4 mr-2 text-blue-600" />
            Insurance Provider
          </label>
          <select
            id="insurance_provider"
            name="insurance_provider"
            value={formData.insurance_provider}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          >
            {insuranceProviderOptions.map((option) => (
              <option key={option} value={option}>
                {option || "Select Insurance Provider"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="policy_number" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <FileText className="w-4 h-4 mr-2 text-blue-600" />
            Policy Number
          </label>
          <input
            type="text"
            id="policy_number"
            name="policy_number"
            value={formData.policy_number}
            onChange={handleChange}
            placeholder="Enter policy number (optional)"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          />
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center mb-4">
          <UserCheck className="w-6 h-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-bold text-gray-800">Verification & Consent</h3>
        </div>

        <div className="space-y-4">
          <label className="flex items-start space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              name="id_verified"
              checked={formData.id_verified}
              onChange={handleChange}
              required
              className="mt-1 h-5 w-5 text-blue-600 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
            <div className="flex-1">
              <span className="text-gray-800 font-medium group-hover:text-blue-700 transition-colors">
                Identity Verification Completed *
              </span>
              <p className="text-sm text-gray-600 mt-1">
                I have verified the patient's identity documents and confirmed their authenticity
              </p>
            </div>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              name="consent_taken"
              checked={formData.consent_taken}
              onChange={handleChange}
              required
              className="mt-1 h-5 w-5 text-blue-600 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
            <div className="flex-1">
              <span className="text-gray-800 font-medium group-hover:text-blue-700 transition-colors">
                Patient Consent Obtained *
              </span>
              <p className="text-sm text-gray-600 mt-1">
                Patient has provided informed consent for data collection, storage, and medical treatment
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      case 4:
        return renderStep4()
      case 5:
        return renderStep5()
      default:
        return renderStep1()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Left Sidebar */}
      <div className="w-80 bg-white shadow-xl border-r border-gray-200 fixed left-0 top-0 h-full ">
        <div className="p-6 pt-27">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#669BBC] rounded-xl mb-3">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Patient Registration</h1>
            <p className="text-sm text-gray-600">Complete all steps to register</p>
          </div>

          {/* Step Navigation */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((step) => {
              const isCompleted = step < currentStep
              const isCurrent = step === currentStep
              const isUpcoming = step > currentStep

              return (
                <div
                  key={step}
                  className={`flex items-center p-4 rounded-xl transition-all duration-200 cursor-pointer ${isCurrent
                    ? "bg-blue-50 border-2 border-blue-200 shadow-sm"
                    : isCompleted
                      ? "bg-green-50 border border-green-200"
                      : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                    }`}
                  onClick={() => {
                    if (step <= currentStep) {
                      setCurrentStep(step)
                    }
                  }}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mr-3 ${isCompleted
                      ? "bg-green-500 text-white"
                      : isCurrent
                        ? "bg-[#669BBC] text-white"
                        : "bg-gray-300 text-gray-600"
                      }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : step}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`font-semibold text-sm ${isCurrent ? "text-[#003049]" : isCompleted ? "text-green-700" : "text-gray-600"}`}
                    >
                      {step === 1 && "Patient Identity"}
                      {step === 2 && "Contact Info"}
                      {step === 3 && "Address"}
                      {step === 4 && "Emergency Contact"}
                      {step === 5 && "Verification"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {step === 1 && "Basic information"}
                      {step === 2 && "Phone numbers"}
                      {step === 3 && "Location details"}
                      {step === 4 && "Emergency person"}
                      {step === 5 && "Documents & consent"}
                    </div>
                  </div>
                  {isCurrent && <ChevronRight className="w-4 h-4 text-blue-600" />}
                </div>
              )
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleReset}
            className="w-full mt-6 flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 text-sm font-medium"
            disabled={isLoading}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Form
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-80">
        <div className="p-8 pt-26">
          {/* Error and Success Messages */}
          {error && (
            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm" role="alert">
                <div className="flex items-start">
                  <X className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-800">Registration Failed</h3>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {registeredPatientId && (
            <div className="mb-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm" role="alert">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-800">Registration Successful!</h3>
                    <p className="text-green-700 text-sm mt-1">
                      Patient ID:{" "}
                      <code className="bg-green-100 px-2 py-1 rounded text-xs font-mono">{registeredPatientId}</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            {/* Step Header */}
            <div className=" px-8 py-6 rounded-t-2xl">
              <div className="flex items-center text-white">
                <div className="mr-4 p-2 bg-[#669BBC] rounded-xl">{getStepIcon()}</div>
                <div>
                  <h2 className="text-2xl font-bold text-[#000000]">{getStepTitle()}</h2>
                  <p className="text-[#8E8E8E] text-sm mt-1">{getStepDescription()}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              {/* Step Content */}
              <div className="mb-8">{renderCurrentStep()}</div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <div>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 font-semibold shadow-sm"
                      disabled={isLoading}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </button>
                  )}
                </div>

                <div>
                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateCurrentStep() || isLoading}
                      className="inline-flex items-center px-8 py-3 bg-[#003049] text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-sm"
                    >
                      Next Step
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!validateCurrentStep() || isLoading}
                      className="inline-flex items-center px-8 py-3 bg-[#003049] text-white rounded-xl hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-bold shadow-sm"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Registering...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Register Patient
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewPatientRegistration