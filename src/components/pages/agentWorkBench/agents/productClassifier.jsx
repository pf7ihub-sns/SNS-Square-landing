import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft, AlertCircle } from 'lucide-react';

// Error Boundary Component
class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 text-center text-red-600">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold">Something Went Wrong</h2>
                    <p className="text-sm">{this.state.error?.message}</p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

const API_BASE = "http://127.0.0.1:8000";

const ProductClassifier = () => {
    const [description, setDescription] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim()) {
            setError('Please provide a product or service description.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post(`${API_BASE}/product-service-classifier/classify`, { description: description.trim() }, {
                headers: { 'Content-Type': 'application/json' },
            });
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error classifying description. Please try again.');
            console.error('API Error:', err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="w-full max-w-5xl mt-22">
                    {/* Header */}
                    <div className="relative">
                        <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                            Product Service Classifier
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
                        <p className="mb-2">Classify a product or service description into categories and dimensions.</p>
                        <p className="text-sm">Examples: 'Samsung Galaxy S23', 'Online fitness coaching'</p>
                    </div>

                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y h-32 text-sm"
                                    placeholder="e.g., 'Samsung Galaxy S23' or 'Online fitness coaching'"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !description.trim()}
                                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !description.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                                style={{ backgroundColor: loading || !description.trim() ? '#9CA3AF' : '#1E3A8A' }}
                            >
                                {loading ? 'Classifying...' : 'Classify'}
                            </button>
                        </form>
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
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                        {result && (
                            <div className="w-full h-96 overflow-y-auto space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                                    Classification Result
                                </h2>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-md font-medium text-blue-800 mb-2">Description</h3>
                                    <p className="text-gray-700 text-sm">{result.description}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-md font-medium text-blue-800 mb-2">Primary Category</h3>
                                    <p className="text-gray-700 text-sm">{result.primaryCategory}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-md font-medium text-blue-800 mb-2">Primary Subcategory</h3>
                                    <p className="text-gray-700 text-sm">{result.primarySubcategory}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-md font-medium text-blue-800 mb-2">Primary Confidence</h3>
                                    <p className="text-gray-700 text-sm">{result.primaryConfidence}%</p>
                                </div>
                                {result.secondaryCategory && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Secondary Category</h3>
                                        <p className="text-gray-700 text-sm">{result.secondaryCategory}</p>
                                    </div>
                                )}
                                {result.secondarySubcategory && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Secondary Subcategory</h3>
                                        <p className="text-gray-700 text-sm">{result.secondarySubcategory}</p>
                                    </div>
                                )}
                                {result.secondaryConfidence && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Secondary Confidence</h3>
                                        <p className="text-gray-700 text-sm">{result.secondaryConfidence}%</p>
                                    </div>
                                )}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-md font-medium text-blue-800 mb-2">Sentiment</h3>
                                    <p className="text-gray-700 text-sm">{result.sentiment}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-md font-medium text-blue-800 mb-2">Industry</h3>
                                    <p className="text-gray-700 text-sm">{result.industry}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-md font-medium text-blue-800 mb-2">Use Case</h3>
                                    <p className="text-gray-700 text-sm">{result.useCase}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-md font-medium text-blue-800 mb-2">Target Audience</h3>
                                    <p className="text-gray-700 text-sm">{result.targetAudience}</p>
                                </div>
                                {result.clarification && (
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-yellow-800 mb-2">Clarification</h3>
                                        <p className="text-gray-700 text-sm">{result.clarification}</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {!loading && !error && !result && (
                            <div className="w-full h-96 flex items-center justify-center text-gray-500">
                                Your classification result will appear here
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default ProductClassifier;