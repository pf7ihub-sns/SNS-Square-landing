import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const TaskBreakDown = () => {
  const [file, setFile] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setBreakdown(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a PDF file.');
      return;
    }

    setLoading(true);
    setError(null);
    setBreakdown(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE}/task_breakdown/run-pdf`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setBreakdown(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error processing PDF. Please try again.');
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
            Task Breakdown Agent
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
        <div className="text-center mb-4 text-gray-700">
          <p className="mb-2">Upload a PDF containing your task/project description to generate a structured breakdown.</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                  Upload PDF
                </label>
                <input
                  type="file"
                  id="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !file}
                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                style={{ backgroundColor: loading || !file ? '#9CA3AF' : '#1E3A8A' }}
              >
                {loading ? 'Processing...' : 'Generate Breakdown'}
              </button>
            </form>
            {loading && (
              <div className="mt-4 text-center">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out" style={{ width: '50%' }}></div>
                </div>
                <p className="text-xs text-gray-500">Processing...</p>
              </div>
            )}
            {error && (
              <div className="mt-4 p-2 bg-red-50 text-red-700 rounded-lg text-sm">
                {error} <button onClick={() => setError(null)} className="ml-2 text-red-600 underline text-xs">Try again</button>
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            {breakdown ? (
              <div className="w-full h-96 overflow-y-auto space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Task Breakdown
                </h2>
                {breakdown.title && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-blue-800 mb-2">Title</h3>
                    <p className="text-gray-700 text-sm">{breakdown.title}</p>
                  </div>
                )}
                {breakdown.summary && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-blue-800 mb-2">Summary</h3>
                    <p className="text-gray-700 text-sm">{breakdown.summary}</p>
                  </div>
                )}
                {breakdown.domain && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-blue-800 mb-2">Domain</h3>
                    <p className="text-gray-700 text-sm">{breakdown.domain}</p>
                  </div>
                )}
                {breakdown.complexity && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-blue-800 mb-2">Complexity</h3>
                    <p className="text-gray-700 text-sm">{breakdown.complexity}</p>
                  </div>
                )}
                {breakdown.estimated_total_time && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-blue-800 mb-2">Estimated Time</h3>
                    <p className="text-gray-700 text-sm">{breakdown.estimated_total_time}</p>
                  </div>
                )}
                {breakdown.risks && breakdown.risks.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-blue-800 mb-2">Risks</h3>
                    <ul className="list-disc list-inside text-gray-700 text-sm">
                      {breakdown.risks.map((risk, index) => (
                        <li key={index}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {breakdown.recommended_resources && breakdown.recommended_resources.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-blue-800 mb-2">Recommended Resources</h3>
                    <ul className="list-disc list-inside text-gray-700 text-sm">
                      {breakdown.recommended_resources.map((res, index) => (
                        <li key={index}>{res}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {breakdown.breakdown && breakdown.breakdown.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-blue-800 mb-2">Subtasks</h3>
                    <ol className="list-decimal list-inside text-gray-700 text-sm space-y-2">
                      {breakdown.breakdown.map((item, index) => (
                        <li key={index} className="ml-4">
                          <strong>{item.subtask}</strong> (Priority: {item.priority}, Time Estimate: {item.time_estimate})
                          {item.dependencies && item.dependencies.length > 0 && (
                            <div className="text-gray-600 text-xs mt-1">
                              Depends on: {item.dependencies.join(', ')}
                            </div>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ) : !loading && !error ? (
              <div className="w-full h-96 flex items-center justify-center text-gray-500">
                Your task breakdown will appear here
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskBreakDown;
