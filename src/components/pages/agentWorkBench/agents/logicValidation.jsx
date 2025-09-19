import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ArrowLeft, Send, Trash2 } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const LogicValidation = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysisType, setAnalysisType] = useState('comprehensive');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [result]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!text.trim()) {
            setError('Please enter text to validate.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post(
                `${API_BASE}/logic-validation/validate`,
                { text, analysis_type: analysisType },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error validating logic. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        if (window.confirm('Clear validation results?')) {
            setText('');
            setResult(null);
            setError(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="w-full max-w-5xl mt-18">
                {/* Header */}
                <div className="relative">
                    <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        Logic Validation
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
                    <p className="mb-2">Validate the logical consistency of your text.</p>
                    <p className="text-sm">Select an analysis type and submit text for review.</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <div className="mb-4">
                            <label htmlFor="analysisType" className="block text-sm font-medium text-gray-700 mb-2">
                                Analysis Type
                            </label>
                            <select
                                id="analysisType"
                                value={analysisType}
                                onChange={(e) => setAnalysisType(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                                <option value="comprehensive">Comprehensive</option>
                                <option value="fallacy">Fallacy Detection</option>
                                <option value="structure">Structure Analysis</option>
                            </select>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                                Enter Text
                            </label>
                            <textarea
                                id="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base bg-gray-50"
                                placeholder="Enter text to validate..."
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !text.trim()}
                                className={`p-3 rounded-lg text-white font-medium transition-colors ${loading || !text.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                                style={{ backgroundColor: loading || !text.trim() ? '#9CA3AF' : '#3B82F6' }}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleClear}
                                disabled={loading || (!text.trim() && !result)}
                                className={`p-3 rounded-lg text-white font-medium transition-colors ${loading || (!text.trim() && !result) ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
                                style={{ backgroundColor: loading || (!text.trim() && !result) ? '#9CA3AF' : '#EF4444' }}
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                        {error && (
                            <div className="mt-4 p-2 bg-red-50 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Output Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                        <div className="w-full h-96 overflow-y-auto" ref={messagesEndRef}>
                            {result && (
                                <>
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Validation Results</h2>
                                    <div className="space-y-4">
                                        <p className="text-gray-600"><span className="font-bold">Valid:</span> {result.is_valid ? 'Yes' : 'No'}</p>
                                        <p className="text-gray-600"><span className="font-bold">Confidence Score:</span> {result.confidence_score.toFixed(2)} / 1.0</p>
                                        {result.detected_issues.length > 0 && (
                                            <div>
                                                <p className="font-bold text-gray-700">Detected Issues:</p>
                                                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                                                    {result.detected_issues.map((issue, index) => (
                                                        <li key={index} className="text-sm">
                                                            {issue.type}: {issue.description} (Location: {issue.location}, Severity: {issue.severity})
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {result.analysis && (
                                            <div>
                                                <p className="font-bold text-gray-700">Analysis:</p>
                                                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                                                    {Object.entries(result.analysis).map(([key, value]) => (
                                                        <li key={key} className="text-sm">{key}: {JSON.stringify(value)}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {result.recommendations.length > 0 && (
                                            <div>
                                                <p className="font-bold text-gray-700">Recommendations:</p>
                                                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                                                    {result.recommendations.map((rec, index) => (
                                                        <li key={index} className="text-sm">{rec}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                            {loading && (
                                <div className="text-sm text-gray-600">Analyzing...</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogicValidation;