import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const Evaluation = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!text.trim()) {
      setError('Please enter text to evaluate');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(
        `${API_BASE}/evaluation-agent/evaluate`,
        { input: text },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || 'Error evaluating text. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="w-full max-w-5xl mt-17">
        {/* Header */}
        <div className="relative">
          <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            Text Evaluation
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
          <p className="mb-2">Evaluate the quality and topic & Participants & action items & feedback of your text.</p>
          <p className="text-sm">Enter a summary (e.g., meeting notes) to check accuracy and tone.</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="mb-6">
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Text
              </label>
              <textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-40 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base bg-gray-50"
                placeholder="Type your summary here..."
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || !text.trim()}
              className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !text.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
              style={{ backgroundColor: loading || !text.trim() ? '#9CA3AF' : '#1E3A8A' }}
            >
              {loading ? 'Evaluating...' : 'Evaluate Text'}
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
                  Evaluation Results
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-md font-medium text-gray-700 mb-2">Accuracy</h3>
                    <p className="text-gray-600 mb-1"><span className="font-bold">Score:</span> {result.accuracy.score} out of 4</p>
                    <ul className="text-gray-600 list-disc list-inside">
                      <li><span className="font-bold">Topic:</span> {result.accuracy.criteria.topic ? 'Detected' : 'Missing'}</li>
                      <li><span className="font-bold">Participants:</span> {result.accuracy.criteria.participants ? 'Detected' : 'Missing'}</li>
                      <li><span className="font-bold">Timeline:</span> {result.accuracy.criteria.timeline ? 'Detected' : 'Missing'}</li>
                      <li><span className="font-bold">Action Items:</span> {result.accuracy.criteria.action_items ? 'Detected' : 'Missing'}</li>
                    </ul>
                    <p className="text-gray-600 mt-1"><span className="font-bold">Feedback:</span> {result.accuracy.feedback}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-md font-medium text-gray-700 mb-2">Tone</h3>
                    <p className="text-gray-600 mb-1"><span className="font-bold">Tone:</span> {result.tone.tone}</p>
                    <p className="text-gray-600"><span className="font-bold">Feedback:</span> {result.tone.feedback}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-4 col-span-1 md:col-span-2">
                    <h3 className="text-md font-medium text-gray-700 mb-2">Summary</h3>
                    <div className="text-gray-600 bg-gray-50 p-2 rounded-md">
                      {typeof result.Summary === 'object' ? (
                        <ul className="list-disc list-inside">
                          {Object.entries(result.Summary).map(([key, value]) => (
                            <li key={key}><span className="font-bold">{key}:</span> {value}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{result.Summary}</p>
                      )}
                    </div>
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

export default Evaluation;