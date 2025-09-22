import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const PromptOptimizer = () => {
    const [formData, setFormData] = useState({
        prompt: '',
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError(null);
        setResult(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.prompt.trim()) {
            setError('Please enter a prompt to optimize.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post(
                `${API_BASE}/prompt-optimizer/optimize`,
                { prompt: formData.prompt },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            setResult(response.data);
        } catch (err) {
            setError(
                err.response?.data?.detail || 'Error optimizing prompt. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="w-full max-w-5xl mt-18">
                {/* Header */}
                <div className="relative mb-6">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white text-center py-3 px-4 sm:py-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        Prompt Optimizer
                    </h1>
                    <button
                        onClick={() => window.location.href = '/media-entertainment'}
                        className="absolute top-3 sm:top-4 right-2 sm:right-4 flex items-center gap-1 sm:gap-2 text-white font-medium hover:text-blue-200 transition-colors p-2 hover:bg-white-50 hover:bg-opacity-10 rounded-md z-10 text-sm sm:text-base"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Back</span>
                    </button>
                </div>

                {/* Instructions */}
                <div className="text-center mb-4 text-gray-700">
                    <p className="mb-2">Optimize your prompt for better clarity and effectiveness.</p>
                    <p className="text-sm">Enter a prompt to receive optimized versions and suggestions.</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                                    Enter Prompt
                                </label>
                                <textarea
                                    id="prompt"
                                    name="prompt"
                                    value={formData.prompt}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y h-32 text-sm"
                                    placeholder="Type your prompt here..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !formData.prompt.trim()}
                                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !formData.prompt.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                                style={{ backgroundColor: loading || !formData.prompt.trim() ? '#9CA3AF' : '#1E3A8A' }}
                            >
                                {loading ? 'Optimizing...' : 'Optimize Prompt'}
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
                        {result && (
                            <div className="w-full h-96 overflow-y-auto space-y-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                                    Optimization Results
                                </h2>
                                {result.original_prompt && (
                                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Original Prompt</h3>
                                        <p className="text-gray-700 text-sm">{result.original_prompt}</p>
                                    </div>
                                )}
                                {result.optimized_prompts && result.optimized_prompts.length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                        <h3 className="text-md font-medium text-blue-800 mb-3">Optimized Prompts</h3>
                                        <div className="space-y-4">
                                            {result.optimized_prompts.map((prompt, index) => (
                                                <div key={index} className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                                                    <p className="text-gray-700 text-sm font-medium mb-1">Option {index + 1}</p>
                                                    <p className="text-gray-600 text-sm">{prompt}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {result.suggestions && result.suggestions.length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                        <h3 className="text-md font-medium text-blue-800 mb-3">Suggestions for Future Prompts</h3>
                                        <ul className="list-disc list-inside text-gray-700 text-sm space-y-2">
                                            {result.suggestions.map((suggestion, index) => (
                                                <li key={index}>{suggestion}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                        {!loading && !error && !result && (
                            <div className="w-full h-96 flex items-center justify-center text-gray-500">
                                Your optimization results will appear here
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromptOptimizer;