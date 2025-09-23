import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import JodDecriptionHero from './JodDecriptionHero';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

// Material-UI FormField component
const FormField = ({
  label,
  value,
  onChange,
  type = "text",
  isDropdown = false,
  placeholder = "",
  maxLength,
  required = false,
}) => {
  
  // Dropdown options based on field type
  const getDropdownOptions = () => {
    if (label.includes("Gender")) {
      return ["Male", "Female", "Other", "Prefer not to say"];
    } else if (label.includes("Experience")) {
      return ["0-1 years", "1-2 years", "2-3 years", "3-5 years", "5-8 years", "8+ years"];
    } else if (label.includes("Notice Period")) {
      return ["Immediate", "15 days", "1 month", "2 months", "3 months"];
    } else if (label.includes("CTC")) {
      return ["0-3 LPA", "3-5 LPA", "5-8 LPA", "8-12 LPA", "12-15 LPA", "15-20 LPA", "20+ LPA"];
    } else if (label.includes("Prefered Location")) {
      return ["Chennai", "Coimbatore", "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Remote"];
    }
    return [];
  };
  
  const handleFieldInputChange = (e) => {
    let inputValue = e.target.value;
    
    // Apply specific validations based on field type or label
    if (type === "email") {
      inputValue = inputValue.toLowerCase();
    } else if (label.includes("Contact")) {
      inputValue = inputValue.replace(/[^0-9]/g, '');
      if (maxLength && inputValue.length > maxLength) {
        inputValue = inputValue.slice(0, maxLength);
      }
    } else if (label.includes("Name") || label.includes("Location")) {
      inputValue = inputValue.replace(/[^a-zA-Z\s]/g, '');
    } else if (label.includes("Year of Graduation")) {
      inputValue = inputValue.replace(/[^0-9]/g, '');
      if (inputValue.length > 4) {
        inputValue = inputValue.slice(0, 4);
      }
    }
    
    onChange(inputValue);
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      {isDropdown ? (
        <TextField
          select
          label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          variant="standard"
          fullWidth
          required={required}
          placeholder={placeholder}
        >
          {getDropdownOptions().map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      ) : (
        <TextField
          label={label}
          value={value}
          onChange={handleFieldInputChange}
          type={type}
          variant="standard"
          fullWidth
          required={required}
          placeholder={placeholder}
          inputProps={{ maxLength }}
        />
      )}
    </Box>
  );
};

const JobApplication = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    gender: "",
    currentLocation: "",
    preferredLocation: "",
    yearOfGraduation: "",
    experienceYears: "",
    noticePeriod: "",
    currentCTC: "",
    expectedCTC: "",
    skillSet: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };



  return (
    <div className="min-h-screen bg-white">
      {/* JobDescription Hero Section */}
      <JodDecriptionHero />
      
      {/* Application Form */}
      <div className="max-w-[1480px] mx-auto px-4 sm:px-8 lg:px-24 py-16">
        {/* Personal Details Section */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-base font-medium text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>Personal Details</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 justify-start">
            <div className="lg:col-span-2">
              <div className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-8">
                  <FormField
                    label="First Name"
                    value={formData.firstName}
                    onChange={(value) => handleInputChange("firstName", value)}
                    placeholder="Enter your first name"
                    maxLength={50}
                    required={true}
                  />
                  <FormField
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(value) => handleInputChange("lastName", value)}
                    placeholder="Enter your last name"
                    maxLength={50}
                  />
                </div>

                <FormField
                  label="Email ID"
                  value={formData.email}
                  onChange={(value) => handleInputChange("email", value)}
                  type="email"
                  placeholder="Enter your email address"
                  required={true}
                />

                <div className="grid sm:grid-cols-2 gap-8">
                  <FormField
                    label="Contact"
                    value={formData.contact}
                    onChange={(value) => handleInputChange("contact", value)}
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                    required={true}
                  />
                  <FormField
                    label="Gender"
                    value={formData.gender}
                    onChange={(value) => handleInputChange("gender", value)}
                    isDropdown={true}
                    placeholder="Select Gender"
                    required={true}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-8">
                  <FormField
                    label="Current Location"
                    value={formData.currentLocation}
                    onChange={(value) => handleInputChange("currentLocation", value)}
                    placeholder="Enter your current city"
                    required={true}
                  />
                  <FormField
                    label="Prefered Location"
                    value={formData.preferredLocation}
                    onChange={(value) => handleInputChange("preferredLocation", value)}
                    isDropdown={true}
                    placeholder="Select Preferred Location"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 flex flex-col">
              <div className="mb-8">
                <h3 className="text-base font-medium text-gray-900 mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>Resume*</h3>
                <div className="w-full h-20 border-2 border-dashed border-blue-200 bg-blue-50 rounded flex flex-col items-center justify-center text-center px-4">
                  <div className="flex flex-wrap items-center justify-center gap-1 mb-1">
                    <span className="text-sm text-red-500 cursor-pointer" style={{ fontFamily: 'Montserrat, sans-serif' }}>Upload your resume</span>
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>or drag and drop it here</span>
                  </div>
                  <div className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <div>Only .doc, .docx, .pdf, .odt, .rtf</div>
                    <div>(Optional)</div>
                  </div>
                </div>
              </div>

              {/* Apply Button in Right Column */}
              <div className="mt-auto">
                <button className="w-full bg-gray-900 text-white px-8 py-3 rounded text-base font-medium hover:bg-gray-800 transition-colors" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Education & Experience Section */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-base font-medium text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>Education & Experience</h2>
          </div>

          <div className="lg:w-2/3 text-left">
            <div className="space-y-8">
              <FormField
                label="Year of Graduation"
                value={formData.yearOfGraduation}
                onChange={(value) => handleInputChange("yearOfGraduation", value)}
                placeholder="YYYY (e.g., 2020)"
                maxLength={4}
                required={true}
              />

              <div className="grid sm:grid-cols-2 gap-8">
                <FormField
                  label="Experience in Years"
                  value={formData.experienceYears}
                  onChange={(value) => handleInputChange("experienceYears", value)}
                  isDropdown={true}
                  placeholder="Select Experience"
                  required={true}
                />
                <FormField
                  label="Notice Period"
                  value={formData.noticePeriod}
                  onChange={(value) => handleInputChange("noticePeriod", value)}
                  isDropdown={true}
                  placeholder="Select Notice Period"
                  required={true}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <FormField
                  label="Current CTC (In Lakhs Annum)"
                  value={formData.currentCTC}
                  onChange={(value) => handleInputChange("currentCTC", value)}
                  isDropdown={true}
                  placeholder="Select Current CTC"
                />
                <FormField
                  label="Expected CTC (In Lakhs Annum)"
                  value={formData.expectedCTC}
                  onChange={(value) => handleInputChange("expectedCTC", value)}
                  isDropdown={true}
                  placeholder="Select Expected CTC"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Expertise Section */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-base font-medium text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>Skills & Expertise</h2>
          </div>

          <div className="lg:w-2/3 text-left">
            <FormField
              label="Skill Set"
              value={formData.skillSet}
              onChange={(value) => handleInputChange("skillSet", value)}
              placeholder="Enter your skills (e.g., React, JavaScript, Python)"
              required={true}
            />
          </div>
        </div>


      </div>
    </div>
  );
};

export default JobApplication;
