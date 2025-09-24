import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function RetailComplaint() {
    const [complaintsText, setComplaintsText] = useState('');
    const [file, setFile] = useState(null);
    const [classifications, setClassifications] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showFullSummary, setShowFullSummary] = useState(false);

    const handleProcess = async (e) => {
        e.preventDefault();
        if (!complaintsText.trim() && !file) {
            setError('Please provide complaint text or upload a file.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            let response;
            if (complaintsText.trim() && !file) {
                // Handle text input with JSON payload
                const complaints = complaintsText.split('\n').filter(line => line.trim());
                response = await fetch('http://127.0.0.1:8000/retail_complaint_agent/classify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ complaints }),
                });
            } else if (file) {
                // Handle file upload with FormData
                const formData = new FormData();
                formData.append('file', file);
                response = await fetch('http://127.0.0.1:8000/retail_complaint_agent/classify_file', {
                    method: 'POST',
                    body: formData,
                });
            }

            if (!response.ok) {
                throw new Error('Failed to process complaints');
            }

            const data = await response.json();
            setClassifications(data);
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
            setComplaintsText('');
            setFile(null);
        }
    };

    const renderSummary = () => {
        if (!classifications || !classifications.length) return <p className="text-gray-500">No classifications available. Submit complaints to see results.</p>;

        if (!showFullSummary) {
            return (
                <div className="space-y-2 text-gray-700">
                    {classifications.slice(0, 1).map((item, index) => (
                        <div key={index}>
                            <p><strong>Complaint:</strong> {item.complaint}</p>
                            <p><strong>Category:</strong> {item.classification.category}</p>
                            <p><strong>Urgency:</strong> {item.classification.urgency}</p>
                            <button
                                onClick={() => setShowFullSummary(true)}
                                className="mt-2 text-blue-700 hover:text-blue-800 font-medium"
                            >
                                Show More
                            </button>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="space-y-2 text-gray-700" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {classifications.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 pb-2 mb-2 last:border-0 last:pb-0">
                        <p><strong>Complaint:</strong> {item.complaint}</p>
                        <p><strong>Category:</strong> {item.classification.category}</p>
                        <p><strong>Urgency:</strong> {item.classification.urgency}</p>
                        <p><strong>Sentiment:</strong> {item.classification.sentiment}</p>
                        <p><strong>Root Cause:</strong> {item.classification.root_cause}</p>
                        <p><strong>Keywords:</strong> {JSON.stringify(item.classification.keywords)}</p>
                        <p><strong>Recommendations:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            {item.classification.recommendations.map((rec, i) => (
                                <li key={i}>{rec}</li>
                            ))}
                        </ul>
                    </div>
                ))}
                <button
                    onClick={() => setShowFullSummary(false)}
                    className="mt-2 text-blue-700 hover:text-blue-800 font-medium"
                >
                    Show Less
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="relative">
                    <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        Retail Complaint Classifier
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
                <div className="text-center mb-3 text-gray-700">
                    <p className="mb-2">Classify retail complaints from text or file uploads.</p>
                    <p className="text-sm">Supported formats: CSV, XLSX, JSON, TXT. Enter one complaint per line.</p>
                </div>

                {/* Two-Column Layout: Summary on Left, Input on Right */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                    {/* Input Form (Right) */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <form onSubmit={handleProcess} className="space-y-4">
                            <div>
                                <label className="block text-gray-800 font-medium mb-2">Complaints (One per line)</label>
                                <textarea
                                    rows={4}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Product damaged during delivery\nDelayed shipment..."
                                    value={complaintsText}
                                    onChange={(e) => setComplaintsText(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-800 font-medium mb-2">Upload File (CSV, XLSX, JSON, TXT)</label>
                                <input
                                    type="file"
                                    accept=".csv,.xls,.xlsx,.json,.txt"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || (!complaintsText.trim() && !file)}
                                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${isLoading || (!complaintsText.trim() && !file) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                                style={{ backgroundColor: isLoading || (!complaintsText.trim() && !file) ? '#9CA3AF' : '#1E3A8A' }}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Processing...
                                    </span>
                                ) : 'Classify Complaints'}
                            </button>
                        </form>
                        {error && (
                            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md border border-gray-200">
                                {error}
                            </div>
                        )}
                    </div>
                    {/* Summary Output (Left) */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-lg font-medium text-gray-800 mb-4">Complaint Summary</h2>
                        {renderSummary()}
                    </div>
                </div>
            </div>
        </div>
    );
}