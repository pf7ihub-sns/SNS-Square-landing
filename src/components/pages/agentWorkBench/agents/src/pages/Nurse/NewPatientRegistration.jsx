
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
  ChevronDown,
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

  const goToStep = (stepNum) => {
    // Allow navigation to current step or any previous step
    // But not to future steps (user must complete current step first)
    if (stepNum <= currentStep) {
      setCurrentStep(stepNum)
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
  const maritalStatusOptions = ["", "Single", "Married", "Divorced", "Widowed",]

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
          <label htmlFor="full_name" className="text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            placeholder="Enter full name"
            style={{ backgroundColor: '#F9F9F9' }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        <div className="space-y-2 relative">
          <label htmlFor="gender" className="text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            style={{ backgroundColor: '#F9F9F9' }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
          >
            {genderOptions.map((option) => (
              <option key={option} value={option}>
                {option || "Select any one"}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-[42px] pointer-events-none">
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="dob" className="text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            style={{ backgroundColor: '#F9F9F9' }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="age" className="text-sm font-medium text-gray-700">
            Age (Auto Calculated)
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            readOnly
            placeholder="Age will be calculated from DOB"
            style={{ backgroundColor: '#F9F9F9' }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-600"
          />
        </div>

        <div className="space-y-2 relative">
          <label htmlFor="marital_status" className="text-sm font-medium text-gray-700">
            Marital Status
          </label>
          <select
            id="marital_status"
            name="marital_status"
            value={formData.marital_status}
            onChange={handleChange}
            required
            style={{ backgroundColor: '#F9F9F9' }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
          >
            {maritalStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option || "Select any one"}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-[42px] pointer-events-none">
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </div>
        </div>

        <div className="space-y-2 relative">
          <label htmlFor="blood_group" className="text-sm font-medium text-gray-700">
            Blood Group
          </label>
          <select
            id="blood_group"
            name="blood_group"
            value={formData.blood_group}
            onChange={handleChange}
            required
            style={{ backgroundColor: '#F9F9F9' }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
          >
            {bloodGroupOptions.map((option) => (
              <option key={option} value={option}>
                {option || "Select any one"}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-[42px] pointer-events-none">
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="occupation" className="text-sm font-medium text-gray-700">
          Occupation
        </label>
        <input
          type="text"
          id="occupation"
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          required
          placeholder="Enter occupation"
          style={{ backgroundColor: '#F9F9F9' }}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="mobile_number" className="text-sm font-medium text-gray-700">
            Mobile Number
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
            style={{ backgroundColor: '#F9F9F9' }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="alternate_number" className="text-sm font-medium text-gray-700">
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
            style={{ backgroundColor: '#F9F9F9' }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <label htmlFor="address_line_1" className="text-sm font-medium text-gray-700">
            Address Line 1
          </label>
          <input
            type="text"
            id="address_line_1"
            name="address_line_1"
            value={formData.address_line_1}
            onChange={handleChange}
            required
            placeholder="House No., Street Name"
            style={{ backgroundColor: '#F9F9F9' }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="address_line_2" className="text-sm font-medium text-gray-700">
            Address Line 2
          </label>
          <input
            type="text"
            id="address_line_2"
            name="address_line_2"
            value={formData.address_line_2}
            onChange={handleChange}
            placeholder="Apartment, Landmark (optional)"
            style={{ backgroundColor: '#F9F9F9' }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            placeholder="Enter city"
            style={{ backgroundColor: '#F9F9F9' }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        <div className="space-y-2 relative">
          <label htmlFor="state" className="text-sm font-medium text-gray-700">
            State
          </label>
          <select
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            style={{ backgroundColor: '#F9F9F9' }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
          >
            {stateOptions.map((option) => (
              <option key={option} value={option}>
                {option || "Select any one"}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-[42px] pointer-events-none">
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </div>
        </div>

        <div className="space-y-2 relative">
          <label htmlFor="district" className="text-sm font-medium text-gray-700">
            District
          </label>
          <select
            id="district"
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
            style={{ backgroundColor: '#F9F9F9' }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
          >
            {districtOptions[formData.state || ""].map((option) => (
              <option key={option} value={option}>
                {option || "Select any one"}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-[42px] pointer-events-none">
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="pin_code" className="text-sm font-medium text-gray-700">
            Pin Code
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
            style={{ backgroundColor: '#F9F9F9' }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="emergency_name" className="text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="emergency_name"
            name="emergency_name"
            value={formData.emergency_name}
            onChange={handleChange}
            required
            placeholder="Enter emergency contact name"
            style={{ backgroundColor: '#F9F9F9' }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        <div className="space-y-2 relative">
          <label htmlFor="emergency_relation" className="text-sm font-medium text-gray-700">
            Relation
          </label>
          <select
            id="emergency_relation"
            name="emergency_relation"
            value={formData.emergency_relation}
            onChange={handleChange}
            required
            style={{ backgroundColor: '#F9F9F9' }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
          >
            {relationOptions.map((option) => (
              <option key={option} value={option}>
                {option || "Select any one"}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-[42px] pointer-events-none">
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="emergency_phone" className="text-sm font-medium text-gray-700">
            Phone Number
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
            style={{ backgroundColor: '#F9F9F9' }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="aadhaar_number" className="text-sm font-medium text-gray-700">
            Aadhaar Number
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
            style={{ backgroundColor: '#F9F9F9' }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="abha_id" className="text-sm font-medium text-gray-700">
            ABHA ID
          </label>
          <input
            type="text"
            id="abha_id"
            name="abha_id"
            value={formData.abha_id}
            onChange={handleChange}
            placeholder="Enter ABHA ID (if available)"
            style={{ backgroundColor: '#F9F9F9' }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        <div className="space-y-2 relative">
          <label htmlFor="insurance_provider" className="text-sm font-medium text-gray-700">
            Insurance Provider
          </label>
          <select
            id="insurance_provider"
            name="insurance_provider"
            value={formData.insurance_provider}
            onChange={handleChange}
            style={{ backgroundColor: '#F9F9F9' }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
          >
            {insuranceProviderOptions.map((option) => (
              <option key={option} value={option}>
                {option || "Select any one"}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-[42px] pointer-events-none">
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="policy_number" className="text-sm font-medium text-gray-700">
            Policy Number
          </label>
          <input
            type="text"
            id="policy_number"
            name="policy_number"
            value={formData.policy_number}
            onChange={handleChange}
            placeholder="Enter policy number (optional)"
            style={{ backgroundColor: '#F9F9F9' }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl p-6 space-y-4" style={{ backgroundColor: '#F9F9F9' }}>
        <div className="flex items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Verification & Consent</h3>
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
              <span className="text-gray-800 font-medium">
                Identity Verification Completed
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
              <span className="text-gray-800 font-medium">
                Patient Consent Obtained
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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate("../nurse-dashboard", { relative: "path" })}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 mr-3"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Docsentra</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto px-6 lg:px-8 py-8 lg:py-14" style={{ maxWidth: '89rem' }}>
        {/* Card 1: Horizontal Navigation Tabs */}
        <div className="bg-white rounded-xl border border-[#B6B9BE] p-6 mb-6">
          <div className="flex items-center justify-between px-4">
            {[
              { num: 1, title: "Patient Identity", subtitle: "Basic Information" },
              { num: 2, title: "Contact Info", subtitle: "Phone numbers" },
              { num: 3, title: "Address", subtitle: "Location details" },
              { num: 4, title: "Emergency Contact", subtitle: "Emergency person" },
              { num: 5, title: "Verification", subtitle: "Documents & Consent" }
            ].map((step, index) => (
              <div key={step.num} className="flex items-center">
                {/* Step Circle and Labels */}
                <div className="flex flex-col items-left">
                  <div className="flex items-center mb-2">
                    <button
                      type="button"
                      onClick={() => goToStep(step.num)}
                      disabled={step.num > currentStep}
                      className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-base transition-all duration-300 ${
                        currentStep === step.num
                          ? "bg-blue-600 text-white"
                          : currentStep > step.num
                          ? "bg-blue-600 text-white cursor-pointer hover:scale-110"
                          : "bg-[#E8E8E8] text-gray-400 cursor-not-allowed"
                      } ${step.num <= currentStep ? "hover:shadow-lg" : ""}`}
                    >
                      {currentStep > step.num ? <Check className="w-5 h-5" /> : step.num}
                    </button>
                    
                    {/* Progress Line */}
                    {index < 4 && (
                      <div className="relative" style={{ width: '200px', marginLeft: '12px' }}>
                        <div className="h-2 bg-gray-300 w-full rounded-full"></div>
                        <div 
                          className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-300 ${
                            currentStep > step.num ? "bg-blue-600 w-full" : "bg-gray-300 w-0"
                          }`}
                        ></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Labels */}
                  <div className="text-left">
                    <p className={`text-[16px] font-semibold mb-0.5 whitespace-nowrap ${
                      currentStep === step.num ? "text-gray-900" : "text-gray-400"
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-[10px] text-gray-400 whitespace-nowrap">{step.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Form Content */}
        <div className="bg-white rounded-xl  border border-[#B6B9BE] p-8">
          <div className="mb-8">
          {/* Step Header */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{getStepTitle()}</h2>
            <p className="text-gray-600 text-sm">{getStepDescription()}</p>
          </div>

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
          <form onSubmit={handleSubmit}>
            {/* Step Content */}
            <div className="mb-8">{renderCurrentStep()}</div>

            {/* Navigation Buttons */}
            <div className="flex justify-end items-center pt-6 gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-semibold"
                  disabled={isLoading}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateCurrentStep() || isLoading}
                  className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!validateCurrentStep() || isLoading}
                  className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-bold"
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
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewPatientRegistration