import React from 'react'
import { useNavigate } from 'react-router-dom'

const JobDescriptionHero = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full pt-34 pb-8">
      <div className="w-full max-w-[1440px] pl-2 sm:pl-4 lg:pl-8 justify-center mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-sm text-zinc-600 mb-8">
          <span 
            className="hover:text-gray-900 cursor-pointer font-medium transition-colors duration-200"
            onClick={() => navigate('/careers')}
          >
            Job Listing
          </span>
          <span className="mx-2 text-neutral-400">›</span>
          <span className="text-zinc-600 font-medium">
            UI/UX Designer
          </span>
        </nav>

        {/* Main Content Container */}
        <div className="flex justify-between items-start pr-4 sm:pr-8 lg:pr-24">
          {/* Left Side - Job Info */}
          <div className="flex-1">
            <h1 className="text-5xl font-extrabold text-neutral-950 mb-3 leading-tight font-['Manrope']">
              UI/UX Designer
            </h1>
            <p className="text-xl text-black font-medium font-['Manrope']">
              Coimbatore,Tamilnadu,India
            </p>
          </div>

          {/* Right Side - Share Section */}            
          <div className="flex flex-col items-start">
            <span className="text-black font-medium mb-3 text-base font-['Manrope'] text-left">Share</span>
            <div className="flex space-x-1.5">

              {/* Copy Link Icon */}
              <div className="w-10 h-10 bg-violet-200 rounded-full cursor-pointer hover:bg-violet-300 transition-colors flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="#1f2937" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>

              {/* LinkedIn Icon */}
              <div className="w-10 h-10 bg-violet-200 rounded-full cursor-pointer hover:bg-violet-300 transition-colors flex items-center justify-center">
                <svg className="w-4 h-4" fill="#1f2937" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>

              {/* WhatsApp Icon */}
              <div className="w-10 h-10 bg-violet-200 rounded-full cursor-pointer hover:bg-violet-300 transition-colors flex items-center justify-center">
                <svg className="w-4 h-4" fill="#1f2937" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
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
