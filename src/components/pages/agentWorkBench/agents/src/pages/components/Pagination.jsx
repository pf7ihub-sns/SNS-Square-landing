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
        <div className="flex items-center justify-center mt-6 space-x-2">
            {/* Previous Button */}
            <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-100 text-[#005566] hover:bg-blue-200 hover:text-[#003049]"
                    } transition-all duration-200`}
                aria-label="Previous page"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium ${page === currentPage
                            ? "bg-[#005566] text-white"
                            : "bg-blue-50 text-[#005566] hover:bg-blue-100 hover:text-[#003049]"
                        } transition-all duration-200`}
                    aria-label={`Page ${page}`}
                >
                    {page}
                </button>
            ))}

            {/* Next Button */}
            <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-100 text-[#005566] hover:bg-blue-200 hover:text-[#003049]"
                    } transition-all duration-200`}
                aria-label="Next page"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}