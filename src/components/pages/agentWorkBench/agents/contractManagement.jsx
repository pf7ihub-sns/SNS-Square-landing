import React from 'react';
import { ArrowLeft } from 'lucide-react';

const ContractManagementCard = () => {
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
            window.location.href = 'http://industry-specific-workflow.s3-website-ap-southeast-2.amazonaws.com/legal/agent-1/run';
        } catch (error) {
            console.error('Failed to redirect:', error);
            alert('Unable to redirect. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="max-w-xl w-full p-6 ">
                {/* Card Header with Back Button */}
                <div className="relative mb-6">
                    <h1 className="text-2xl font-semibold text-white text-center p-4 rounded-lg" style={{ 
                        backgroundColor: 'blue', 
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' 
                    }}>
                        Contract Management
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
                    {/* Contract Icon/Image */}
                    <div className="mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6M5 7h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
                            </svg>
                        </div>
                    </div>

                    <h3 className="text-xl font-medium text-gray-800 mb-2">Contract Management</h3>
                    <p className="text-gray-600 text-sm mb-4">Handle intake, indexing, version control, secure storage, audit logging, and sharing.</p>
                    
                    {/* Call to Action */}
                    <div className="w-full border-t border-gray-200 pt-4">
                        <button className="w-full bg-gradient-to-r from-blue-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                            <span>Manage Contracts</span>
                            <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>

                    {/* Use Cases */}
                    <div className="mt-4 w-full text-left text-xs text-gray-500">
                        <p className="mb-1">Use Cases:</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                            <span className="bg-purple-50 text-blue-700 px-2 py-1 rounded">Legal document organization</span>
                            <span className="bg-purple-50 text-blue-700 px-2 py-1 rounded">Case file management</span>
                            <span className="bg-purple-50 text-blue-700 px-2 py-1 rounded">Knowledge sharing</span>
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div className="mt-4 w-full">
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-50 text-green-700 font-medium">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Secure & Compliant
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractManagementCard;