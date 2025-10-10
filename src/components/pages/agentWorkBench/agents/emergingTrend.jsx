
import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft, AlertCircle } from 'lucide-react';

// Error Boundary Component
class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 text-center text-red-600">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold">Something Went Wrong</h2>
                    <p className="text-sm">{this.state.error.message}</p>
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

const EmergingTrend = () => {
    const [request, setRequest] = useState("");
    const [trendData, setTrendData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setRequest(e.target.value);
        setError(null);
        setTrendData(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!request.trim()) {
            setError('Please provide a technology or sector.');
            return;
        }

        setLoading(true);
        setError(null);
        setTrendData(null);

        try {
            const response = await axios.post(`${API_BASE}/agent/emerging-tech-trends`, {
                request: request,
            }, {
                headers: { "Content-Type": "application/json" },
            });
            setTrendData(response.data);
        } catch (err) {
            setError(err.response?.data?.feedback?.[0] || 'Error fetching trends. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="w-full max-w-5xl mt-21">
                    {/* Header */}
                    <div className="relative">
                        <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                            Emerging Tech Trends
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
                    <div className="text-center mb-6 text-gray-700">
                        <p className="mb-2">Explore emerging technology trends for 2025.</p>
                        <p className="text-sm">Enter a technology or sector (e.g., AI, Blockchain) to generate insights, summary, and trend score.</p>
                    </div>

                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="request" className="block text-sm font-medium text-gray-700 mb-1">
                                    Technology or Sector
                                </label>
                                <input
                                    id="request"
                                    name="request"
                                    value={request}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="e.g., AI, Blockchain, Quantum Computing..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !request.trim()}
                                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !request.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                                style={{ backgroundColor: loading || !request.trim() ? '#9CA3AF' : '#1E3A8A' }}
                            >
                                {loading ? 'Fetching...' : 'Get Trends'}
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
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        {trendData ? (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-4">Trend Analysis</h2>
                                {trendData.request && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Request</h3>
                                        <p className="text-gray-700 text-base">{trendData.request}</p>
                                    </div>
                                )}
                                {trendData.summary && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Summary</h3>
                                        <p className="text-gray-700 text-base leading-relaxed">{trendData.summary}</p>
                                    </div>
                                )}
                                {trendData.trend_score !== undefined && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Trend Score</h3>
                                        <p className="text-gray-700 text-base">{trendData.trend_score}/100</p>
                                    </div>
                                )}
                                {trendData.insights && trendData.insights.length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Insights</h3>
                                        <ul className="list-disc list-inside text-gray-700 text-base space-y-3">
                                            {trendData.insights.map((insight, index) => (
                                                <li key={index} className="pl-2">
                                                    <strong className="text-gray-900">{insight.title}</strong>
                                                    <p className="text-gray-600 mt-1">{insight.summary}</p>
                                                    <a href={insight.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-1 block">Read more</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {trendData.feedback && trendData.feedback.length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Feedback</h3>
                                        <ul className="list-disc list-inside text-gray-700 text-base space-y-2">
                                            {trendData.feedback.map((fb, index) => (
                                                <li key={index} className="pl-2">{fb}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : !loading && !error ? (
                            <div className="w-full h-96 flex items-center justify-center text-gray-500 text-lg">
                                Your trend analysis will appear here
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default EmergingTrend;