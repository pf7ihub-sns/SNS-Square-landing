import React, { useState } from 'react'
import BlackButton from '../../common/BlackButton';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    rePassword: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add your signup logic here
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 relative">
      <div className="flex items-center justify-center min-h-screen px-4 w-full">
        <div className="w-full max-w-[600px]">
          <div className="flex items-center justify-center mb-6">
            <img
              src="/images/square_logo_black.png"
              alt="SNS Square Logo"
              className="w-[100px] sm:w-[150px]"
            />
          </div>
          <div className="bg-white rounded-xl shadow-xl p-4 sm:p-8 w-full max-w-[600px] mx-auto">
            <div className="w-full">
              <h3 className="text-xl sm:text-2xl font-semibold">Sign up</h3>
              <p className="text-gray-500 mb-6 sm:mb-8 mt-4 sm:mt-4 text-sm sm:text-base">Lorem ipsum nisi lorem turpis</p>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name*"
                        className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email ID*"
                      className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password*"
                      className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <input
                      type="password"
                      name="rePassword"
                      value={formData.rePassword}
                      onChange={handleChange}
                      placeholder="Re-enter Password*"
                      className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>
                
                <p className="text-gray-500 mt-6 mb-6">By continuing, you agree to our <a href="/terms" className="text-blue-600 hover:text-blue-800">Terms of Service</a></p>
                
                <BlackButton className="w-full bg-black">
                  Continue
                </BlackButton>
              </form>
            </div>
          </div>
          <div className="justify-center flex mt-6 gap-2 text-sm sm:text-base">
            <p className="">Already have an account?</p>
            <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">Login</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupForm