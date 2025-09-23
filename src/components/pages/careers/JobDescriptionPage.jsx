import React from 'react'
import JodDecriptionHero from './JodDecriptionHero'

const JobDescriptionPage = () => {
  return (
    <div className="w-full bg-white">
      <JodDecriptionHero />
      
      {/* Job Details Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Horizontal line separator */}
        <div className="w-full h-px bg-black opacity-10 mb-12" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Job Description Section - Left Column (2/3 width) */}
          <div className="lg:col-span-2">
            <h2 className="relative text-black mb-12 pb-12">
              Job Description
            </h2>
            
            <div className="text-black leading-loose space-y-4 mt-6">
              <p>• Experience in manual and automation testing.</p>
              <p>• Knowledge of Java Programming (data types, variables, operators, flow control statements, methods (built-in as well as user-defined), Exception handling, File Handling, Database Operations, and OOPS concepts.</p>
              <p>• Experience in MySQL/PgSQL.</p>
              <p>• Experience in Selenium and Jmeter.</p>
              <p>• Should be able to perform rigorous testing by creating large data sets, conduct back-end testing, and validate information as it flows through the system.</p>
              <p>• Assist developers, support reps, and product managers in debugging issues.</p>
              <p>• Re-test and verify the bugs/issues that have been fixed.</p>
              <p className="mt-8 pt-4">Please note that we have requirements for this role in Chennai, Salem, Coimbatore, Tirunelveli, and Madurai.</p>
            </div>

            {/* Apply Button */}
            <button className="mt-12 px-8 py-3 bg-neutral-800 hover:bg-neutral-700 rounded text-orange-50 transition-colors duration-200">
              <a href="/careers/JobApplicationPage">Apply</a>
            </button>
          </div>

          {/* Job Information Section - Right Column (1/3 width) */}
          <div className="lg:col-span-1">
            <h2 className="text-black pb-12">
              Job Information
            </h2>

            <div className="space-y-8 mt-6">
              {/* Experience */}
              <div>
                <h6 className="justify-center text-black text-base font-medium">Experience</h6>
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-violet-200 rounded">
                  <div className="w-4 h-4 border-2 border-black" />
                  <span className="text-neutral-800 text-small font-medium">4-6 years</span>
                </div>
              </div>

              {/* Type */}
              <div>
                <h6 className="justify-center text-black">Type</h6>
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-violet-200 rounded">
                  <div className="w-4 h-4 border-2 border-black" />
                  <span className="text-neutral-800 text-small font-medium">Full-Time</span>
                </div>
              </div>

              {/* Workplace Type */}
              <div>
                <h6 className="justify-center text-black text-base font-medium">Workplace Type</h6>
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-violet-200 rounded">
                  <div className="w-4 h-4 border-2 border-black" />
                  <span className="text-neutral-800 text-small font-medium">On-site</span>
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
