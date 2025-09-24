import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function DocumentParser() {
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState('pdf');
    const [parsedData, setParsedData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showFullSummary, setShowFullSummary] = useState(false);

    const handleProcess = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please upload a file.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('file_type', fileType);

            const response = await fetch('http://127.0.0.1:8000/document-parser/parse-document', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to parse document');
            }

            const data = await response.json();
            setParsedData(data.parsed_data);
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
            setFile(null);
        }
    };

    const renderSummary = () => {
        if (!parsedData || !parsedData.length) return <p className="text-gray-500">No parsed data available. Upload a file to see results.</p>;

        if (!showFullSummary) {
            return (
                <div className="space-y-2 text-gray-700">
                    <p><strong>Document ID:</strong> {parsedData[0].Document_ID}</p>
                    <p><strong>Title:</strong> {parsedData[0].Title}</p>
                    <button
                        onClick={() => setShowFullSummary(true)}
                        className="mt-2 text-blue-700 hover:text-blue-800 font-medium"
                    >
                        Show More
                    </button>
                </div>
            );
        }

        return (
            <div className="space-y-2 text-gray-700" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {parsedData.map((doc, index) => (
                    <div key={index} className="border-b border-gray-200 pb-2 mb-2 last:border-0 last:pb-0">
                        <p><strong>Document ID:</strong> {doc.Document_ID}</p>
                        <p><strong>Title:</strong> {doc.Title}</p>
                        <p><strong>Author:</strong> {doc.Author}</p>
                        <p><strong>Keywords:</strong> {doc.Keywords.join(', ') || 'None'}</p>
                        <p><strong>Summary:</strong> {doc.Summary}</p>
                    </div>
                ))}
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
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white text-center mb-6 p-3 sm:p-4 rounded-lg mx-8 sm:mx-12 lg:mx-0" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        Document Parser
                    </h1>
                    <button
                        onClick={() => window.location.href = '/media-entertainment'}
                        className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-4 lg:right-4 flex items-center gap-1 sm:gap-2 text-white font-medium hover:text-blue-200 transition-colors text-sm sm:text-base p-2 hover:bg-white-50 hover:bg-opacity-10 rounded-md"
                    >
                        <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                        <span>Back</span>
                    </button>
                </div>

                {/* Instructions */}
                <div className="text-center mb-3 text-gray-700">
                    <p className="mb-2">Parse PDF or Excel files to extract structured fields.</p>
                    <p className="text-sm">Supported formats: PDF, XLS, XLSX.</p>
                </div>

                {/* Two-Column Layout: Summary on Left, Input on Right */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Summary Output (Left) */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-lg font-medium text-gray-800 mb-4">Parsed Summary</h2>
                        {renderSummary()}
                    </div>

                    {/* Input Form (Right) */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <form onSubmit={handleProcess} className="space-y-4">
                            <div>
                                <label className="block text-gray-800 font-medium mb-2">Upload File</label>
                                <input
                                    type="file"
                                    accept=".pdf,.xls,.xlsx"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-800 font-medium mb-2">File Type</label>
                                <select
                                    value={fileType}
                                    onChange={(e) => setFileType(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="pdf">PDF</option>
                                    <option value="excel">Excel</option>
                                </select>
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
                                        Processing...
                                    </span>
                                ) : 'Parse Document'}
                            </button>
                        </form>
                        {error && (
                            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md border border-gray-200">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}