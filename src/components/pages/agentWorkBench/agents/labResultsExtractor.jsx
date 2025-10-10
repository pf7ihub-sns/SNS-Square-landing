import React from 'react';
import { ArrowLeft } from 'lucide-react';

const LabResultsExtractorCard = () => {
    const handleClick = () => {
        // Check for userId before redirecting
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.log('No userId found, redirecting to login');
            alert('Please log in to access this feature.');
            // Optionally redirect to login page
            // window.location.href = '/login'; // Adjust based on your app's login route
            return;
        }

        try {
            window.location.href = 'http://industry-specific-workflow.s3-website-ap-southeast-2.amazonaws.com/healthcare/agent-2/run';
        } catch (error) {
            console.error('Failed to redirect:', error);
            alert('Unable to redirect. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="max-w-xl w-full p-6 mt-15">
                {/* Card Header with Back Button */}
                <div className="relative mb-6">
                    <h1 className="text-2xl font-semibold text-white text-center p-4 rounded-lg" style={{
                        backgroundColor: 'blue', // blue/Green color for healthcare/lab theme
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                        Lab Results Extractor
                    </h1>
                    <button
                        onClick={() => window.location.href = '/media-entertainment'} // Adjust to your desired back route
                        className="absolute top-4 right-4 flex items-center gap-2 text-white font-medium hover:text-blue-200 transition-colors p-2 hover:bg-white-50 hover:bg-opacity-10 rounded-md"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>
                </div>

                {/* Card Content */}
                <div
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center cursor-pointer transition-transform hover:scale-105 hover:shadow-md"
                    onClick={handleClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handleClick();
                        }
                    }}
                >
                    {/* Lab Icon/Image */}
                    <div className="mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                    </div>

                    <h3 className="text-xl font-medium text-gray-800 mb-2">Lab Results Extractor</h3>
                    <p className="text-gray-600 text-sm mb-4">Manage sample collection, processing, analysis, quality control, and reporting with automated extraction.</p>


                    {/* Call to Action */}
                    <div className="w-full border-t border-gray-200 pt-4">
                        <button className="w-full bg-gradient-to-r from-blue-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                            <span>Process Lab Results</span>
                            <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>

                    {/* Use Cases */}
                    <div className="mt-4 w-full text-left text-xs text-gray-500">
                        <p className="mb-1">Use Cases:</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">Lab diagnostics</span>
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">Quality assurance</span>
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">Clinical testing workflow</span>
                        </div>
                    </div>

                    {/* Compliance & Integration Badges */}
                    <div className="mt-4 w-full flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">

                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabResultsExtractorCard;