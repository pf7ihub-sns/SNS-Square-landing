import { useState } from "react";
import axios from "axios";
import { ArrowLeft } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const SchemaGenerator = () => {
    const [file, setFile] = useState(null);
    const [platform, setPlatform] = useState("Databricks");
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            setError('Please upload a file.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('platform', platform);

            const response = await axios.post(
                `${API_BASE}/schema-generation/generate-schema`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            setResult(response.data);
        } catch (err) {
            setError(
                err.response?.data?.detail || 'Error generating schema. Please try again.'
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
                        Schema Generator
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
                    <p className="mb-2">Generate platform-specific SQL schemas from CSV or Excel files.</p>
                    <p className="text-sm">Upload a file and select a platform to generate the schema.</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <div className="mb-6">
                            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                                Upload File (CSV or Excel)
                            </label>
                            <input
                                id="file"
                                type="file"
                                onChange={handleFileChange}
                                accept=".csv,.xls,.xlsx"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                            />
                            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-2">
                                Platform
                            </label>
                            <select
                                id="platform"
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Databricks">Databricks</option>
                                <option value="Snowflake">Snowflake</option>
                                <option value="Teradata">Teradata</option>
                                <option value="Netezza">Netezza</option>
                            </select>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !file}
                            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                            style={{ backgroundColor: loading || !file ? '#9CA3AF' : '#1E3A8A' }}
                        >
                            {loading ? 'Generating...' : 'Generate Schema'}
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
                            <div className="w-full h-96 overflow-y-auto">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                                    Schema Generation Results
                                </h2>
                                <div className="space-y-6">
                                    <div className="border-t border-gray-200 pt-4">
                                        <h3 className="text-md font-medium text-gray-700 mb-2">File Info</h3>
                                        <p className="text-gray-600"><span className="font-bold">Filename:</span> {result.file_info.filename}</p>
                                        <p className="text-gray-600"><span className="font-bold">Type:</span> {result.file_info.type}</p>
                                        <p className="text-gray-600"><span className="font-bold">Rows Analyzed:</span> {result.file_info.rows_analyzed}</p>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4">
                                        <h3 className="text-md font-medium text-gray-700 mb-2">Column Info</h3>
                                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                                            {Object.entries(result.column_info).map(([column, type]) => (
                                                <li key={column}>{column}: {type}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4">
                                        <h3 className="text-md font-medium text-gray-700 mb-2">Preview</h3>
                                        <table className="w-full text-sm text-left text-gray-700 border-collapse">
                                            <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-600">
                                                <tr>
                                                    {result.preview[0] && Object.keys(result.preview[0]).map((key) => (
                                                        <th key={key} className="px-4 py-2 border-b"> {key}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {result.preview.map((row, index) => (
                                                    <tr key={index} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                                        {Object.values(row).map((value, i) => (
                                                            <td key={i} className="px-4 py-2">{value}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4">
                                        <h3 className="text-md font-medium text-gray-700 mb-2">Schema</h3>
                                        <pre className="bg-gray-100 p-4 rounded-md text-sm text-gray-800 overflow-x-auto">{result.schema}</pre>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchemaGenerator;