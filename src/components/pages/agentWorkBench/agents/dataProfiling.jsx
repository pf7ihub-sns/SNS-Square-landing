import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const DataProfiling = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            setError('Please upload a CSV or Excel file to profile');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(
                `${API_BASE}/data-profiling/profile`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            setResult(response.data);
        } catch (err) {
            setError(
                err.response?.data?.detail || 'Error profiling data. Please try again.'
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
                        Data Profiling
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
                    <p className="mb-2">Upload a CSV or Excel file to analyze its data profile.</p>
                    <p className="text-sm">Supports comprehensive profiling of structure, quality, and patterns.</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <div className="mb-6">
                            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                                Upload File
                            </label>
                            <input
                                id="file"
                                type="file"
                                onChange={handleFileChange}
                                accept=".csv,.xlsx,.xls"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                            />
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !file}
                            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                            style={{ backgroundColor: loading || !file ? '#9CA3AF' : '#1E3A8A' }}
                        >
                            {loading ? 'Profiling...' : 'Profile Data'}
                        </button>
                        {error && (
                            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg shadow-sm border border-gray-200">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Output Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <div className="w-full h-96 overflow-y-auto">
                            {result && (
                                <>
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Profiling Results</h2>
                                    <div className="space-y-6">
                                        <div className="border-t border-gray-200 pt-4">
                                            <h3 className="text-md font-medium text-gray-700 mb-2">File Info</h3>
                                            <p className="text-gray-600"><span className="font-bold">Filename:</span> {result.file_info.filename}</p>
                                            <p className="text-gray-600"><span className="font-bold">Type:</span> {result.file_info.type}</p>
                                            {result.file_info.sheets && (
                                                <p className="text-gray-600"><span className="font-bold">Sheets:</span> {result.file_info.sheets}</p>
                                            )}
                                        </div>
                                        {result.overall_summary && (
                                            <div className="border-t border-gray-200 pt-4">
                                                <h3 className="text-md font-medium text-gray-700 mb-2">Overall Summary</h3>
                                                <p className="text-gray-600"><span className="font-bold">Total Rows:</span> {result.overall_summary.total_rows}</p>
                                                <p className="text-gray-600"><span className="font-bold">Total Columns:</span> {result.overall_summary.total_columns}</p>
                                                <p className="text-gray-600"><span className="font-bold">Average Quality Score:</span> {result.overall_summary.average_quality_score}%</p>
                                                <p className="text-gray-600"><span className="font-bold">Average Completeness:</span> {result.overall_summary.average_completeness}%</p>
                                            </div>
                                        )}
                                        {result.comprehensive_summary && (
                                            <div className="border-t border-gray-200 pt-4">
                                                <h3 className="text-md font-medium text-gray-700 mb-2">Comprehensive Summary</h3>
                                                <p className="text-gray-600"><span className="font-bold">Overall Quality Score:</span> {result.comprehensive_summary.overall_quality_score}%</p>
                                                <p className="text-gray-600"><span className="font-bold">Data Health:</span> {result.comprehensive_summary.data_health}</p>
                                                <p className="text-gray-600"><span className="font-bold">Recommendations:</span> {result.comprehensive_summary.recommendations.join(', ') || 'None'}</p>
                                                <p className="text-gray-600"><span className="font-bold">Key Insights:</span> {result.comprehensive_summary.key_insights.join(', ') || 'None'}</p>
                                            </div>
                                        )}
                                        {result.basic_report && (
                                            <div className="border-t border-gray-200 pt-4">
                                                <h3 className="text-md font-medium text-gray-700 mb-2">Basic Profile</h3>
                                                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                                                    {result.basic_report.map((row, index) => (
                                                        <li key={index} className="text-sm">
                                                            {row['Column Name']}: {Object.entries(row)
                                                                .filter(([key]) => key !== 'Column Name' && row[key] !== 'N/A' && row[key] !== 0)
                                                                .map(([key, value]) => `${key}: ${value}`).join(', ')}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                            {loading && (
                                <div className="text-sm text-gray-600">Profiling...</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataProfiling;