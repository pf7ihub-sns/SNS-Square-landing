import React, { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import JodDecriptionHero from './JodDecriptionHero';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { AiOutlineCloudUpload, AiOutlineFilePdf, AiOutlineFileWord, AiOutlineFile } from 'react-icons/ai';
import { MdClose, MdCheck } from 'react-icons/md';

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

// Modern Resume Upload Component
const ResumeUpload = ({ uploadedFiles, setUploadedFiles }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Get file icon based on extension
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <AiOutlineFilePdf className="w-5 h-5 text-red-600" />;
      case 'doc':
      case 'docx':
        return <AiOutlineFileWord className="w-5 h-5 text-blue-600" />;
      default:
        return <AiOutlineFile className="w-5 h-5 text-gray-600" />;
    }
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      const validTypes = ['.doc', '.docx', '.pdf', '.odt', '.rtf'];
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      return validTypes.includes(extension) && file.size <= 10 * 1024 * 1024; // 10MB limit
    });

    if (validFiles.length > 0) {
      const fileObjects = validFiles.map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        size: file.size,
        file: file,
        uploaded: false
      }));
      
      setUploadedFiles(prev => [...prev, ...fileObjects]);
      
      // Simulate upload
      fileObjects.forEach(fileObj => {
        setTimeout(() => {
          setUploadedFiles(prev => 
            prev.map(f => f.id === fileObj.id ? { ...f, uploaded: true } : f)
          );
        }, 1000);
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ease-in-out cursor-pointer
          ${isDragging 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".doc,.docx,.pdf,.odt,.rtf"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-3">
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300
            ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}
          `}>
            <AiOutlineCloudUpload className={`w-6 h-6 ${isDragging ? 'text-blue-600' : 'text-gray-600'}`} />
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              DOC, DOCX, PDF, ODT, RTF (max 10MB)
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Files Display */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadedFiles.map((file) => (
            <div 
              key={file.id} 
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {getFileIcon(file.name)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {file.uploaded && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <MdCheck className="w-4 h-4" />
                    <span className="text-xs">Uploaded</span>
                  </div>
                )}
                
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Remove file"
                >
                  <MdClose className="w-4 h-4 text-gray-500 hover:text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
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

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* JobDescription Hero Section */}
      <JodDecriptionHero />

      <div className="w-full max-w-[1440px] mx-auto pt-8 px-2 sm:px-4 lg:px-8">
        <div className="w-full h-px bg-black opacity-10 mb-12"/>
      </div>

      {/* Application Form with Scrollable Layout */}
      <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-8 py-4 pb-20">
        
        {/* Two Column Layout: Scrollable Left + Sticky Right */}
        <div className="grid grid-cols-3 gap-12 relative">
          
          {/* Left Column - Scrollable Content (2/3 width) */}
          <div className="col-span-2">
            
            {/* Personal Details Section */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-base font-medium text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Personal Details
                </h2>
                <button 
                  className="text-base font-medium text-gray-900 hover:text-gray-700 transition-colors" 
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  Clear
                </button>
              </div>

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

            {/* Education & Experience Section */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-base font-medium text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Education & Experience
                </h2>
                <button 
                  className="text-base font-medium text-gray-900 hover:text-gray-700 transition-colors" 
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  Clear
                </button>
              </div>

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

            {/* Skills & Expertise Section */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-base font-medium text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Skills & Expertise
                </h2>
                <button 
                  className="text-base font-medium text-gray-900 hover:text-gray-700 transition-colors" 
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  Clear
                </button>
              </div>

              <FormField
                label="Skill Set"
                value={formData.skillSet}
                onChange={(value) => handleInputChange("skillSet", value)}
                placeholder="Enter your skills (e.g., React, JavaScript, Python)"
                required={true}
              />
            </div>
          </div>

          {/* Vertical Divider Line */}
          <div className="absolute left-[66.666%] top-0 bottom-0 w-px bg-gray-300 opacity-30"></div>

          {/* Right Column - Sticky Resume Upload & Apply Button (1/3 width) */}
          <div className="col-span-1 sticky top-28 h-fit max-h-[calc(100vh-7rem)] overflow-y-auto">
            <div className="pl-8 space-y-8">
              
              {/* Resume Section Header */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Resume*
                </h3>
                
                {/* Resume Upload Component */}
                <ResumeUpload 
                  uploadedFiles={uploadedFiles}
                  setUploadedFiles={setUploadedFiles}
                />
              </div>

              {/* Apply Button */}
              <div className="pt-8 sticky bottom-0 bg-white pb-4">
                <button className="w-full bg-gray-900 text-white px-8 py-3 rounded text-base font-medium hover:bg-gray-800 transition-colors" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplication;
