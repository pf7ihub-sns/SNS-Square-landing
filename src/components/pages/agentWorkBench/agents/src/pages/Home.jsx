"use client"
import { Cross, Stethoscope } from "lucide-react"
import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate();
 
  const handleNavigation = (path) => {
    navigate(path);
  }
  
  return (
    <div className="min-h-screen bg-white flex flex-col pt-25 font-manrope">
      {/* Back Navigation */}
      <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <button 
          onClick={() => window.location.href = 'http://localhost:5173/media-entertainment'}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-900 px-3 py-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium text-sm">Docsentra</span>
        </button>
      </div>
      
      {/* Header Section */}
      <header className="pt-10 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-3">
              Docsentra
            </h1>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
              An AI-powered healthcare assistant designed for doctors and nurses. Intelligent support at every step of patient care.
            </p>
          </div>
        </div>
      </header>

      {/* Role Selection Section */}
      <main className="flex-1 flex items-start justify-center px-4 sm:px-6 lg:px-8 pb-12 pt-8">
        <div className="w-full max-w-4xl">
          {/* Main Container Box */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-md p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Choose your role</h2>
            <p className="text-sm text-slate-500 mb-6">Select your role to access your personalized Dashboard</p>
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Doctor Card */}
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300 flex flex-col">
                <div className="flex items-start gap-3 mb-5 flex-grow">
                  <div className="w-11 h-11 flex items-center justify-center bg-blue-600 text-white rounded-full flex-shrink-0">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Doctor</h3>
                    <p className="text-sm text-slate-500">Access your medical dashboard and manage patient care</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNavigation("login/doctor")}
                  aria-label="Login as Doctor"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 text-sm rounded-md transition-colors duration-200"
                >
                  Login as Doctor
                </button>
              </div>

              {/* Nurse Card */}
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300 flex flex-col">
                <div className="flex items-start gap-3 mb-5 flex-grow">
                  <div className="w-11 h-11 flex items-center justify-center bg-blue-600 text-white rounded-full flex-shrink-0">
                    <Cross className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Nurse</h3>
                    <p className="text-sm text-slate-500">Manage patient care and coordinate treatments</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNavigation("login/nurse")}
                  aria-label="Login as Nurse"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 text-sm rounded-md transition-colors duration-200"
                >
                  Login as Nurse
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
