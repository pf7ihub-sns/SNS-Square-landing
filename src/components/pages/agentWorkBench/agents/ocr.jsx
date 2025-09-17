import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const OCR = () => {
  const [file, setFile] = useState(null);
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
      setError('Please select an image file to process.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${API_BASE}/ocr_agent/ocr`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error processing image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="relative">
          <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            OCR Agent
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
          <p className="mb-2">Extract text from images and generate summaries with keywords.</p>
          <p className="text-sm">Upload an image (e.g., PNG, JPG) for processing.</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="mb-6">
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept="image/png,image/jpeg,image/jpg"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || !file}
              className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
              style={{ backgroundColor: loading || !file ? '#9CA3AF' : '#1E3A8A' }}
            >
              {loading ? 'Processing...' : 'Process Image'}
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
                  OCR Results
                </h2>
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">Extracted Text</h3>
                  <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-2 rounded">{result.text}</p>
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">Summary</h3>
                  <p className="text-gray-600 bg-gray-50 p-2 rounded">{result.summary}</p>
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">Keywords</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {result.keywords.map((keyword, index) => (
                      <li key={index} className="text-sm">{keyword}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OCR;