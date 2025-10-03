import React, { useState, useMemo } from 'react';
import countryList from 'react-select-country-list';
import BlackButton from '../../common/BlackButton';
import Footer from './Footer';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyEmail: '',
    companyName: '',
    country: '',
    industry: '',
    message: '',
    consent: false
  });

  // Get all countries from the library
  const countries = useMemo(() => countryList().getData(), []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const textFieldStyles = {
    '& .MuiInput-underline:before': {
      borderBottomColor: '#D1D5DB',
      borderBottomWidth: '2px',
    },
    '& .MuiInput-underline:hover:before': {
      borderBottomColor: '#9CA3AF',
      borderBottomWidth: '2px',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#3B82F6',
      borderBottomWidth: '2px',
    },
  };

  const labelStyles = {
    color: '#6B7280',
    fontSize: '1rem',
  };

  return (
    <div className="bg-gradient-to-r from-[#b0c8f6] via-[#D8E9FC] to-[#d2efff] font-inter ">
    <div
      className="bg-fill p-6 bg-gradient-to-t from-transparent to-white h-[100%]"
    >
      {/* Main Content */}
      <main className="max-w-7xl mx-auto mt-24 pb-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Content */}
          <div className="relative space-y-6">
            {/* Background image shifted down */}
            <img
              src="/images/GlassCube.png"
              alt="Glass Cube"
              className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 mt-10 w-40vh h-auto"
            />

            <h3 className="text-black leading-tight relative z-10">
              Connect with our experts to explore your use case in detail
            </h3>
            <p className="text-gray-600 leading-relaxed mt-4 relative z-10">
              Schedule a consultation to explore how our Agent Platform will drives the value and innovation you need.
            </p>
          </div>

          {/* Right Content - Contact Form */}
          <div className="bg-white rounded-md shadow-sm border border-gray-200">
            <div className="p-6 gap-8 flex flex-col">
              {/* First Row - Name Fields */}
              <div className="grid grid-cols-2 gap-8">
                <TextField
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  label="First Name"
                  variant="standard"
                  fullWidth
                  required
                  InputLabelProps={{
                    sx: labelStyles
                  }}
                  sx={textFieldStyles}
                />
                <TextField
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  label="Last Name"
                  variant="standard"
                  fullWidth
                  InputLabelProps={{
                    sx: labelStyles
                  }}
                  sx={textFieldStyles}
                />
              </div>

              {/* Company Email */}
              <TextField
                type="email"
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleInputChange}
                label="Company Email"
                variant="standard"
                fullWidth
                required
                InputLabelProps={{
                  sx: labelStyles
                }}
                sx={textFieldStyles}
              />

              {/* Company Name */}
              <TextField
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                label="Company Name"
                variant="standard"
                fullWidth
                required
                InputLabelProps={{
                  sx: labelStyles
                }}
                sx={textFieldStyles}
              />

              {/* Country and Industry Row */}
              <div className="grid grid-cols-2 gap-8">
                <TextField
                  select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  label="Country"
                  variant="standard"
                  fullWidth
                  required
                  InputLabelProps={{
                    sx: labelStyles
                  }}
                  sx={textFieldStyles}
                >
                  <MenuItem value="">Select Country</MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country.value} value={country.value}>
                      {country.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  label="Industry"
                  variant="standard"
                  fullWidth
                  required
                  InputLabelProps={{
                    sx: labelStyles
                  }}
                  sx={textFieldStyles}
                >
                  <MenuItem value="">Select Industry</MenuItem>
                  <MenuItem value="technology">Technology</MenuItem>
                  <MenuItem value="healthcare">Healthcare</MenuItem>
                  <MenuItem value="finance">Finance</MenuItem>
                  <MenuItem value="education">Education</MenuItem>
                  <MenuItem value="retail">Retail</MenuItem>
                  <MenuItem value="manufacturing">Manufacturing</MenuItem>
                  <MenuItem value="consulting">Consulting</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </div>

              {/* Message Field */}
              <TextField
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                label="Leave us a message"
                variant="standard"
                fullWidth
                multiline
                rows={4}
                InputLabelProps={{
                  sx: labelStyles
                }}
                sx={textFieldStyles}
              />

              {/* Consent Checkbox */}
              <FormControlLabel
                control={
                  <Checkbox
                    name="consent"
                    checked={formData.consent}
                    onChange={handleInputChange}
                    sx={{
                      color: '#D1D5DB',
                      '&.Mui-checked': {
                        color: '#3B82F6',
                      },
                    }}
                  />
                }
                label={
                  <span className="text-sm text-gray-700 leading-relaxed">
                    By submitting, I consent to receive relevant email communication from SNS Square in accordance with the Privacy Policy and understand I can opt out at any time.*
                  </span>
                }
                sx={{ alignItems: 'flex-start', marginLeft: '-9px' }}
              />

              {/* Submit Button */}
              <div className="">
                <BlackButton type="submit">
                  Submit
                </BlackButton>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
    </div>
  );
};

export default ContactUsPage;