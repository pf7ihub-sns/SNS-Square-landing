import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const InvoiceAgent = () => {
    const [inputMode, setInputMode] = useState('text');
    const [formData, setFormData] = useState({ invoice_text: '', file: null });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
        setResult(null);
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
        setError(null);
        setResult(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.invoice_text.trim() && !formData.file) {
            setError('Please enter text or upload a PDF invoice.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            let response;
            if (inputMode === 'text' && formData.invoice_text.trim()) {
                response = await axios.post(`${API_BASE}/invoice_agent/analyze-invoice`, formData, {
                    headers: { 'Content-Type': 'application/json' },
                });
                setResult(response.data);
            } else if (inputMode === 'file' && formData.file) {
                const formDataToSend = new FormData();
                formDataToSend.append('file', formData.file);
                response = await axios.post(`${API_BASE}/invoice_agent/analyze-invoice-file`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setResult(response.data);
            }
        } catch (err) {
            setError(
                err.response?.data?.detail || 'Error analyzing invoice. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="w-full max-w-5xl mt-18">
                {/* Header */}
                <div className="relative">
                    <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        Invoice Agent
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
                    <p className="mb-2">Analyze an invoice for completeness, clarity, and reliability.</p>
                    <p className="text-sm">Enter text or upload a PDF to get detailed feedback.</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Input Mode
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="inputMode"
                                        value="text"
                                        checked={inputMode === 'text'}
                                        onChange={() => setInputMode('text')}
                                        className="mr-2"
                                    />
                                    Text
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="inputMode"
                                        value="file"
                                        checked={inputMode === 'file'}
                                        onChange={() => setInputMode('file')}
                                        className="mr-2"
                                    />
                                    File (PDF)
                                </label>
                            </div>
                        </div>
                        {inputMode === 'text' ? (
                            <div>
                                <label htmlFor="invoice_text" className="block text-sm font-medium text-gray-700 mb-3">
                                    Invoice Text
                                </label>
                                <textarea
                                    id="invoice_text"
                                    name="invoice_text"
                                    value={formData.invoice_text}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y h-32 text-sm"
                                    placeholder="Enter invoice text here (e.g., Invoice #123, Date: 2025-09-18, Vendor: ABC Corp, Total: $500)..."
                                />
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-3">
                                    Upload PDF Invoice
                                </label>
                                <input
                                    id="file"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading || (!formData.invoice_text.trim() && !formData.file)}
                            className={`w-full py-2 px-4 mt-5 rounded-md text-white font-medium transition-colors  ${loading || (!formData.invoice_text.trim() && !formData.file) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                            style={{ backgroundColor: loading || (!formData.invoice_text.trim() && !formData.file) ? '#9CA3AF' : '#1E3A8A' }}
                        >
                            {loading ? 'Analyzing...' : 'Analyze Invoice'}
                        </button>
                        {loading && (
                            <div className="mt-4 text-center">
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
                                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out" style={{ width: '50%' }}></div>
                                </div>
                                <p className="text-xs text-gray-500">Processing...</p>
                            </div>
                        )}
                        {error && (
                            <div className="mt-4 p-2 bg-red-50 text-red-700 rounded-lg text-sm">
                                {error} <button onClick={() => setError(null)} className="ml-2 text-red-600 underline text-xs">Try again</button>
                            </div>
                        )}
                    </div>

                    {/* Output Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        {result && (
                            <div className="w-full h-96 overflow-y-auto space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                                    Analysis Results
                                </h2>
                                {result.extracted_text_preview && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Extracted Text Preview</h3>
                                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{result.extracted_text_preview}</p>
                                    </div>
                                )}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-md font-medium text-blue-800 mb-2">Scores</h3>
                                    <p className="text-gray-700 text-sm">Completeness: {result.output?.completeness || 0}%</p>
                                    <p className="text-gray-700 text-sm">Clarity: {result.output?.clarity || 0}%</p>
                                    <p className="text-gray-700 text-sm">Reliability: {result.output?.reliability || 0}%</p>
                                </div>
                                {result.output?.feedback && result.output.feedback.length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Feedback</h3>
                                        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                                            {result.output.feedback.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                        {!loading && !error && !result && (
                            <div className="w-full h-96 flex items-center justify-center text-gray-500">
                                Your analysis results will appear here
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceAgent;