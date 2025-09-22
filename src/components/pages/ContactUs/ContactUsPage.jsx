import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BlackButton from '../../common/BlackButton';
import Button from '../../common/Button';
import Footer from './Footer';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <div
      className=" bg-fill "
      style={{ backgroundImage: "url('/images/Frame 97499.png')" }}
    >
      {/* Header */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 ">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-black leading-tight">
              Connect with our experts to explore your use case in detail
            </h1>
            <p className="text-gray-600 leading-relaxed mt-4">
              Schedule a consultation to explore how our Agent Platform will drives the value and innovation you need.
            </p>
          </div>

          {/* Right Content - Contact Form */}
          <div className="bg-white rounded-lg shadow-lg  ">
            <div className='flex flex-col w-full item-center bg-[#E4ECFF] p-6 rounded-t-lg'>
              <h4 className=" flex text-black mb-6 item-center ">Tell Us About Your Project!</h4>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4 px-8 pb-8">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                  required
                />
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Your Phone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                  required
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Type Your Message.."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <BlackButton
                type="submit"
                className="w-full bg-gray-800 text-white py-4 rounded-md hover:bg-gray-700 transition-colors font-medium text-lg"
              >
                CONTACT US
              </BlackButton>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContactUsPage;
