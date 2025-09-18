
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function RetailEntityExtractor() {
    const [rawText, setRawText] = useState('');
    const [file, setFile] = useState(null);
    const [extractionResults, setExtractionResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showFullSummary, setShowFullSummary] = useState(false);

    const handleProcess = async (e) => {
        e.preventDefault();
        if (!rawText.trim() && !file) {
            setError('Please provide text or upload a file.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            let response;
            if (rawText.trim() && !file) {
                response = await fetch('http://127.0.0.1:8000/retail-entity-extractor/extract/retail/json', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ raw_text: rawText, confidence_threshold: 0.7 }),
                });
            } else if (file) {
                const formData = new FormData();
                formData.append('file', file);
                response = await fetch('http://127.0.0.1:8000/retail-entity-extractor/extract/retail', {
                    method: 'POST',
                    body: formData,
                });
            }

            if (!response.ok) {
                throw new Error('Failed to process extraction');
            }

            const data = await response.json();
            setExtractionResults(data);
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
            setRawText('');
            setFile(null);
        }
    };

    const renderSummary = () => {
        if (!extractionResults) return <p className="text-gray-500">No extraction results available. Submit text or a file to see results.</p>;

        if (!showFullSummary) {
            const firstResult = extractionResults.results?.[0] || extractionResults;
            return (
                <div className="space-y-2 text-gray-700">
                    <p><strong>Status:</strong> {extractionResults.status}</p>
                    {firstResult.entities?.length > 0 && (
                        <div>
                            <p><strong>First Entity:</strong> {firstResult.entities[0].entity_value} ({firstResult.entities[0].entity_type})</p>
                            <button
                                onClick={() => setShowFullSummary(true)}
                                className="mt-2 text-blue-700 hover:text-blue-800 font-medium"
                            >
                                Show More
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="space-y-2 text-gray-700" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <p><strong>Status:</strong> {extractionResults.status}</p>
                <p><strong>Processing Type:</strong> {extractionResults.processing_type}</p>
                {extractionResults.results ? (
                    extractionResults.results.map((result, index) => (
                        <div key={index} className="border-b border-gray-200 pb-2 mb-2 last:border-0 last:pb-0">
                            <p><strong>{result.filename || `Record ${result.record_id}` || 'Document'}:</strong></p>
                            <p><strong>Is Retail:</strong> {result.is_retail_document ? 'Yes' : 'No'}</p>
                            {result.entities.length > 0 && (
                                <div>
                                    <p><strong>Entities:</strong></p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        {result.entities.map((entity, i) => (
                                            <li key={i}>
                                                {entity.entity_value} ({entity.entity_type}, Confidence: {entity.confidence})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {result.needs_review.length > 0 && (
                                <div>
                                    <p><strong>Needs Review:</strong></p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        {result.needs_review.map((review, i) => (
                                            <li key={i}>{review.text} (Reason: {review.reason})</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <>
                        {extractionResults.entities.length > 0 && (
                            <div>
                                <p><strong>Entities:</strong></p>
                                <ul className="list-disc pl-5 space-y-1">
                                    {extractionResults.entities.map((entity, i) => (
                                        <li key={i}>
                                            {entity.entity_value} ({entity.entity_type}, Confidence: {entity.confidence})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {extractionResults.needs_review.length > 0 && (
                            <div>
                                <p><strong>Needs Review:</strong></p>
                                <ul className="list-disc pl-5 space-y-1">
                                    {extractionResults.needs_review.map((review, i) => (
                                        <li key={i}>{review.text} (Reason: {review.reason})</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {extractionResults.summary && (
                            <div>
                                <p><strong>Summary:</strong></p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Total Entities: {extractionResults.summary.total_entities}</li>
                                    <li>High Confidence Entities: {extractionResults.summary.high_confidence_entities}</li>
                                    <li>Low Confidence Entities: {extractionResults.summary.low_confidence_entities}</li>
                                    <li>Entities Needing Review: {extractionResults.summary.entities_needing_review}</li>
                                    <li>Entities by Type: {Object.entries(extractionResults.summary.entities_by_type).map(([type, count]) => `${type}: ${count}`).join(', ')}</li>
                                    <li>Average Confidence: {extractionResults.summary.confidence_stats.average}</li>
                                    <li>Minimum Confidence: {extractionResults.summary.confidence_stats.min}</li>
                                    <li>Maximum Confidence: {extractionResults.summary.confidence_stats.max}</li>
                                </ul>
                            </div>
                        )}

                    </>
                )}
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
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="relative">
                    <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        Retail Entity Extractor
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
                    <p className="mb-2">Extract retail entities (products, prices, categories) from text or files.</p>
                    <p className="text-sm">Supported formats: TXT, DOCX, PDF, CSV, XLSX, ZIP.</p>
                </div>

                {/* Two-Column Layout: Summary on Left, Input on Right */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                    {/* Input Form (Right) */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <form onSubmit={handleProcess} className="space-y-4">
                            <div>
                                <label className="block text-gray-800 font-medium mb-2">Raw Text</label>
                                <textarea
                                    rows={4}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Product: Skullcandy Headphones, Price: $99.99, Category: Electronics"
                                    value={rawText}
                                    onChange={(e) => setRawText(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-800 font-medium mb-2">Upload File (TXT, DOCX, PDF, CSV, XLSX, ZIP)</label>
                                <input
                                    type="file"
                                    accept=".txt,.docx,.pdf,.csv,.xlsx,.xls,.zip"
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
                                ) : 'Extract Entities'}
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
                        <h2 className="text-lg font-medium text-gray-800 mb-4">Extraction Summary</h2>
                        {renderSummary()}
                    </div>
                </div>
            </div>
        </div>
    );
}