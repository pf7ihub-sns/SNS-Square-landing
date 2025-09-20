import React from 'react';
import { ArrowLeft } from 'lucide-react';

const EmailTriageCard = () => {
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
            window.location.href = 'http://industry-specific-workflow.s3-website-ap-southeast-2.amazonaws.com/general/agent-1/run';
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
                        backgroundColor: '#EC4899', // Pink color for email/productivity theme
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' 
                    }}>
                        Email Triage
                    </h1>
                    <button
                        onClick={() => window.location.href = '/media-entertainment'} // Adjust to your desired back route
                        className="absolute top-4 right-4 flex items-center gap-2 text-white font-medium hover:text-pink-200 transition-colors p-2 hover:bg-white-50 hover:bg-opacity-10 rounded-md"
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
                    {/* Email Icon/Image */}
                    <div className="mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        {/* Alternative: Use image if you have one */}
                        {/* <img
                            src={imgEmail}
                            alt="Email Triage"
                            className="w-full h-45 object-cover rounded-md"
                        /> */}
                    </div>

                    <h3 className="text-xl font-medium text-gray-800 mb-2">Email Triage</h3>
                    <p className="text-gray-600 text-sm mb-4">Automate email sorting, prioritization, and response generation.</p>
                    
                    {/* Key Features */}
                    <div className="w-full mb-6">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-3 text-left">
                                <div className="w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-700">Email classification</span>
                            </div>
                            <div className="flex items-center space-x-3 text-left">
                                <div className="w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-700">Priority tagging</span>
                            </div>
                            <div className="flex items-center space-x-3 text-left">
                                <div className="w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-700">Response drafting</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Preview */}
                    <div className="w-full grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-pink-600">94%</div>
                            <div className="text-xs text-gray-500">Accuracy</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-pink-600">80%</div>
                            <div className="text-xs text-gray-500">Faster</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-pink-600">24/7</div>
                            <div className="text-xs text-gray-500">Available</div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="w-full border-t border-gray-200 pt-4">
                        <button className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-700 hover:to-rose-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                            <span>Start Triage</span>
                            <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>

                    {/* Use Cases */}
                    <div className="mt-4 w-full text-left text-xs text-gray-500">
                        <p className="mb-1">Use Cases:</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                            <span className="bg-pink-50 text-pink-700 px-2 py-1 rounded">Inbox management</span>
                            <span className="bg-pink-50 text-pink-700 px-2 py-1 rounded">Customer support</span>
                            <span className="bg-pink-50 text-pink-700 px-2 py-1 rounded">Internal communications</span>
                        </div>
                    </div>

                    {/* Integration Badges */}
                    <div className="mt-4 w-full flex justify-center space-x-2">
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 font-medium">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            Gmail
                        </div>
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 font-medium">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            Outlook
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailTriageCard;