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
            <div className="max-w-xl w-full p-6">
                {/* Card Header with Back Button */}
                <div className="relative mb-6">
                    <h1 className="text-2xl font-semibold text-white text-center p-4 rounded-lg" style={{ 
                        backgroundColor: '#10B981', // Emerald/Green color for healthcare/lab theme
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' 
                    }}>
                        Lab Results Extractor
                    </h1>
                    <button
                        onClick={() => window.location.href = '/media-entertainment'} // Adjust to your desired back route
                        className="absolute top-4 right-4 flex items-center gap-2 text-white font-medium hover:text-emerald-200 transition-colors p-2 hover:bg-white-50 hover:bg-opacity-10 rounded-md"
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
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        {/* Alternative: Use image if you have one */}
                        {/* <img
                            src={imgLab}
                            alt="Lab Results Extractor"
                            className="w-full h-45 object-cover rounded-md"
                        /> */}
                    </div>

                    <h3 className="text-xl font-medium text-gray-800 mb-2">Lab Results Extractor</h3>
                    <p className="text-gray-600 text-sm mb-4">Manage sample collection, processing, analysis, quality control, and reporting with automated extraction.</p>
                    
                    {/* Key Features */}
                    <div className="w-full mb-6">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-3 text-left">
                                <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-700">Sample processing</span>
                            </div>
                            <div className="flex items-center space-x-3 text-left">
                                <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-700">Quality control</span>
                            </div>
                            <div className="flex items-center space-x-3 text-left">
                                <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-700">Result validation</span>
                            </div>
                            <div className="flex items-center space-x-3 text-left">
                                <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-700">Automated reporting</span>
                            </div>
                        </div>
                    </div>

                    {/* Performance Stats */}
                    <div className="w-full grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-600">99.8%</div>
                            <div className="text-xs text-gray-500">Accuracy</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-600">87%</div>
                            <div className="text-xs text-gray-500">Faster</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-600">HIPAA</div>
                            <div className="text-xs text-gray-500">Compliant</div>
                        </div>
                    </div>

                    {/* Workflow Preview */}
                    <div className="w-full mb-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-3 text-center">Workflow Automation</h4>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 text-xs">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                    <span className="text-gray-600">Sample Collection</span>
                                    <span className="ml-auto text-emerald-600 font-medium">✓ Automated</span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                    <span className="text-gray-600">Analysis Execution</span>
                                    <span className="ml-auto text-emerald-600 font-medium">✓ AI-Powered</span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                    <span className="text-gray-600">Report Generation</span>
                                    <span className="ml-auto text-emerald-600 font-medium">✓ Instant</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="w-full border-t border-gray-200 pt-4">
                        <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
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
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded">Lab diagnostics</span>
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded">Quality assurance</span>
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded">Clinical testing workflow</span>
                        </div>
                    </div>

                    {/* Compliance & Integration Badges */}
                    <div className="mt-4 w-full flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 font-medium">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            HIPAA Compliant
                        </div>
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-50 text-purple-700 font-medium">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            EHR Integration
                        </div>
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-50 text-indigo-700 font-medium">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a8 8 0 100 0A8 8 0 008 11zM16 8a8 8 0 11-16 0 8 8 0 0116 0z" />
                            </svg>
                            Lab Systems
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabResultsExtractorCard;