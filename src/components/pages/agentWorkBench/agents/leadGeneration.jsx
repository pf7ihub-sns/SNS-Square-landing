import React from 'react';
import { ArrowLeft } from 'lucide-react';

const LeadGenerationCard = () => {
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
            window.location.href = 'http://industry-specific-workflow.s3-website-ap-southeast-2.amazonaws.com/sales/agent-1';
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
                        backgroundColor: '#F59E0B', // Amber/Orange color for sales/lead generation theme
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' 
                    }}>
                        Lead Generation
                    </h1>
                    <button
                        onClick={() => window.location.href = '/media-entertainment'} // Adjust to your desired back route
                        className="absolute top-4 right-4 flex items-center gap-2 text-white font-medium hover:text-orange-200 transition-colors p-2 hover:bg-white-50 hover:bg-opacity-10 rounded-md"
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
                    {/* Lead Generation Icon/Image */}
                    <div className="mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                            </svg>
                        </div>
                        {/* Alternative: Use image if you have one */}
                        {/* <img
                            src={imgLeadGen}
                            alt="Lead Generation"
                            className="w-full h-45 object-cover rounded-md"
                        /> */}
                    </div>

                    <h3 className="text-xl font-medium text-gray-800 mb-2">Lead Generation</h3>
                    <p className="text-gray-600 text-sm mb-4">Sales Lead Generation - Find and qualify high-potential prospects automatically.</p>
                    
                    {/* Key Features */}
                    <div className="w-full mb-6">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-3 text-left">
                                <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-700">Prospect identification</span>
                            </div>
                            <div className="flex items-center space-x-3 text-left">
                                <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-700">Lead scoring</span>
                            </div>
                            <div className="flex items-center space-x-3 text-left">
                                <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-700">Outreach automation</span>
                            </div>
                            <div className="flex items-center space-x-3 text-left">
                                <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-700">Engagement tracking</span>
                            </div>
                        </div>
                    </div>

                    {/* Performance Stats */}
                    <div className="w-full grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-amber-600">3x</div>
                            <div className="text-xs text-gray-500">More Leads</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-amber-600">67%</div>
                            <div className="text-xs text-gray-500">Higher Quality</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-amber-600">24/7</div>
                            <div className="text-xs text-gray-500">Prospecting</div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="w-full border-t border-gray-200 pt-4">
                        <button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-amber-700 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                            <span>Generate Leads Now</span>
                            <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>

                    {/* Use Cases */}
                    <div className="mt-4 w-full text-left text-xs text-gray-500">
                        <p className="mb-1">Use Cases:</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                            <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded">B2B lead generation</span>
                            <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded">Account-based marketing</span>
                            <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded">Sales pipeline growth</span>
                        </div>
                    </div>

                    {/* Integration Badges */}
                    <div className="mt-4 w-full flex justify-center space-x-2 flex-wrap gap-2">
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 font-medium">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a8 8 0 100 0A8 8 0 008 11zM16 8a8 8 0 11-16 0 8 8 0 0116 0z" />
                            </svg>
                            LinkedIn
                        </div>
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-50 text-indigo-700 font-medium">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            CRM
                        </div>
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-50 text-green-700 font-medium">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Email
                        </div>
                    </div>

                    {/* ROI Badge */}
                    <div className="mt-4 w-full">
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-50 text-green-700 font-medium">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            5x ROI in 3 months
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadGenerationCard;