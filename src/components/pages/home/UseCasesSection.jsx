import React from 'react';
import Button from '../../common/Button2';
import { useNavigate as Navigate } from 'react-router-dom';

const UseCasesSection = () => {
  const navigate = Navigate();

  return (
    <div className="pt-4 xs:pt-5 sm:pt-6 md:pt-8 lg:pt-10 xl:pt-12 pb-8 xs:pb-10 sm:pb-12 md:pb-16 lg:pb-20 xl:pb-24 px-4 xs:px-5 sm:px-6 lg:px-8">
      <div className="w-full mx-auto">
        {/* Background with decorative elements - full width */}
        <div className="relative bg-gradient-to-br from-blue-50 to-white rounded-xl lg:rounded-2xl overflow-hidden">
          {/* Decorative Background - full width */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: "url('/images/BG.jpg')" }}
          />
          
          {/* Content Container - responsive max widths */}
          <div className="responsive-container relative z-20 max-w-[350px] xs:max-w-[400px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[1024px] xl:max-w-[1200px] mx-auto pt-5 xs:pt-6 sm:pt-8 lg:pt-10 px-3 xs:px-4 sm:px-6 md:px-8">
            {/* Section Header */}
            <div className="mb-6 xs:mb-8 sm:mb-12 lg:mb-16">
              <Button
                variant="secondary"
                size="small"
                className="bg-[#ade5d3] text-[#040404] rounded-full px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 mb-5 xs:mb-6 sm:mb-8 lg:mb-10 text-xs xs:text-sm"
                onClick={() => {}}
              >
                UseCases
              </Button>
              <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-manrope font-bold text-[#242424] leading-tight max-w-7xl">
                From tech startups to global enterprises, our Agentic solutions adapt to any industry, helping leaders reimagine growth, efficiency, and customer experience.
              </h2>
            </div>
            
            {/* Use Cases Grid */}
            <div className="responsive-grid grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 lg:gap-8 mb-6 xs:mb-8 sm:mb-12 lg:mb-16">
              {/* IT Development Lifecycle Card */}
              <div 
                className="responsive-card bg-white rounded-xl lg:rounded-2xl shadow-lg p-3 xs:p-4 sm:p-5 md:p-6 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 relative group cursor-pointer transform hover:-translate-y-3 hover:scale-[1.02] hover:ring-2 hover:ring-blue-200 hover:ring-opacity-50"
                onClick={() => navigate("/usecase?category=information-technology")}
              >
                <div className="bg-[#e6edfc] rounded-lg lg:rounded-xl p-2 xs:p-3 sm:p-4 w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center mb-2 xs:mb-3 sm:mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                  <img src="/images/img_background_blue_800.svg" alt="IT Development" className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-sora font-semibold text-[#242424] mb-2 xs:mb-3 sm:mb-3 group-hover:text-[#064EE3] transition-colors duration-300">
                  IT Development Lifecycle
                </h3>
                <p className="text-xs xs:text-sm sm:text-[16px] font-inter text-black/80 mb-3 xs:mb-4 sm:mb-4">
                  Seamless, smart, and scalable Agentic AI powers the future of IT.
                </p>
                {/* Desktop hover Learn More */}
                <div 
                  className="hidden lg:flex items-center text-[#3e57da] hover:text-[#064ee3] cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 group-hover:translate-x-2"
                  onClick={() => navigate("/usecase?category=information-technology")}
                >
                  <span className="text-xs xs:text-sm sm:text-sm font-inter">Learn More</span>
                  <img src="/images/img_solar_arrow_up_linear.svg" alt="Arrow" className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 ml-2 group-hover:transform group-hover:rotate-0 transition-transform duration-300" />
                </div>
                {/* Mobile/Tablet static Learn More */}
                <div 
                  className="flex lg:hidden items-center text-[#3e57da] hover:text-[#064ee3] cursor-pointer transition-all duration-300"
                  onClick={() => navigate("/usecase?category=information-technology")}
                >
                  <span className="text-xs xs:text-sm sm:text-sm font-inter">Learn More</span>
                  <img src="/images/img_solar_arrow_up_linear.svg" alt="Arrow" className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 ml-2" />
                </div>
              </div>
              
              {/* Supply Chain Card */}
              <div 
                className="responsive-card bg-white rounded-xl lg:rounded-2xl shadow-lg p-3 xs:p-4 sm:p-5 md:p-6 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 relative group cursor-pointer transform hover:-translate-y-3 hover:scale-[1.02] hover:ring-2 hover:ring-blue-200 hover:ring-opacity-50"
                onClick={() => navigate("/usecase?category=supply-chain")}
              >
                <div className="bg-[#e6edfc] rounded-lg lg:rounded-xl p-2 xs:p-3 sm:p-4 w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center mb-2 xs:mb-3 sm:mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                  <img src="/images/img_frame.svg" alt="Supply Chain" className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-sora font-semibold text-[#242424] mb-2 xs:mb-3 sm:mb-3 group-hover:text-[#064EE3] transition-colors duration-300">
                  Supply Chain
                </h3>
                <p className="text-xs xs:text-sm sm:text-[16px] font-inter text-black/80 mb-3 xs:mb-4 sm:mb-4">
                  From demand to delivery, every link learns, decides, and acts in real time
                </p>
                {/* Desktop hover Learn More */}
                <div 
                  className="hidden lg:flex items-center text-[#3e57da] hover:text-[#064ee3] cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 group-hover:translate-x-2"
                  onClick={() => navigate("/usecase?category=supply-chain")}
                >
                  <span className="text-xs xs:text-sm sm:text-sm font-inter">Learn More</span>
                  <img src="/images/img_solar_arrow_up_linear.svg" alt="Arrow" className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 ml-2 group-hover:transform group-hover:rotate-0 transition-transform duration-300" />
                </div>
                {/* Mobile/Tablet static Learn More */}
                <div 
                  className="flex lg:hidden items-center text-[#3e57da] hover:text-[#064ee3] cursor-pointer transition-all duration-300"
                  onClick={() => navigate("/usecase?category=supply-chain")}
                >
                  <span className="text-xs xs:text-sm sm:text-sm font-inter">Learn More</span>
                  <img src="/images/img_solar_arrow_up_linear.svg" alt="Arrow" className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 ml-2" />
                </div>
              </div>
              
              {/* Healthcare Card */}
              <div 
                className="responsive-card bg-white rounded-xl lg:rounded-2xl shadow-lg p-3 xs:p-4 sm:p-5 md:p-6 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 relative group cursor-pointer transform hover:-translate-y-3 hover:scale-[1.02] hover:ring-2 hover:ring-blue-200 hover:ring-opacity-50"
                onClick={() => navigate("/usecase?category=healthcare")}
              >
                <div className="bg-[#e6edfc] rounded-lg lg:rounded-xl p-2 xs:p-3 sm:p-4 w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center mb-2 xs:mb-3 sm:mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                  <img src="/images/img_frame_blue_800.svg" alt="Healthcare" className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-sora font-semibold text-[#242424] mb-2 xs:mb-3 sm:mb-3 group-hover:text-[#064EE3] transition-colors duration-300">
                  Healthcare
                </h3>
                <p className="text-xs xs:text-sm sm:text-[16px] font-inter text-black/80 mb-3 xs:mb-4 sm:mb-4">
                  Partnering with hospitals to provide intelligent, personalized, and always-available healthcare solutions.
                </p>
                {/* Desktop hover Learn More */}
                <div 
                  className="hidden lg:flex items-center text-[#3e57da] hover:text-[#064ee3] cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 group-hover:translate-x-2"
                  onClick={() => navigate("/usecase?category=healthcare")}
                >
                  <span className="text-xs xs:text-sm sm:text-sm font-inter">Learn More</span>
                  <img src="/images/img_solar_arrow_up_linear.svg" alt="Arrow" className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 ml-2 group-hover:transform group-hover:rotate-0 transition-transform duration-300" />
                </div>
                {/* Mobile/Tablet static Learn More */}
                <div 
                  className="flex lg:hidden items-center text-[#3e57da] hover:text-[#064ee3] cursor-pointer transition-all duration-300"
                  onClick={() => navigate("/usecase?category=healthcare")}
                >
                  <span className="text-xs xs:text-sm sm:text-sm font-inter">Learn More</span>
                  <img src="/images/img_solar_arrow_up_linear.svg" alt="Arrow" className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 ml-2" />
                </div>
              </div>
              
              {/* Insurance Card */}
              <div 
                className="responsive-card bg-white rounded-xl lg:rounded-2xl shadow-lg p-3 xs:p-4 sm:p-5 md:p-6 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 relative group cursor-pointer transform hover:-translate-y-3 hover:scale-[1.02] hover:ring-2 hover:ring-blue-200 hover:ring-opacity-50"
                onClick={() => navigate("/usecase?category=insurance")}
              >
                <div className="bg-[#e6edfc] rounded-lg lg:rounded-xl p-2 xs:p-3 sm:p-4 w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center mb-2 xs:mb-3 sm:mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                  <img src="/images/img_frame_blue_800_60x60.svg" alt="Insurance" className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-sora font-semibold text-[#242424] mb-2 xs:mb-3 sm:mb-3 group-hover:text-[#064EE3] transition-colors duration-300">
                  Insurance
                </h3>
                <p className="text-xs xs:text-sm sm:text-[16px] font-inter text-black/80 mb-3 xs:mb-4 sm:mb-4">
                  40% faster bookings, predictive demand management, and personalised guest experiences.
                </p>
                {/* Desktop hover Learn More */}
                <div 
                  className="hidden lg:flex items-center text-[#3e57da] hover:text-[#064ee3] cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 group-hover:translate-x-2"
                  onClick={() => navigate("/usecase?category=insurance")}
                >
                  <span className="text-xs xs:text-sm sm:text-sm font-inter">Learn More</span>
                  <img src="/images/img_solar_arrow_up_linear.svg" alt="Arrow" className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 ml-2 group-hover:transform group-hover:rotate-0 transition-transform duration-300" />
                </div>
                {/* Mobile/Tablet static Learn More */}
                <div 
                  className="flex lg:hidden items-center text-[#3e57da] hover:text-[#064ee3] cursor-pointer transition-all duration-300"
                  onClick={() => navigate("/usecase?category=insurance")}
                >
                  <span className="text-xs xs:text-sm sm:text-sm font-inter">Learn More</span>
                  <img src="/images/img_solar_arrow_up_linear.svg" alt="Arrow" className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 ml-2" />
                </div>
              </div>
              
              {/* Human Resource Card */}
              <div 
                className="responsive-card bg-white rounded-xl lg:rounded-2xl shadow-lg p-3 xs:p-4 sm:p-5 md:p-6 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 relative group cursor-pointer transform hover:-translate-y-3 hover:scale-[1.02] hover:ring-2 hover:ring-blue-200 hover:ring-opacity-50"
                onClick={() => navigate("/usecase?category=human-resource")}
              >
                <div className="bg-[#e6edfc] rounded-lg lg:rounded-xl p-2 xs:p-3 sm:p-4 w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center mb-2 xs:mb-3 sm:mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                  <img src="/images/img_frame_60x60.svg" alt="Human Resource" className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-sora font-semibold text-[#242424] mb-2 xs:mb-3 sm:mb-3 group-hover:text-[#064EE3] transition-colors duration-300">
                  Human Resource
                </h3>
                <p className="text-xs xs:text-sm sm:text-[16px] font-inter text-black/80 mb-3 xs:mb-4 sm:mb-4">
                  3× higher conversions using recommendation engines and customer intelligence.
                </p>
                {/* Desktop hover Learn More */}
                <div 
                  className="hidden lg:flex items-center text-[#3e57da] hover:text-[#064ee3] cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 group-hover:translate-x-2"
                  onClick={() => navigate("/usecase?category=human-resource")}
                >
                  <span className="text-xs xs:text-sm sm:text-sm font-inter">Learn More</span>
                  <img src="/images/img_solar_arrow_up_linear.svg" alt="Arrow" className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 ml-2 group-hover:transform group-hover:rotate-0 transition-transform duration-300" />
                </div>
                {/* Mobile/Tablet static Learn More */}
                <div 
                  className="flex lg:hidden items-center text-[#3e57da] hover:text-[#064ee3] cursor-pointer transition-all duration-300"
                  onClick={() => navigate("/usecase?category=human-resource")}
                >
                  <span className="text-xs xs:text-sm sm:text-sm font-inter">Learn More</span>
                  <img src="/images/img_solar_arrow_up_linear.svg" alt="Arrow" className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 ml-2" />
                </div>
              </div>
              
              {/* Call to Action Card */}
              <div className='flex flex-col justify-evenly max-w-full sm:max-w-[340px] gap-4 xs:gap-5 sm:gap-6'>
                <h3 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-inter font-semibold leading-tight font-[600]">
                  Unlock Agentic AI Solutions for Your Industry.
                </h3>
                <Button
                  variant="primary"
                  size="medium"
                  className="rounded-full px-2 xs:px-4 sm:px-6 py-3 xs:py-3.5 text-xs xs:text-sm sm:text-base font-inter font-semibold text-white w-full sm:max-w-[250px] h-[50px] xs:h-[44px] sm:h-[48px] lg:h-[50px] leading-tight"
                  onClick={() => {navigate("/usecase")}}
                >
                  <span className="block xs:hidden text-center">
                    Explore Use Cases
                  </span>
                  <span className="hidden xs:block text-center">
                    Explore Agentic Use Case
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseCasesSection;
