
import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const DuplicateDetector = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a CSV or Excel file');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${API_BASE}/duplicate-expense-detector/detect`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.detail || 'Error processing file. Please try again.'
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Format expense data for better readability
  const formatExpense = (expense) => {
    return Object.entries(expense)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <div className="relative">
          <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            Duplicate Expense Detector
          </h1>
          <button
            onClick={() => window.location.href = '/media-entertainment'}
            className="absolute top-4 right-4 flex items-center gap-2 text-white font-medium hover:text-blue-200 transition-colors p-2 hover:bg-white-50 hover:bg-opacity-10 rounded-md z-10"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        {/* File Upload Section */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Upload CSV or Excel File
          </label>
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !file}
            className={`mt-4 w-full py-2 px-4 rounded-md text-white font-medium ${loading || !file
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors`}
          >
            {loading ? 'Processing...' : 'Analyze File'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-semibold text-gray-800">
                Analysis Summary
              </h2>
              <p className="text-gray-600 mt-2 whitespace-pre-wrap">
                {result.summary || 'Analysis completed successfully.'}
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <p className="font-medium">
                  Total Records: <span className="font-normal">{result.total_records}</span>
                </p>
                <p className="font-medium">
                  Duplicates Found: <span className="font-normal">{result.duplicates_found}</span>
                </p>
              </div>
            </div>

            {/* Duplicates List */}
            {result.duplicates && result.duplicates.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="text-lg font-semibold text-gray-800">
                  Flagged Duplicates
                </h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm text-gray-700">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2 text-left">Duplicate Type</th>
                        <th className="p-2 text-left">Confidence</th>
                        <th className="p-2 text-left">Original Expense</th>
                        <th className="p-2 text-left">Duplicate Expense</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.duplicates.map((dup, index) => (
                        <tr key={index} className="border-b hover:bg-gray-100">
                          <td className="p-2">{dup.duplicate_type || 'N/A'}</td>
                          <td className="p-2">{dup.confidence || 'N/A'}</td>
                          <td className="p-2 break-words max-w-xs">
                            {formatExpense(dup.original_expense || {})}
                          </td>
                          <td className="p-2 break-words max-w-xs">
                            {formatExpense(dup.current || {})}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DuplicateDetector;