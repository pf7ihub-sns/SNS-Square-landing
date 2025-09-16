
import React, { useState } from 'react';
import axios from 'axios';

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
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="max-w-lg w-full p-4">
        <h1 className="text-3xl font-semibold text-white mb-6 text-center border border-gray-200" style={{ backgroundColor: '#1E3A8A', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          Text Evaluation
        </h1>

        {/* Instructions */}
        <div className="mb-6 text-center">
          <p className="text-gray-800 mb-2">Evaluate the quality and topic & Participants & action items & feedback of your text.</p>
          <p className="text-gray-600 text-sm">Enter a summary (e.g., meeting notes) to check accuracy and tone.</p>
        </div>

        {/* Input Section */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <label className="block text-gray-800 font-medium mb-2">
            Enter Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            rows="4"
            placeholder="Type your summary here..."
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            className={`w-full py-1.5 px-3 rounded-md text-white font-medium transition-colors ${loading || !text.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'
              }`}
            style={{ backgroundColor: loading || !text.trim() ? '#9CA3AF' : '#1E3A8A' }}
          >
            {loading ? 'Evaluating...' : 'Evaluate Text'}
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
          <div className="mb-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              Evaluation Results
            </h2>
            <div className="space-y-6">
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
              </div>
              <div className="border-t border-gray-200 pt-4">
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
  );
};

export default Evaluation;