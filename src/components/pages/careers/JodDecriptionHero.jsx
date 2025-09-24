import React from 'react'

const JobDescriptionHero = () => {
  return (
    <div className="w-full pt-34 pb-8">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-8 lg:px-24">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-sm text-zinc-600 mb-8 text-left">
          <span className="hover:text-gray-900 cursor-pointer font-medium">
            Job Listing
          </span>
          <span className="mx-2 text-neutral-400">›</span>
          <span className="text-zinc-600 font-medium">
            UI/UX Designer
          </span>
        </nav>

        {/* Main Content Container */}
        <div className="flex justify-between items-start">
          {/* Left Side - Job Info */}
          <div className="flex-1 text-left">
            <h1 className="text-5xl font-extrabold text-neutral-950 mb-3 leading-tight font-['Manrope'] text-left">
              UI/UX Designer
            </h1>
            <p className="text-xl text-black font-medium font-['Manrope'] text-left">
              Coimbatore,Tamilnadu,India
            </p>
          </div>

          {/* Right Side - Share Section */}            
          <div className="flex flex-col items-end">
            <span className="text-black font-medium mb-3 text-base font-['Manrope']">Share</span>
            <div className="flex space-x-1.5">
              {/* LinkedIn Icon */}
              <div className="w-10 h-10 bg-violet-200 rounded-full cursor-pointer hover:bg-violet-300 transition-colors flex items-center justify-center">
                <svg className="w-4 h-4" fill="#1f2937" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>

              {/* Link Icon */}
              <div className="w-10 h-10 bg-violet-200 rounded-full cursor-pointer hover:bg-violet-300 transition-colors flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="#1f2937" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>

              {/* Copy Link Icon */}
              <div className="w-10 h-10 bg-violet-200 rounded-full cursor-pointer hover:bg-violet-300 transition-colors flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="#1f2937" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDescriptionHero
