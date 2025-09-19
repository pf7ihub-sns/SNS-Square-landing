import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function SecurityRisk() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please upload a document.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('http://127.0.0.1:8000/security-risk-analyzer/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 500 && errorData.detail?.includes('ResourceExhausted')) {
                    throw new Error('API quota exceeded. Please check your Gemini API usage limits and try again later.');
                }
                throw new Error('Failed to analyze document');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
            setFile(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="w-full max-w-2xl mt-25">
                {/* Header */}
                <div className="relative mb-6">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white text-center py-3 px-4 sm:py-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        Security Risk Analyzer
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
                <div className="text-center mb-3 text-gray-700">
                    <p className="mb-2">Analyze documents for security risks using local checks and AI scoring.</p>
                    <p className="text-sm">Upload PDF, DOCX, or TXT files for evaluation.</p>
                </div>

                {/* Input Form */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
                    <form onSubmit={handleAnalyze} className="space-y-4">
                        <div>
                            <label className="block text-gray-800 font-medium mb-2">Upload Document</label>
                            <input
                                type="file"
                                accept=".pdf,.docx,.txt"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !file}
                            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${isLoading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                            style={{ backgroundColor: isLoading || !file ? '#9CA3AF' : '#1E3A8A' }}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Analyzing...
                                </span>
                            ) : 'Analyze Document'}
                        </button>
                    </form>
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md border border-gray-200">
                            {error}
                        </div>
                    )}
                </div>

                {/* Analysis Output */}
                {result && (
                    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <h2 className="text-lg font-medium text-gray-800 mb-4 border-b border-gray-200 pb-2">Security Analysis</h2>
                        <div className="space-y-4 text-gray-700">
                            {result.document_excerpt && (
                                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                    <p className="font-medium text-blue-800 mb-2">Document Excerpt</p>
                                    <pre className="text-sm text-gray-600 whitespace-pre-wrap">{result.document_excerpt}</pre>
                                </div>
                            )}
                            {result.security_risks && result.security_risks.length > 0 ? (
                                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                    <p className="font-medium text-blue-800 mb-2">Security Risks</p>
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                                        {result.security_risks.map((risk, index) => (
                                            <li key={index}>{risk}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                    <p className="font-medium text-blue-800 mb-2">Security Risks</p>
                                    <p className="text-sm text-gray-600">No Risks Found</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}