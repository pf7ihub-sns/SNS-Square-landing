import React from 'react'
import JodDecriptionHero from './JodDecriptionHero'

const JobDescriptionPage = () => {
  return (
    <div className="w-full bg-white">
      <JodDecriptionHero />

      <div className="w-full max-w-[1440px] mx-auto pt-6 sm:pt-8 px-4 sm:px-4 lg:px-8">
        <div className="w-full h-px bg-black opacity-10 mb-8 sm:mb-12"/>
      </div>
      
      {/* Job Details Content */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-4 lg:px-8 py-4 sm:py-6 pb-20 sm:pb-40">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 relative">
          {/* Job Description Section - Left Column (8/12 width) */}
          <div className="lg:col-span-8 lg:pr-8">
            <h2 className="text-black mb-4 sm:mb-6 text-xl sm:text-2xl lg:text-3xl font-semibold">
              Job Description
            </h2>
            
            {/* Line spacing below title */}
            <div className="mb-4 sm:mb-6"></div>
            
            <ul className="space-y-2 sm:space-y-3 text-black text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
              <li className="flex items-start leading-relaxed">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-900 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                Experience in manual and automation testing.
              </li>
              <li className="flex items-start leading-relaxed">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-900 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                Knowledge of Java Programming (data types, variables, operators, flow control statements, methods (built-in as well as user-defined), Exception handling, File Handling, Database Operations, and OOPS concepts.
              </li>
              <li className="flex items-start leading-relaxed">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-900 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                Experience in MySQL/PgSQL.
              </li>
              <li className="flex items-start leading-relaxed">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-900 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                Experience in Selenium and Jmeter.
              </li>
              <li className="flex items-start leading-relaxed">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-900 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                Should be able to perform rigorous testing by creating large data sets, conduct back-end testing, and validate information as it flows through the system.
              </li>
              <li className="flex items-start leading-relaxed">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-900 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                Assist developers, support reps, and product managers in debugging issues.
              </li>
              <li className="flex items-start leading-relaxed">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-900 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                Re-test and verify the bugs/issues that have been fixed.
              </li>
            </ul>
            
            <p className="mt-4 sm:mt-6 text-black leading-relaxed text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
              Please note that we have requirements for this role in Chennai, Salem, Coimbatore, Tirunelveli, and Madurai.
            </p>

            {/* Apply Button */}
            <button className="mt-6 sm:mt-8 bg-gray-900 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded text-sm font-medium hover:bg-gray-800 transition-colors duration-200 w-full sm:w-auto" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <a href="/careers/JobApplicationPage" className="text-white no-underline">Apply</a>
            </button>
          </div>

          {/* Vertical Divider Line */}
          <div className="hidden lg:block absolute left-[66.666%] top-0 bottom-0 w-px bg-gray-200 opacity-50"></div>

          {/* Job Information Section - Right Column (4/12 width) */}
          <div className="lg:col-span-4 lg:pl-8 mt-8 lg:mt-0">
            <h2 className="text-black mb-4 sm:mb-6 text-xl sm:text-2xl lg:text-3xl font-semibold">
              Job Information
            </h2>

            {/* Line spacing below title */}
            <div className="mb-4 sm:mb-6"></div>

            <div className="space-y-3 sm:space-y-4">
              {/* Experience */}
              <div>
                <h6 className="text-black mb-2 text-sm sm:text-base font-medium">Experience</h6>
                <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-blue-100 rounded">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-800 text-xs sm:text-sm font-medium">4-6 years</span>
                </div>
              </div>

              {/* Type */}
              <div>
                <h6 className="text-black mb-2 text-sm sm:text-base font-medium">Type</h6>
                <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-blue-100 rounded">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-800 text-xs sm:text-sm font-medium">Full-Time</span>
                </div>
              </div>

              {/* Workplace Type */}
              <div>
                <h6 className="text-black mb-2 text-sm sm:text-base font-medium">Workplace Type</h6>
                <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-blue-100 rounded">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-800 text-xs sm:text-sm font-medium">On-site</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDescriptionPage
