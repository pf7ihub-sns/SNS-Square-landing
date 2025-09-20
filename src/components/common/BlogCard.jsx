import React from "react";

const BlogCard = ({ 
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
      className={`group w-full max-w-full bg-white rounded-[4px] border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300  flex flex-col ${className}`}
      onClick={onClick}
    >
      {/* Upper section: show image if provided, otherwise fallback to decorative design */}
      {image ? (
        <div className="relative w-full bg-[#e6edfc] overflow-hidden aspect-[4/3] sm:aspect-[16/9] p-2 sm:p-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-contain sm:object-cover object-center transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 320px) 280px, (max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 2560px) 25vw, 20vw"
          />
        </div>
      ) : (
        <div className="relative w-full bg-[#e6edfc] overflow-hidden aspect-[4/3] sm:aspect-[16/9]">
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
      )}
      
      {/* Badge overlay */}
      {badge && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {badge}
          </span>
        </div>
      )}
      
      {/* Lower section with white background and text */}
      <div className="p-4 sm:p-5 md:p-6 bg-white flex flex-col flex-1">
        <h4 className="text-gray-900 mb-2 sm:mb-3 leading-tight text-base sm:text-lg md:text-xl">
          {title}
        </h4>
        <p className="text-gray-600 leading-relaxed text-sm md:text-base mt-2 sm:mt-3 line-clamp-3 md:line-clamp-none">
          {description}
        </p>
        
        {/* Blog metadata */}
        {(date || readTime) && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            {date && (
              <span className="text-xs text-gray-500">{date}</span>
            )}
            {readTime && (
              <span className="text-xs text-gray-500">{readTime}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCard;
