import React from "react";

const UseCaseCardNew = ({ 
  title = "Demand Forecasting", 
  description = "Lorem ipsum dolor sit amet consectetur. In a posuere elit in in congue mi.",
  onClick,
  className = ""
}) => {
  return (
    <div 
      className={`w-[393px] h-[373px] bg-white rounded-[4px] border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 ${className}`}
      onClick={onClick}
    >
      {/* Upper section with light blue background and circular elements */}
      <div className="relative w-full h-[224px] bg-[#e6edfc] overflow-hidden">
        {/* Circular elements positioned in top-left quadrant */}
        <div className="absolute -left-8 -top-8 w-32 h-32 border-4 border-[#c7d2fe] rounded-full opacity-60"></div>
        <div className="absolute -left-4 -top-4 w-16 h-16 bg-[#c7d2fe] rounded-full opacity-80"></div>
        
        {/* Optional: Add an icon or image in the center-right area */}
        <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Lower section with white background and text */}
      <div className="p-6 bg-white h-[149px] flex flex-col justify-center">
        <h4 className="text-gray-900 mb-3 leading-tight">
          {title}
        </h4>
        <p className="text-gray-600 leading-relaxed text-small mt-4">
          {description}
        </p>
      </div>
    </div>
  );
};

export default UseCaseCardNew;
