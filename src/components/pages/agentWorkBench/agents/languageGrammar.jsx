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

const LanguageGrammar = () => {
    const [message, setMessage] = useState('');
    const [mode, setMode] = useState('correction');
    const [tone, setTone] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) {
            setError('Please provide a message to analyze.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const payload = { message: message.trim(), mode };
            if (mode === 'tone' && !tone.trim()) {
                setError('Please provide a tone when mode is set to "tone".');
                setLoading(false);
                return;
            }
            if (mode === 'tone') {
                payload.tone = tone.trim();
            }

            const response = await axios.post(`${API_BASE}/language/analyze`, payload, {
                headers: { 'Content-Type': 'application/json' },
            });
            setResult(response.data.response);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error processing text. Please try again.');
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
                            Language & Grammar
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
                        <p className="mb-2">Analyze or transform your text with grammar corrections or tone adjustments.</p>
                        <p className="text-sm">Select a mode and provide the text to process.</p>
                    </div>

                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mode
                                </label>
                                <select
                                    id="mode"
                                    value={mode}
                                    onChange={(e) => setMode(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="correction">Correction</option>
                                    <option value="explanation">Explanation</option>
                                    <option value="tone">Tone</option>
                                </select>
                            </div>
                            {mode === 'tone' && (
                                <div>
                                    <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Tone (e.g., formal, casual)
                                    </label>
                                    <input
                                        id="tone"
                                        type="text"
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        placeholder="e.g., formal"
                                    />
                                </div>
                            )}
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                    Text
                                </label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-24 resize-none"
                                    placeholder='e.g., "Can u send me the file?"'
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !message.trim() || (mode === 'tone' && !tone.trim())}
                                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !message.trim() || (mode === 'tone' && !tone.trim()) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                                style={{ backgroundColor: loading || !message.trim() || (mode === 'tone' && !tone.trim()) ? '#9CA3AF' : '#1E3A8A' }}
                            >
                                {loading ? 'Processing...' : 'Analyze'}
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
                        {result ? (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-4">Result</h2>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700 text-base leading-relaxed">{result}</p>
                                </div>
                            </div>
                        ) : !loading && !error ? (
                            <div className="w-full h-96 flex items-center justify-center text-gray-500 text-lg">
                                Your analysis result will appear here
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default LanguageGrammar;