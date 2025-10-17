import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/gcc-page.css';

const GCCPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden gcc-page bg-gcc-main">
      {/* Custom background: texture + blue gradient */}
      <div className="absolute inset-0 z-0 bg-gcc-texture" />
      <div className="absolute inset-0 z-0 bg-gcc-gradient" />

      {/* Custom Header for GCC Page */}
      <header className="relative z-20 flex items-center justify-between px-8 py-6">
        {/* SNS Square Logo - Top Left */}
        <Link to="/" className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200">
          <img
            src="/images/square_logo_black.png"
            alt="SNS Square Logo"
            className="h-12 w-auto brightness-0 invert"
          />
        </Link>

        {/* GCC Logo - Top Right */}
        <div className="flex items-center">
          <img
            src="/images/gcc logo.png"
            alt="GCC Logo"
            className="h-12 w-auto"
          />
        </div>
      </header>

      {/* Central Content Area */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] px-8 py-12">
        <div className="text-center max-w-7xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-wider gcc-text-glow">
            SNS Square
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 tracking-wide gcc-specialist-gradient">
            GCC Build and Operation Specialist
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            We are an experienced integrator of infrastructure Global Capability Centers that aggregate, Manage and execute services at scale.
          </p>
          {/* GCC background image behind buttons */}
          <div className="relative flex flex-col items-center justify-center mb-16">
            <img src="/images/gcc.png" alt="GCC" className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[420px] max-w-full opacity-90 pointer-events-none z-0" style={{zIndex:0}} />
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact-us"
                className="px-8 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors duration-200 gcc-button"
              >
                Contact Us
              </Link>
              <Link
                to="/about-us"
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-colors duration-200 gcc-button"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Partner Logos Section */}
          <div className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-center justify-items-center">
              {/* Replace with actual partner logos */}
              <img src="/images/home/company logos/google-cloud.png" alt="Google Cloud" className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
              <img src="/images/home/company logos/snowflake.png" alt="Snowflake" className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
              <img src="/images/home/company logos/matillion.png" alt="Matillion" className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
              <img src="/images/home/company logos/databricks.png" alt="Databricks" className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
              <img src="/images/home/company logos/dbt.png" alt="dbt" className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
              <img src="/images/home/company logos/nvidia.png" alt="NVIDIA" className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
              <img src="/images/home/company logos/service-now.png" alt="ServiceNow" className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <div className="bg-blue-900/40 backdrop-blur-sm rounded-2xl p-8 border border-blue-700/50">
              <div className="flex items-center justify-center gap-4 mb-2">
                <svg className="w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
                <h3 className="text-5xl font-bold text-white">150+</h3>
              </div>
              <p className="text-xl text-white/90">Integrations</p>
            </div>
            
            <div className="bg-blue-900/40 backdrop-blur-sm rounded-2xl p-8 border border-blue-700/50">
              <div className="flex items-center justify-center gap-4 mb-2">
                <svg className="w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/>
                </svg>
                <h3 className="text-5xl font-bold text-white">1500+</h3>
              </div>
              <p className="text-xl text-white/90">Solutions Built</p>
            </div>
          </div>

          {/* Additional Heading */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Let's Build Your Future-Ready GCC
            </h3>
            <p className="text-lg text-white/90 mb-8">
              Partner with us to create world-class Global Capability Centers.
            </p>
          </div>
        </div>
      </div>

      {/* Custom Footer for GCC Page */}
{/* Custom Footer for GCC Page */}
      {/* Custom Footer for GCC Page */}
      <footer className="relative z-20 bg-[#020526] pt-16 pb-12 mt-auto">
        <div className="max-w-[1216px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12">
            {/* Company Info - Column 1 */}
            <div className="col-span-1 flex flex-col gap-4">
              <img
                src="/images/square_logo.png"
                alt="SNS Square Logo"
                className="w-[140px] h-auto"
              />
            </div>

            {/* Solutions - Column 2 */}
            <div>
              <h3 className="text-[#8098F9] font-medium text-[15.63px] leading-6 tracking-[-0.06px] mb-4">Solutions</h3>
              <ul className="space-y-2 text-white/70 text-[13px]">
                <li className="hover:text-white transition-colors cursor-pointer">Smart City & Manufacturing</li>
                <li className="hover:text-white transition-colors cursor-pointer">Healthcare</li>
                <li className="hover:text-white transition-colors cursor-pointer">Agriculture & Food</li>
                <li className="hover:text-white transition-colors cursor-pointer">Retail/FMCG</li>
                <li className="hover:text-white transition-colors cursor-pointer">Automotive & Aerospace</li>
                <li className="hover:text-white transition-colors cursor-pointer">Defence, Government, Legal</li>
                <li className="hover:text-white transition-colors cursor-pointer">Real Estate</li>
                <li className="hover:text-white transition-colors cursor-pointer">Sports, Media & Entertainment</li>
                <li className="hover:text-white transition-colors cursor-pointer">BFSI - Fintech/Banking</li>
                <li className="hover:text-white transition-colors cursor-pointer">Power, Oil, Energy</li>
                <li className="hover:text-white transition-colors cursor-pointer">Personal Services</li>
              </ul>
            </div>

            {/* Use Cases - Column 3 */}
            <div>
              <h3 className="text-[#8098F9] font-medium text-[15.63px] leading-6 tracking-[-0.06px] mb-4">Use Cases</h3>
              <ul className="space-y-2 text-white/70 text-[13px]">
                <li className="hover:text-white transition-colors cursor-pointer">Supply Chain</li>
                <li className="hover:text-white transition-colors cursor-pointer">Human Resource</li>
                <li className="hover:text-white transition-colors cursor-pointer">IT Solution</li>
                <li className="hover:text-white transition-colors cursor-pointer">Insurance</li>
                <li className="hover:text-white transition-colors cursor-pointer">Health Care</li>
              </ul>
            </div>

            {/* Company with nested Address - Column 4 */}
            <div>
              <h3 className="text-[#8098F9] font-medium text-[15.63px] leading-6 tracking-[-0.06px] mb-4">Company</h3>
              <ul className="space-y-2 text-white/70 text-[13px] mb-6">
                <li className="hover:text-white transition-colors cursor-pointer">Solutions</li>
                <li className="hover:text-white transition-colors cursor-pointer">Use Case</li>
                <li className="hover:text-white transition-colors cursor-pointer">Life at SNS Square</li>
                <li className="hover:text-white transition-colors cursor-pointer">Resources</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact us</li>
              </ul>
              
              {/* Address nested in Company column */}
              <div className="mt-6">
                <h3 className="text-[#8098F9] font-medium text-[15.63px] leading-6 tracking-[-0.06px] mb-4">Address</h3>
                <p className="text-white/70 text-[13px] leading-relaxed mb-3">
                  BLOCK-N, Embassy Tech Village, Outer Ring Rd, Devarabisanahalli, Bellandur, Bengaluru, Karnataka 560103
                </p>
                <p className="text-[#8098F9] font-medium text-[13px] mb-1">Email</p>
                <p className="text-white/70 text-[13px] hover:text-white transition-colors cursor-pointer">
                  info@snssquare.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Copyright Bar - Outside Footer */}
      <div className="relative z-20 w-full bg-white border-t border-gray-200">
        <div className="max-w-[1216px] mx-auto px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <span className="text-[12px] text-[#020526]">© {new Date().getFullYear()} SNS Square. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="https://www.linkedin.com/company/snssquare" target="_blank" rel="noopener noreferrer" className="text-[#020526] hover:text-[#0077b5] transition-colors" aria-label="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="https://www.youtube.com/@snssquare" target="_blank" rel="noopener noreferrer" className="text-[#020526] hover:text-[#FF0000] transition-colors" aria-label="YouTube">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GCCPage;
