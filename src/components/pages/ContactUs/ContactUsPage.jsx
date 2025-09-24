import React, { useState, useMemo } from 'react';
import countryList from 'react-select-country-list';
import BlackButton from '../../common/BlackButton';
import Footer from './Footer';

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

  return (
    <div
      className="bg-fill p-6"
      style={{ backgroundImage: "url('/images/Frame 97499.png')" }}
    >
      {/* Main Content */}
      <main className="max-w-7xl mx-auto pb-4 mt-24 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Content */}
          <div className="space-y-6">
            <h3 className="text-black leading-tight">
              Connect with our experts to explore your use case in detail
            </h3>
            <p className="text-gray-600 leading-relaxed mt-4">
              Schedule a consultation to explore how our Agent Platform will drives the value and innovation you need.
            </p>
          </div>

          {/* Right Content - Contact Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 space-y-8">
              {/* First Row - Name Fields */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-gray-500 text-base font-normal">
                    First Name*
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b-2 border-gray-300 bg-transparent pb-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 text-base"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-500 text-base font-normal">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b-2 border-gray-300 bg-transparent pb-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 text-base"
                  />
                </div>
              </div>

              {/* Company Email */}
              <div className="space-y-2">
                <label className="block text-gray-500 text-base font-normal">
                  Company Email*
                </label>
                <input
                  type="email"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleInputChange}
                  className="w-full border-0 border-b-2 border-gray-300 bg-transparent pb-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 text-base"
                  required
                />
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <label className="block text-gray-500 text-base font-normal">
                  Company Name*
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full border-0 border-b-2 border-gray-300 bg-transparent pb-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 text-base"
                  required
                />
              </div>

              {/* Country and Industry Row */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-gray-500 text-base font-normal">
                    Country*
                  </label>
                  <div className="relative">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full border-0 border-b-2 border-gray-300 bg-transparent pb-2 text-gray-900 focus:outline-none focus:border-blue-500 text-base appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.value} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-500 text-base font-normal">
                    Industry*
                  </label>
                  <div className="relative">
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full border-0 border-b-2 border-gray-300 bg-transparent pb-2 text-gray-900 focus:outline-none focus:border-blue-500 text-base appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select Industry</option>
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="education">Education</option>
                      <option value="retail">Retail</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="consulting">Consulting</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Field */}
              <div className="space-y-2 pt-4">
                <label className="block text-gray-500 text-base font-normal">
                  Leave us a message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border-0 border-b-2 border-gray-300 bg-transparent pb-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 text-base resize-none"
                  placeholder=""
                />
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="consent" className="text-sm text-gray-700 leading-relaxed">
                  By submitting, I consent to receive relevant email communication from SNS Square in accordance with the Privacy Policy and understand I can opt out at any time.*
                </label>
              </div>

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
  );
};

export default ContactUsPage;