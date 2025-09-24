

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function RealEstateServiceClassifier() {
    const [description, setDescription] = useState('');
    const [followUpQuestion, setFollowUpQuestion] = useState('');
    const [classifications, setClassifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleClassify = async (e) => {
        e.preventDefault();
        if (!description.trim()) {
            setError('Please provide a real estate service description.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://127.0.0.1:8000/real-estate-classifier/classify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description }),
            });

            if (!response.ok) {
                throw new Error('Failed to classify real estate service');
            }

            const data = await response.json();
            setClassifications((prev) => {
                const existingIds = new Set(prev.map(c => c.serviceId));
                if (existingIds.has(data.serviceId)) {
                    return prev.map(c => c.serviceId === data.serviceId ? { ...c, ...data, remarks: `${c.remarks} Duplicate entry merged.` } : c);
                }
                return [...prev, data];
            });
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFollowUp = async (e) => {
        e.preventDefault();
        if (!followUpQuestion.trim() || classifications.length === 0) {
            setError('Please provide a follow-up question and ensure a classification exists.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const latestClassification = classifications[classifications.length - 1];
            const response = await fetch('http://127.0.0.1:8000/real-estate-classifier/follow-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    originalName: latestClassification.name,
                    followUpQuestion: followUpQuestion,
                    context: [], // Adjusted since messages state was removed
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to process follow-up question');
            }

            const data = await response.json();
            // Note: messages state was removed, so follow-up responses won't be stored. Adjust if needed.
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
            setFollowUpQuestion('');
        }
    };

    const handleDownload = () => {
        if (classifications.length === 0) return;
        const csvContent = [
            Object.keys(classifications[0]).join(','),
            ...classifications.map(row => Object.values(row).join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'real_estate_classifications.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="max-w-3xl w-full p-4">
                <div className="relative">
                    <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        Real Estate Service Classifier
                    </h1>
                    <button
                        onClick={() => window.location.href = '/media-entertainment'}
                        className="absolute top-4 right-4 flex items-center gap-2 text-white font-medium hover:text-blue-200 transition-colors p-2 hover:bg-white-50 hover:bg-opacity-10 rounded-md z-10"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>
                </div>

                {/* Instructions */}
                <div className="mb-6 text-center">
                    <p className="text-gray-800 mb-2">Classify real estate services and handle follow-up questions.</p>
                    <p className="text-gray-600 text-sm">Enter a description to classify, then ask follow-up questions based on the result.</p>
                </div>

                {/* Classification Form */}
                <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <form onSubmit={handleClassify} className="space-y-4">
                        <div>
                            <label className="block text-gray-800 font-medium mb-2">
                                Describe the Real Estate Service
                            </label>
                            <textarea
                                rows={4}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                                placeholder="e.g., 2BHK furnished flat for rent in Mumbai IT hub"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !description.trim()}
                            className={`w-full py-1.5 px-3 rounded-md text-white font-medium transition-colors ${isLoading || !description.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                            style={{ backgroundColor: isLoading || !description.trim() ? '#9CA3AF' : '#1E3A8A' }}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Classifying...
                                </span>
                            ) : 'Classify Service'}
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg shadow-sm border border-gray-200">
                        {error}
                    </div>
                )}

                {/* Follow-up Form */}
                {classifications.length > 0 && (
                    <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <form onSubmit={handleFollowUp} className="space-y-4">
                            <div>
                                <label className="block text-gray-800 font-medium mb-2">
                                    Ask a Follow-up Question
                                </label>
                                <textarea
                                    rows={3}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                                    placeholder="e.g., What are similar properties in this location?"
                                    value={followUpQuestion}
                                    onChange={(e) => setFollowUpQuestion(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || !followUpQuestion.trim()}
                                className={`w-full py-1.5 px-3 rounded-md text-white font-medium transition-colors ${isLoading || !followUpQuestion.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                                style={{ backgroundColor: isLoading || !followUpQuestion.trim() ? '#9CA3AF' : '#1E3A8A' }}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Processing...
                                    </span>
                                ) : 'Ask Follow-up'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Detailed Listings */}
                {classifications.length > 0 && (
                    <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium text-gray-800">Current Classifications</h2>
                            <button
                                onClick={handleDownload}
                                className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-1.5 px-3 rounded-md transition-colors"
                                style={{ backgroundColor: '#1E3A8A' }}
                            >
                                Download CSV
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-700 border-collapse">
                                <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-600">
                                    <tr>
                                        <th className="px-4 py-2 border-b">Service Name</th>
                                        <th className="px-4 py-2 border-b">Transaction Type</th>
                                        <th className="px-4 py-2 border-b">Property Type</th>
                                        <th className="px-4 py-2 border-b">Service Specialization</th>
                                        <th className="px-4 py-2 border-b">Customer Segment</th>
                                        <th className="px-4 py-2 border-b">Geographic Scope</th>
                                        <th className="px-4 py-2 border-b">Location</th>
                                        <th className="px-4 py-2 border-b">Client/Owner</th>
                                        <th className="px-4 py-2 border-b">Service Status</th>
                                        <th className="px-4 py-2 border-b">Assigned Agent</th>
                                        <th className="px-4 py-2 border-b">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classifications.map((classification, index) => (
                                        <tr key={index} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-2">{classification.name}</td>
                                            <td className="px-4 py-2">{classification.transactionType}</td>
                                            <td className="px-4 py-2">{classification.propertyType}</td>
                                            <td className="px-4 py-2">{classification.serviceSpecialization}</td>
                                            <td className="px-4 py-2">{classification.customerSegment}</td>
                                            <td className="px-4 py-2">{classification.geographicScope}</td>
                                            <td className="px-4 py-2">{classification.location}</td>
                                            <td className="px-4 py-2">{classification.client}</td>
                                            <td className="px-4 py-2">{classification.serviceStatus}</td>
                                            <td className="px-4 py-2">{classification.assignedAgent}</td>
                                            <td className="px-4 py-2">{classification.remarks}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}