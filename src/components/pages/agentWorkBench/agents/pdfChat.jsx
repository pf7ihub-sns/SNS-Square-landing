import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const PDFChat = () => {
    const [file, setFile] = useState(null);
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(null);
        setResult(null);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a PDF file to upload.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(
                `${API_BASE}/pdf-chat/upload-pdf`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error uploading PDF. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleQuery = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            setError('Please enter a query.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `${API_BASE}/pdf-chat/query`,
                { query },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            setResult((prev) => ({ ...prev, ...response.data }));
        } catch (err) {
            setError(err.response?.data?.detail || 'Error processing query. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="w-full max-w-5xl mt-10">
                {/* Header */}
                <div className="relative">
                    <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        PDF Chat
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
                    <p className="mb-2">Upload a PDF and ask questions based on its content.</p>
                    <p className="text-sm">Process the PDF first, then submit queries.</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                        <div className="mb-4">
                            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                                Upload PDF
                            </label>
                            <input
                                id="file"
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={handleUpload}
                            disabled={loading || !file}
                            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                            style={{ backgroundColor: loading || !file ? '#9CA3AF' : '#1E3A8A' }}
                        >
                            {loading ? 'Processing...' : 'Process PDF'}
                        </button>
                        {result?.status && (
                            <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg shadow-sm border border-gray-200">
                                {result.status}
                            </div>
                        )}
                        <div className="mt-4">
                            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
                                Ask a Question
                            </label>
                            <textarea
                                id="query"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder="Enter your question here..."
                                disabled={!result?.status}
                            />
                        </div>
                        <button
                            onClick={handleQuery}
                            disabled={loading || !result?.status || !query.trim()}
                            className={`w-full mt-4 py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !result?.status || !query.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                            style={{ backgroundColor: loading || !result?.status || !query.trim() ? '#9CA3AF' : '#1E3A8A' }}
                        >
                            {loading ? 'Answering...' : 'Submit Query'}
                        </button>
                        {error && (
                            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg shadow-sm border border-gray-200">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Output Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        {result && (
                            <div className="w-full h-96 overflow-y-auto space-y-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                                    Results
                                </h2>
                                {result.file_info && (
                                    <div>
                                        <h3 className="text-md font-medium text-gray-700 mb-2">File Info</h3>
                                        <p className="text-gray-600"><span className="font-bold">Filename:</span> {result.file_info.filename}</p>
                                        <p className="text-gray-600"><span className="font-bold">Pages:</span> {result.file_info.num_pages}</p>
                                    </div>
                                )}
                                {result.answer && (
                                    <div>
                                        <h3 className="text-md font-medium text-gray-700 mb-2">Answer</h3>
                                        <p className="text-gray-600 bg-gray-50 p-2 rounded">{result.answer}</p>
                                    </div>
                                )}
                                {result.query && (
                                    <div>
                                        <h3 className="text-md font-medium text-gray-700 mb-2">Query</h3>
                                        <p className="text-gray-600 bg-gray-50 p-2 rounded">{result.query}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDFChat;