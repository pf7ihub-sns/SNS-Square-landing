import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Import Lucide icons

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center items-center space-x-2 py-6">
      {/* Previous Button with ChevronLeft Icon */}
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => handlePageClick(index + 1)}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${currentPage === index + 1
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
              : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
        >
          {index + 1}
        </button>
      ))}

      {/* Next Button with ChevronRight Icon */}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;