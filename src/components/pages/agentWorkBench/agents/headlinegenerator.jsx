import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

function HeadlineGenerator() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputText.trim()) {
      setError('Please enter some text to generate a headline');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE}/title_generator/generate`, {
        text: inputText
      });

      console.log('API Response:', response.data); // Debug log
      setResult(response.data);
    } catch (err) {
      console.error('Headline generation error:', err);

      if (err.code === 'ECONNREFUSED') {
        setError('Unable to connect to the backend server. Please make sure the server is running on port 8000.');
      } else if (err.response?.status === 500) {
        setError('Server error occurred. Please try again later.');
      } else {
        setError(err.response?.data?.detail || err.message || 'An error occurred while generating the headline');
      }
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
            Headline Generator
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
          <p className="mb-2">Generate compelling headlines from your text content.</p>
          <p className="text-sm">Enter text to create engaging headlines.</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <div className="mb-4">
              <label htmlFor="inputText" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your text
              </label>
              <textarea
                id="inputText"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="E.g., AI transforms the future of defense systems..."
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || !inputText.trim()}
              className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !inputText.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
              style={{ backgroundColor: loading || !inputText.trim() ? '#9CA3AF' : '#1E3A8A' }}
            >
              {loading ? 'Generating...' : 'Generate Headline'}
            </button>
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg shadow-sm border border-gray-200">
                {error}
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            {result && result.headline ? (
              <div className="w-full h-96 overflow-y-auto">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Generated Headlines
                </h2>
                <div className="space-y-4">
                  {typeof result.headline === 'object' && Array.isArray(result.headline) ? (
                    result.headline.map((headline, index) => (
                      <div key={index} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <h3 className="font-bold text-blue-800 mb-2">Headline {index + 1}:</h3>
                        <p className="text-gray-700 text-lg leading-relaxed">{headline}</p>
                      </div>
                    ))
                  ) : typeof result.headline === 'string' ? (
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <h3 className="font-bold text-blue-800 mb-2">Generated Headline:</h3>
                      <p className="text-gray-700 text-lg leading-relaxed">{result.headline}</p>
                    </div>
                  ) : (
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <h3 className="font-bold text-blue-800 mb-2">Generated Headline:</h3>
                      <p className="text-gray-700 text-lg leading-relaxed">Unable to generate headline</p>
                    </div>
                  )}
                </div>
              </div>
            ) : !loading && !error ? (
              <div className="w-full h-96 flex items-center justify-center text-gray-500">
                <p className="text-lg">Your generated headline will appear here</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeadlineGenerator;