import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const KnowledgeBaseChat = () => {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleQuery = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            setError('Please enter a question.');
            return;
        }
        if (!category.trim()) {
            setError('Please select a category.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post(
                `${API_BASE}/knowledgebase_agent/run`,
                { user_query: query, category },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error processing query. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="w-full max-w-4xl mt-10">
                {/* Header */}
                <div className="relative">
                    <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        Knowledge Base Q&A
                    </h1>
                    <button
                        onClick={() => window.history.back()}
                        className="absolute top-4 right-4 flex items-center gap-2 text-white font-medium hover:text-blue-200 transition-colors p-2 hover:bg-white-50 hover:bg-opacity-10 rounded-md z-10"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>
                </div>

                {/* Input Section */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                    <div className="mb-4">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                            Select Category
                        </label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Choose Category --</option>
                            <option value="IT/Support">IT/Support</option>
                            <option value="HR/Admin">HR/Admin</option>
                            <option value="Education">Education</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Customer Service">Customer Service</option>
                            <option value="Government">Government</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
                            Ask a Question
                        </label>
                        <textarea
                            id="query"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Enter your question here..."
                        />
                    </div>

                    <button
                        onClick={handleQuery}
                        disabled={loading || !query.trim() || !category.trim()}
                        className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !query.trim() || !category.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                        style={{ backgroundColor: loading || !query.trim() || !category.trim() ? '#9CA3AF' : '#1E3A8A' }}
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
                {result && (
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mt-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                            Answer
                        </h2>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded">{result.answer || "No answer found."}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KnowledgeBaseChat;
