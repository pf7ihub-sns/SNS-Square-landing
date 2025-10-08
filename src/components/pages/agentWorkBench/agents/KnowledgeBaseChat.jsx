import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const categoryToKbTypes = {
    "IT/Support": ["Troubleshooting Guides", "FAQs", "System Manuals"],
    "HR/Admin": ["Company Policies", "HR Guidelines", "Leave Policies"],
    "Education": ["Student FAQs", "Course Material", "Exam Guidelines"],
    "Healthcare": ["Patient Guidelines", "Procedure Manuals", "Medical FAQs"],
    "Customer Service": ["Product FAQs", "Warranty Info", "Service Instructions"],
    "Government": ["Public FAQs", "Forms & Procedures", "Policy Guidelines"]
};

const KnowledgeBaseChat = () => {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('');
    const [kbType, setKbType] = useState('');
    const [kbTypesOptions, setKbTypesOptions] = useState([]);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        setKbTypesOptions(category ? categoryToKbTypes[category] : []);
        setKbType('');
    }, [category]);

    const handleQuery = async (e) => {
        e.preventDefault();
        if (!query.trim()) return setError('Please enter a question.');
        if (!category.trim()) return setError('Please select a category.');
        if (!kbType.trim()) return setError('Please select a knowledge base type.');

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post(
                `${API_BASE}/knowledgebase_agent/run`,
                { user_query: query, category, kb_type: kbType },
                { headers: { 'Content-Type': 'application/json' } }
            );
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error processing query. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return setError("Please select a file to upload.");
        if (!category) return setError("Please select a category.");
        if (!kbType) return setError("Please select a knowledge base type.");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", category);
        formData.append("kb_type", kbType);

        setUploading(true);
        setError(null);

        try {
            await axios.post(`${API_BASE}/knowledgebase_agent/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("File uploaded successfully!");
            setFile(null);
        } catch (err) {
            setError(err.response?.data?.detail || "File upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl mt-10">
                {/* Header */}
                <div className="relative">
                    <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A' }}>
                        Knowledge Base Q&A
                    </h1>
                    <button
                        onClick={() => window.history.back()}
                        className="absolute top-4 right-4 flex items-center gap-2 text-white font-medium hover:text-blue-200 transition-colors p-2 rounded-md z-10"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>
                </div>

                {/* Input Section */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                    <div className="mb-4">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Select Category</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Choose Category --</option>
                            {Object.keys(categoryToKbTypes).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="kbType" className="block text-sm font-medium text-gray-700 mb-2">Select Knowledge Base Type</label>
                        <select
                            id="kbType"
                            value={kbType}
                            onChange={(e) => setKbType(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!kbTypesOptions.length}
                        >
                            <option value="">-- Choose KB Type --</option>
                            {kbTypesOptions.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* File Upload */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>

                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt,.json,.xls,.xlsx,.csv"
                            onChange={handleFileChange}
                            disabled={!category || !kbType}   // ✅ disabled until both selected
                            className={`block w-full text-sm text-gray-700 border rounded p-2 
                                ${!category || !kbType ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        />

                        {file && <p className="text-sm mt-2 text-gray-600">Selected: {file.name}</p>}

                        <button
                            onClick={handleUpload}
                            disabled={uploading || !file || !category || !kbType}
                            className={`mt-2 w-full py-2 px-4 rounded-md text-white font-medium transition-colors 
                                ${uploading || !file || !category || !kbType 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-green-600 hover:bg-green-700'}`}
                        >
                            {uploading ? "Uploading..." : "Upload File"}
                        </button>
                    </div>

                    {/* Query */}
                    <div className="mb-4">
                        <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">Ask a Question</label>
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
                        disabled={loading || !query.trim() || !category.trim() || !kbType.trim()}
                        className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !query.trim() || !category.trim() || !kbType.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                        style={{ backgroundColor: loading || !query.trim() || !category.trim() || !kbType.trim() ? '#9CA3AF' : '#1E3A8A' }}
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
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Answer</h2>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded">{result.answer || "No answer found."}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KnowledgeBaseChat;
