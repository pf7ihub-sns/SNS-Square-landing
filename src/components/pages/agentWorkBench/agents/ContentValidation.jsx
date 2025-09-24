import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const ContentValidation = () => {
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!text.trim() && !file) {
            setError('Please enter text or upload a file to validate');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        if (file) formData.append('file', file);
        if (text) formData.append('content', text);
        formData.append('mode', 'validate');
        formData.append('options', JSON.stringify({
            check_completeness: true,
            check_formatting: true,
            check_accuracy: true,
            check_metadata: true,
            check_readability: true,
        }));

        try {
            const response = await axios.post(
                `${API_BASE}/content-validation/validate`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            setResult(response.data);
        } catch (err) {
            setError(
                err.response?.data?.detail || 'Error validating content. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="w-full max-w-5xl mt-10">
                {/* Header */}
                <div className="relative">
                    <h1 className="text-3xl font-semibold text-white text-center mb-4 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        Content Validation
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
                <div className="text-center mb-4 text-gray-700">
                    <p className="mb-2">Validate your content for completeness, formatting, accuracy, metadata, and readability.</p>
                    <p className="text-sm">Enter text or upload a TXT, DOCX, or RTF file.</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                        <div className="mb-4">
                            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                                Upload File
                            </label>
                            <input
                                id="file"
                                type="file"
                                onChange={handleFileChange}
                                accept=".txt,.docx,.rtf"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                            />
                            <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                                Or Enter Text
                            </label>
                            <textarea
                                id="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full h-40 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base bg-gray-50"
                                placeholder="Type your content here..."
                            />
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || (!text.trim() && !file)}
                            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || (!text.trim() && !file) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                            style={{ backgroundColor: loading || (!text.trim() && !file) ? '#9CA3AF' : '#1E3A8A' }}
                        >
                            {loading ? 'Validating...' : 'Validate Content'}
                        </button>
                        {error && (
                            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg shadow-sm border border-gray-200">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Output Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                        {result && (
                            <div className="w-full h-96 overflow-y-auto">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                                    Validation Results
                                </h2>
                                <div className="space-y-6">
                                    <div className="border-t border-gray-200 pt-4">
                                        <h3 className="text-md font-medium text-gray-700 mb-2">Summary</h3>
                                        <p className="text-gray-600"><span className="font-bold">Status:</span> {result.status}</p>
                                        <p className="text-gray-600"><span className="font-bold">Compliance Score:</span> {result.compliance_score}%</p>
                                        <p className="text-gray-600"><span className="font-bold">Word Count:</span> {result.word_count}</p>
                                        <p className="text-gray-600"><span className="font-bold">Readability Score:</span> {result.readability_score}</p>
                                        <p className="text-gray-600"><span className="font-bold">Readability Level:</span> {result.summary.readability_level}</p>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4">
                                        <h3 className="text-md font-medium text-gray-700 mb-2">Issues</h3>
                                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                                            {result.issues.map((issue, index) => (
                                                <li key={index}>
                                                    {issue.description} (Severity: {issue.severity}, Confidence: {issue.confidence})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4">
                                        <h3 className="text-md font-medium text-gray-700 mb-2">Suggested Fixes</h3>
                                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                                            {result.suggested_fixes.map((fix, index) => (
                                                <li key={index}>{fix}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentValidation;