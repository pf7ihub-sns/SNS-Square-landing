import React from "react";

const HorizontalBlogCard = ({ 
  title = "Blog Title", 
  description = "Blog description",
  image,
  onClick,
  className = "",
  badge = null,
  date = "",
  readTime = ""
}) => {
  return (
    <div 
      className={`group w-full bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 flex h-full relative ${className}`}
      onClick={onClick}
    >
      {/* Badge overlay in top right corner */}
      {badge && (
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
            {badge}
          </span>
        </div>
      )}
      
      {/* Left side: Small image */}
      <div className="flex-shrink-0 w-55 h-55 bg-[#e6edfc] rounded-lg overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#e6edfc] to-[#c7d2fe] flex items-center justify-center">
            {/* Small decorative elements */}
            <div className="w-6 h-6 bg-[#c7d2fe] rounded-full opacity-60"></div>
          </div>
        )}
      </div>
      
      {/* Right side: Text content */}
      <div className="flex-1 p-4 bg-white flex flex-col justify-between min-w-0 py-8">
        <div className="flex-1">
          <h5 className="text-gray-900 mb-1 leading-tight text-sm font-semibold line-clamp-2 ">
            {title}
          </h5>
          <p className="text-gray-600 leading-relaxed text-xs mt-1 line-clamp-2 text-small">
            {description}
          </p>
        </div>
        
        {/* Blog metadata */}
        {date && (
          <div className="flex items-center mt-2 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500 flex items-center">
              <span className="w-1 h-1 bg-gray-500 rounded-full mr-2"></span>
              {date}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HorizontalBlogCard;
