
import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const ImgtoPdf = () => {
    const [files, setFiles] = useState([]);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setFiles(Array.from(event.target.files));
        setResult(null);
        setError(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!files.length) {
            setError('Please select at least one image file');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        files.forEach((file) => formData.append('file', file));

        try {
            const response = await axios.post(
                `${API_BASE}/image-to-pdf/convert-images-to-pdf`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    responseType: 'blob', // Handle PDF as binary data
                }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            setResult(url);
            setError(null);
        } catch (err) {
            setError(
                err.response?.data?.detail || 'Error converting images to PDF. Please try again.'
            );
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (result) {
            const link = document.createElement('a');
            link.href = result;
            link.download = 'output.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(result);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="max-w-xl w-full p-4">
                <div className="relative">
                    <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        Image to PDF Converter
                    </h1>
                    <button
                        onClick={() => window.location.href = '/media-entertainment'}
                        className="absolute top-4 right-4 flex items-center gap-2 text-white font-medium hover:text-blue-200 transition-colors p-2 hover:bg-white-50 hover:bg-opacity-10 rounded-md z-10"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>
                </div>


                {/* Welcome and Instructions */}
                <div className="mb-6 text-center">
                    <p className="text-gray-800 mb-2">Convert your images to a professional PDF.</p>
                    <p className="text-gray-600 text-sm">Supported formats: .jpg, .png. Upload multiple images for a multi-page PDF.</p>
                </div>

                {/* File Upload Section */}
                <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <label className="block text-gray-800 font-medium mb-2">
                        Select Image Files
                    </label>
                    <input
                        type="file"
                        accept="image/jpeg,image/png"
                        multiple
                        onChange={handleFileChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !files.length}
                        className={`w-full py-1.5 px-3 rounded-md text-white font-medium transition-colors ${loading || !files.length ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'
                            }`}
                        style={{ backgroundColor: loading || !files.length ? '#9CA3AF' : '#1E3A8A' }}
                    >
                        {loading ? 'Converting...' : 'Convert to PDF'}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg shadow-sm border border-gray-200">
                        {error}
                    </div>
                )}

                {/* Results Section */}
                {result && (
                    <div className="mb-6 bg-white p-4 rounded-lg shadow-sm text-center border border-gray-200">
                        <h2 className="text-lg font-medium text-gray-800 mb-2">
                            Conversion Complete
                        </h2>
                        <p className="text-gray-600 mb-2">PDF generated from {files.length} image(s).</p>
                        <button
                            onClick={handleDownload}
                            className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-1.5 px-3 rounded-md transition-colors"
                            style={{ backgroundColor: '#1E3A8A' }}
                        >
                            Download PDF
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImgtoPdf;