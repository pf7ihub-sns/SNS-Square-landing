import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function RealEstateInquiryAgent() {
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [classifications, setClassifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleClassify = async (e) => {
        e.preventDefault();
        if (!description.trim() && !file) {
            setError('Please provide a description or upload a file.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            let response;
            if (description.trim()) {
                response = await fetch('http://127.0.0.1:8000/real_estate_inquiry_agent/classify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ inquiries: [description] }),
                });
            } else if (file) {
                const formData = new FormData();
                formData.append('file', file);
                response = await fetch('http://127.0.0.1:8000/real_estate_inquiry_agent/classify_file', {
                    method: 'POST',
                    body: formData,
                });
            }

            if (!response.ok) {
                throw new Error('Failed to classify inquiries');
            }

            const data = await response.json();
            setClassifications(data);
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
            setDescription('');
            setFile(null);
        }
    };

    const handleDownload = () => {
        if (classifications.length === 0) return;
        const csvContent = [
            'inquiry,category,property_type,urgency,keywords',
            ...classifications.map(row => [
                row.inquiry,
                row.classification.category,
                row.classification.property_type,
                row.classification.urgency,
                JSON.stringify(row.classification.keywords),
            ].join(',')),
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
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center mt-10" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="max-w-3xl w-full p-4">
                <div className="relative">
                    <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        Real Estate Inquiry Classifier
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
                    <p className="text-gray-800 mb-2">Real estate inquiries individually or in bulk via file upload.</p>
                    <p className="text-gray-600 text-sm">Supported formats: CSV, XLSX, JSON, TXT. Use 'inquiry' column for CSV/Excel.</p>
                </div>

                {/* Input Form */}
                <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <form onSubmit={handleClassify} className="space-y-4">
                        <div>
                            <label className="block text-gray-800 font-medium mb-2">
                                Enter Inquiry Description
                            </label>
                            <textarea
                                rows={4}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                                placeholder="e.g., 2BHK flat for rent in Mumbai"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-800 font-medium mb-2">
                                Upload File (CSV, XLSX, JSON, TXT)
                            </label>
                            <input
                                type="file"
                                accept=".csv,.xls,.xlsx,.json,.txt"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || (!description.trim() && !file)}
                            className={`w-full py-1.5 px-3 rounded-md text-white font-medium transition-colors ${isLoading || (!description.trim() && !file) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                            style={{ backgroundColor: isLoading || (!description.trim() && !file) ? '#9CA3AF' : '#1E3A8A' }}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Classifying...
                                </span>
                            ) : 'Classify Inquiries'}
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg shadow-sm border border-gray-200">
                        {error}
                    </div>
                )}

                {/* Classifications Table */}
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
                                        <th className="px-4 py-2 border-b">Inquiry</th>
                                        <th className="px-4 py-2 border-b">Category</th>
                                        <th className="px-4 py-2 border-b">Property Type</th>
                                        <th className="px-4 py-2 border-b">Urgency</th>
                                        <th className="px-4 py-2 border-b">Keywords</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classifications.map((item, index) => (
                                        <tr key={index} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-2">{item.inquiry}</td>
                                            <td className="px-4 py-2">{item.classification.category}</td>
                                            <td className="px-4 py-2">{item.classification.property_type}</td>
                                            <td className="px-4 py-2">{item.classification.urgency}</td>
                                            <td className="px-4 py-2">{JSON.stringify(item.classification.keywords)}</td>
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