import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const handlePrevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5; // Show up to 5 page numbers
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust startPage if endPage reaches totalPages
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center mt-8 space-x-2 flex-wrap gap-y-2">
            {/* Previous Button */}
            <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow"
                }`}
                aria-label="Previous page"
            >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 min-w-[44px] ${
                        page === currentPage
                            ? "bg-blue-600 text-white shadow-md transform scale-110"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300 shadow-sm hover:shadow"
                    }`}
                    aria-label={`Page ${page}`}
                >
                    {page}
                </button>
            ))}

            {/* Next Button */}
            <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow"
                }`}
                aria-label="Next page"
            >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}