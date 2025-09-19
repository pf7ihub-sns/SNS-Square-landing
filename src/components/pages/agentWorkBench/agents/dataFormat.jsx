import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const DataFormat = () => {
    const [file, setFile] = useState(null);
    const [targetFormat, setTargetFormat] = useState('YYYY-MM-DD');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a CSV file to process.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('target_format', targetFormat);

        try {
            const response = await axios.post(
                `${API_BASE}/date-format-conversion/convert-csv`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error converting dates. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const downloadCSV = () => {
        if (result && result.converted_csv) {
            const byteCharacters = atob(result.converted_csv);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${result.file_info.filename.split('.')[0]}_converted.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="w-full max-w-5xl">
                {/* Header */}
                <div className="relative">
                    <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        Date Format Converter
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
                    <p className="mb-2">Convert date formats in a CSV file with a single 'date_of_birth' column.</p>
                    <p className="text-sm">Upload a CSV and select the target date format.</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <div className="mb-6">
                            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                                Upload CSV
                            </label>
                            <input
                                id="file"
                                type="file"
                                onChange={handleFileChange}
                                accept=".csv"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="targetFormat" className="block text-sm font-medium text-gray-700 mb-2">
                                Target Format
                            </label>
                            <select
                                id="targetFormat"
                                value={targetFormat}
                                onChange={(e) => setTargetFormat(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="YYYY/MM/DD">YYYY/MM/DD</option>
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            </select>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !file}
                            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                            style={{ backgroundColor: loading || !file ? '#9CA3AF' : '#1E3A8A' }}
                        >
                            {loading ? 'Converting...' : 'Convert Dates'}
                        </button>
                        {error && (
                            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg shadow-sm border border-gray-200">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Output Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        {result && (
                            <div className="w-full h-96 overflow-y-auto space-y-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                                    Conversion Results
                                </h2>
                                <div>
                                    <h3 className="text-md font-medium text-gray-700 mb-2">File Info</h3>
                                    <p className="text-gray-600"><span className="font-bold">Filename:</span> {result.file_info.filename}</p>
                                    <p className="text-gray-600"><span className="font-bold">Rows Processed:</span> {result.file_info.rows_processed}</p>
                                    <p className="text-gray-600"><span className="font-bold">Date Columns:</span> {result.file_info.date_columns.join(', ') || 'None'}</p>
                                </div>
                                <div>
                                    <h3 className="text-md font-medium text-gray-700 mb-2">Converted Data</h3>
                                    <table className="w-full text-sm text-left text-gray-700 border-collapse">
                                        <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-600">
                                            <tr>
                                                <th className="px-4 py-2 border-b">Original Date</th>
                                                <th className="px-4 py-2 border-b">Converted Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.converted_data.map((row, index) => (
                                                <tr key={index} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-2">{row.original_date}</td>
                                                    <td className="px-4 py-2">{row.date_of_birth}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {result.invalid_dates.length > 0 && (
                                    <div>
                                        <h3 className="text-md font-medium text-gray-700 mb-2">Invalid Dates</h3>
                                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                                            {result.invalid_dates.map((item, index) => (
                                                <li key={index} className="text-sm">
                                                    Row {item.row}: {item.date} (Error: {item.error})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div>
                                    <button
                                        onClick={downloadCSV}
                                        disabled={!result.converted_csv}
                                        className={`mt-4 py-2 px-4 rounded-md text-white font-medium transition-colors ${!result.converted_csv ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                                        style={{ backgroundColor: !result.converted_csv ? '#9CA3AF' : '#16A34A' }}
                                    >
                                        Download Converted CSV
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataFormat;