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

const PolicySuggestion = () => {
    const [query, setQuery] = useState('');
    const [context, setContext] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fixed cleanApiResponse function
    const cleanApiResponse = (data) => {
        console.log('Raw API response:', data); // Debug log
        
        // If data is already a clean object with answer/sources, return it directly
        if (data && typeof data === 'object' && data.answer && data.sources) {
            console.log('Direct object response, returning as-is');
            return {
                answer: data.answer || "No answer available",
                sources: Array.isArray(data.sources) ? data.sources : [],
                confidence: data.confidence || 0.7
            };
        }

        // If it's a string, try to parse JSON
        if (typeof data === "string") {
            try {
                // Clean markdown code blocks if present
                const cleaned = data
                    .replace(/```json|```/g, "")
                    .trim();
                
                console.log('Cleaned string:', cleaned);
                
                const parsed = JSON.parse(cleaned);
                
                return {
                    answer: parsed.answer || "No answer available",
                    sources: Array.isArray(parsed.sources) ? parsed.sources : [],
                    confidence: parsed.confidence || 0.7
                };
            } catch (e) {
                console.error('JSON parsing failed:', e);
                // If parsing fails, treat the entire string as answer
                return { 
                    answer: data, 
                    sources: [], 
                    confidence: 0.0 
                };
            }
        }

        // Fallback for unexpected formats
        console.warn('Unexpected response format:', typeof data, data);
        return { 
            answer: "Unexpected response format", 
            sources: [], 
            confidence: 0.0 
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            setError('Please provide a query.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            console.log('Sending request with query:', query); // Debug log
            
            const response = await axios.post(
                `${API_BASE}/policy-suggestion/query`,
                { query: query.trim(), context: context.trim() || undefined },
                { headers: { 'Content-Type': 'application/json' } }
            );

            console.log('Full response:', response); // Debug log
            console.log('Response data:', response.data); // Debug log

            // Clean the response
            const data = cleanApiResponse(response.data);

            console.log('Processed data:', data); // Debug log

            setResult({
                answer: data.answer,
                sources: data.sources,
                confidence: data.confidence
            });
        } catch (err) {
            console.error('Full error object:', err); // Debug log
            const errorMessage = err.response?.data?.detail || 
                               err.response?.data?.message || 
                               err.message || 
                               'Error fetching policy advice. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Debug function to log result state
    React.useEffect(() => {
        if (result) {
            console.log('Result state updated:', result);
        }
    }, [result]);

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-5xl mt-22">
                    {/* Header */}
                    <div className="relative">
                        <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg"
                            style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                            Policy Suggestion
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
                        <p className="mb-2">Ask about government policies or regulations for expert advice.</p>
                        <p className="text-sm">Provide a query and optional context for tailored responses.</p>
                    </div>

                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
                                    Query
                                </label>
                                <textarea
                                    id="query"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-24 resize-none"
                                    placeholder='e.g., "What are the latest tax policies in India?"'
                                />
                            </div>
                            <div>
                                <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-1">
                                    Context (Optional)
                                </label>
                                <textarea
                                    id="context"
                                    value={context}
                                    onChange={(e) => setContext(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-16 resize-none"
                                    placeholder='e.g., "I am a small business owner in India"'
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !query.trim()}
                                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !query.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                            >
                                {loading ? 'Fetching...' : 'Get Advice'}
                            </button>
                        </form>

                        {/* Loader */}
                        {loading && (
                            <div className="mt-4 text-center">
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
                                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out" style={{ width: '50%' }}></div>
                                </div>
                                <p className="text-xs text-gray-500">Processing...</p>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="mt-4 p-2 bg-red-50 text-red-700 rounded-lg text-sm">
                                {error}
                                <button onClick={() => setError(null)} className="ml-2 text-red-600 underline text-xs">Try again</button>
                            </div>
                        )}
                    </div>

                    {/* Output Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                        {result ? (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-4">Policy Advice</h2>
                                
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    {/* Answer Section */}
                                    {result.answer && (
                                        <div className="mb-6 p-4 bg-white rounded-lg border-l-4 border-blue-500 shadow-sm">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="font-semibold text-gray-800">Your Policy Summary</h3>
                                                {result.confidence !== undefined && (
                                                    <span className="text-sm text-gray-600 bg-blue-100 px-2 py-1 rounded-full">
                                                        Confidence: {(result.confidence * 100).toFixed(0)}%
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                                                {result.answer}
                                            </div>
                                        </div>
                                    )}

                                    {/* Sources Section */}
                                    {result.sources && result.sources.length > 0 && (
                                        <div className="mt-6">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                                Sources
                                                <span className="ml-2 text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                                                    {result.sources.length}
                                                </span>
                                            </h3>
                                            <div className="space-y-3">
                                                {result.sources.map((source, index) => (
                                                    <div key={index} className="p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <a 
                                                                href={source.url} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                                                            >
                                                                {source.document_title || `Source ${index + 1}`}
                                                            </a>
                                                            {source.relevance_score && (
                                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                                    {Math.round(source.relevance_score * 100)}%
                                                                </span>
                                                            )}
                                                        </div>
                                                        {source.excerpt && (
                                                            <p className="text-gray-600 text-xs mt-1 leading-relaxed line-clamp-3">
                                                                {source.excerpt}
                                                            </p>
                                                        )}
                                                        <a 
                                                            href={source.url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="text-xs text-blue-500 hover:underline block mt-2"
                                                        >
                                                            → Read full source
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : !loading && !error ? (
                            <div className="w-full h-96 flex items-center justify-center text-gray-500 text-lg">
                                Your policy advice will appear here once you submit a query.
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default PolicySuggestion;