import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const PromptOptimizer = () => {
    const [formData, setFormData] = useState({
        text: '',
        n_options: 3,
        optimization_type: 'comprehensive',
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
        if (!formData.text.trim()) {
            setError('Please enter a prompt to optimize.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post(
                `${API_BASE}/prompt-optimizer/optimize`,
                formData,
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
                <div className="relative">
                    <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        Prompt Optimizer
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
                    <p className="mb-2">Optimize your prompt for better clarity and effectiveness.</p>
                    <p className="text-sm">Enter a prompt and select an optimization type to receive suggestions.</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                                    Enter Prompt
                                </label>
                                <textarea
                                    id="text"
                                    name="text"
                                    value={formData.text}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y h-32 text-sm"
                                    placeholder="Type your prompt here..."
                                />
                            </div>
                            <div>
                                <label htmlFor="optimization_type" className="block text-sm font-medium text-gray-700 mb-1">
                                    Optimization Type
                                </label>
                                <select
                                    id="optimization_type"
                                    name="optimization_type"
                                    value={formData.optimization_type}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="comprehensive">Comprehensive</option>
                                    <option value="clarity">Clarity</option>
                                    <option value="formatting">Formatting</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !formData.text.trim()}
                                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !formData.text.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                                style={{ backgroundColor: loading || !formData.text.trim() ? '#9CA3AF' : '#1E3A8A' }}
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
                                {result.prompt_score !== undefined && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Prompt Score</h3>
                                        <p className="text-gray-700 text-sm">Score: {result.prompt_score} out of 10</p>
                                    </div>
                                )}
                                {result.optimized_prompts && result.optimized_prompts.length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Optimized Prompts</h3>
                                        <ol className="list-decimal list-inside text-gray-700 text-sm space-y-2">
                                            {result.optimized_prompts.map((prompt, index) => (
                                                <li key={index}>{prompt}</li>
                                            ))}
                                        </ol>
                                    </div>
                                )}
                                {result.analysis && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Analysis</h3>
                                        <p className="text-gray-700 text-sm"><strong>Issues:</strong> {result.analysis.original_issues.join(', ')}</p>
                                        <p className="text-gray-700 text-sm"><strong>Strategy:</strong> {result.analysis.improvement_strategy}</p>
                                        <p className="text-gray-700 text-sm"><strong>Confidence:</strong> {result.analysis.confidence_score}</p>
                                    </div>
                                )}
                                {result.recommendations && result.recommendations.length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Recommendations</h3>
                                        <ul className="list-disc list-inside text-gray-700 text-sm space-y-2">
                                            {result.recommendations.map((rec, index) => (
                                                <li key={index}>{rec}</li>
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