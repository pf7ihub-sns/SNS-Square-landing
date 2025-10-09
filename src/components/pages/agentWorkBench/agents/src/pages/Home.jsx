"use client"
import { Cross, Stethoscope } from "lucide-react"
import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate();
 
  const handleNavigation = (path) => {
    navigate(path);
  }
  
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col pt-25 font-manrope">
      {/* Back Navigation */}
      <div className="px-4 sm:px-6 lg:px-8 pt-3.5">
        <button 
          onClick={() => window.location.href = 'http://localhost:5173/media-entertainment'}
          className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
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
            <h1 className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-500 mb-2">
              Docsentra
            </h1>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              An AI-powered healthcare assistant designed for doctors and nurses. Intelligent support at every step of patient care.
            </p>
          </div>
        </div>
      </header>

      {/* Role Selection Section */}
      <main className="flex-1 flex items-start justify-center px-4 sm:px-6 lg:px-8 pb-12 pt-8">
        <div className="w-full max-w-4xl">
          {/* Main Container Box */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Choose your role</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Select your role to access your personalized Dashboard</p>
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Doctor Card */}
              <div className="flex-1 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-6 hover:shadow-md transition-shadow duration-300 flex flex-col">
                <div className="flex items-start gap-3 mb-4 flex-grow">
                  <div className="w-9 h-9 flex items-center justify-center bg-blue-600 text-white rounded-full flex-shrink-0">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">Doctor</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Access your medical dashboard and manage patient care</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNavigation("login/doctor")}
                  aria-label="Login as Doctor"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 text-sm rounded-md transition-colors duration-200"
                >
                  Login as Doctor
                </button>
              </div>

              {/* Nurse Card */}
              <div className="flex-1 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-6 hover:shadow-md transition-shadow duration-300 flex flex-col">
                <div className="flex items-start gap-3 mb-4 flex-grow">
                  <div className="w-9 h-9 flex items-center justify-center bg-blue-600 text-white rounded-full flex-shrink-0">
                    <Cross className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">Nurse</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Manage patient care and coordinate treatments</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNavigation("login/nurse")}
                  aria-label="Login as Nurse"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 text-sm rounded-md transition-colors duration-200"
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