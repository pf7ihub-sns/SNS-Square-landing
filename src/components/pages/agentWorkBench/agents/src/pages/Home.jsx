
"use client"
import { Cross, Stethoscope } from "lucide-react"
import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate();
  
  const handleNavigation = (path) => {
    navigate(path);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header Section */}
      <header className="pt-12 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-balance text-4xl md:text-5xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Healthcare Portal
            </h1>
            <p className="text-pretty text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Welcome to our comprehensive healthcare management system
            </p>
          </div>
        </div>
      </header>

      {/* Role Selection Section */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-12">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white mb-4">Choose Your Role</h2>
            <p className="text-slate-600 dark:text-slate-400">Select your role to access your personalized dashboard</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
            {/* Doctor Card */}
            <button
              type="button"
              onClick={() => handleNavigation("login/doctor")}
              aria-label="Login as Doctor"
              className="group w-full text-left rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition-all duration-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-900"
            >
              <div className="p-8 lg:p-10">
                <div className="flex flex-col items-center text-center gap-4">
                  {/* Doctor Icon */}
                  <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-sm bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-slate-600 transition-transform duration-300 group-hover:scale-105">
                    <Stethoscope className="w-10 h-10" aria-hidden="true" />
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mt-2">Doctor</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-base lg:text-lg leading-relaxed">
                    Access your medical dashboard and manage patient care
                  </p>

                  <div className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-md bg-[#003049] hover:bg-blue-700 text-white px-6 font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-800">
                    Login as Doctor
                  </div>
                </div>
              </div>
            </button>

            {/* Nurse Card */}
            <button
              type="button"
              onClick={() => handleNavigation("login/nurse")}
              aria-label="Login as Nurse"
              className="group w-full text-left rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition-all duration-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-900"
            >
              <div className="p-8 lg:p-10">
                <div className="flex flex-col items-center text-center gap-4">
                  {/* Nurse Icon */}
                  <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-sm bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-slate-600 transition-transform duration-300 group-hover:scale-105">
                    <Cross className="w-10 h-10" aria-hidden="true" />
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mt-2">Nurse</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-base lg:text-lg leading-relaxed">
                    Manage patient care and coordinate treatments
                  </p>

                  <div className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-md bg-[#003049] hover:bg-blue-700 text-white px-6 font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-800">
                    Login as Nurse
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
