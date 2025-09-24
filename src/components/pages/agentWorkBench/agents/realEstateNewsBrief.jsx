
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function RealEstateNewsBrief() {
    const [rawText, setRawText] = useState('');
    const [highlightSnippets, setHighlightSnippets] = useState('');
    const [file, setFile] = useState(null);
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showFullSummary, setShowFullSummary] = useState(false);

    const handleProcess = async (e) => {
        e.preventDefault();
        if (!rawText.trim() && !file) {
            setError('Please provide raw text or upload a file.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            if (rawText.trim()) formData.append('raw_text', rawText);
            if (highlightSnippets.trim()) formData.append('highlight_snippets', highlightSnippets);
            if (file) formData.append('files', file);

            const response = await fetch('http://127.0.0.1:8000/real_estate_news_agent/process/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to process news brief');
            }

            const data = await response.json();
            setSummary(data.summary_text.summary_text);
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
            setRawText('');
            setHighlightSnippets('');
            setFile(null);
        }
    };

    const renderSummary = () => {
        if (!summary || summary.error) return <p className="text-gray-500">No summary available. Generate a brief to see results.</p>;

        // Truncated summary for initial view
        if (!showFullSummary) {
            return (
                <div className="space-y-2 text-gray-700">
                    <p><strong>Title:</strong> {summary.title}</p>
                    <p><strong>Region:</strong> {summary.region || 'N/A'}</p>
                    <div>
                        <p className="font-medium">Key Highlights:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            {summary.residential_market_highlights.slice(0, 2).map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                            {summary.residential_market_highlights.length > 2 && (
                                <li className="text-blue-600 cursor-pointer" onClick={() => setShowFullSummary(true)}>...and {summary.residential_market_highlights.length - 2} more</li>
                            )}
                        </ul>
                    </div>
                    <button
                        onClick={() => setShowFullSummary(true)}
                        className="mt-2 text-blue-700 hover:text-blue-800 font-medium"
                    >
                        Show More
                    </button>
                </div>
            );
        }

        // Full summary with fixed height and scroll
        return (
            <div className="space-y-2 text-gray-700" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <p><strong>Title:</strong> {summary.title}</p>
                <p><strong>Source:</strong> {summary.source || 'N/A'}</p>
                <p><strong>Date:</strong> {summary.date || 'N/A'}</p>
                <p><strong>Region:</strong> {summary.region || 'N/A'}</p>
                <div>
                    <p className="font-medium">Residential Highlights:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        {summary.residential_market_highlights.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="font-medium">Commercial Highlights:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        {summary.commercial_market_highlights.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="font-medium">Regional Trends:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        {summary.regional_trends.map((trend, index) => (
                            <li key={index}>
                                {trend.region}: {trend.residential_trend} | Growth: {trend.growth_rate}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="font-medium">Policy Updates:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        {summary.policy_regulatory_updates.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="font-medium">Investor Insights:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        {summary.investor_consumer_insights.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="font-medium">Risks/Concerns:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        {summary.risks_market_concerns.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="font-medium">Recommended Actions:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        {summary.recommended_actions.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
                <button
                    onClick={() => setShowFullSummary(false)}
                    className="mt-2 text-blue-700 hover:text-blue-800 font-medium"
                >
                    Show Less
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 mt-7" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="relative">
                    <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        Real Estate News Brief
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
                <div className="text-center mb-3 text-gray-700">
                    <p className="mb-2">Summarize real estate news from text or file uploads.</p>
                </div>

                {/* Two-Column Layout: Summary on Left, Input on Right */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                    {/* Input Form (Right) */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <form onSubmit={handleProcess} className="space-y-4">
                            <div>
                                <label className="block text-gray-800 font-medium mb-2">Raw Text</label>
                                <textarea
                                    rows={3}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Real estate trends in Mumbai show 5% growth..."
                                    value={rawText}
                                    onChange={(e) => setRawText(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-800 font-medium mb-2">Highlight Snippets (Optional)</label>
                                <textarea
                                    rows={2}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Mumbai growth, new regulations..."
                                    value={highlightSnippets}
                                    onChange={(e) => setHighlightSnippets(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-800 font-medium mb-2">Upload File (PDF, DOCX, TXT)</label>
                                <input
                                    type="file"
                                    accept=".pdf,.docx,.txt"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || (!rawText.trim() && !file)}
                                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${isLoading || (!rawText.trim() && !file) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                                style={{ backgroundColor: isLoading || (!rawText.trim() && !file) ? '#9CA3AF' : '#1E3A8A' }}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Processing...
                                    </span>
                                ) : 'Generate Brief'}
                            </button>
                        </form>
                        {error && (
                            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md border border-gray-200">
                                {error}
                            </div>
                        )}
                    </div>
                    {/* Summary Output (Left) */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-lg font-medium text-gray-800 mb-4">News Summary</h2>
                        {renderSummary()}
                    </div>
                </div>
            </div>
        </div>
    );
}