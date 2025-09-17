import { useState } from "react";
import axios from "axios";
import { ArrowLeft } from 'lucide-react';

function EmailThreadSummariser() {
  const [thread, setThread] = useState("");
  const [length, setLength] = useState("short");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/email-thread-summarizer/summarize', {
        emailThread: thread,
        length: length
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while summarizing the thread');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="w-full max-w-5xl mt-11">
        {/* Header */}
        <div className="relative">
          <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            Email Thread Summariser
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
          <p className="mb-2">Summarise email threads with customizable length options.</p>
        </div>

        {/* Main Content */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
          {/* Active Agent Badge */}
          <span className="inline-block px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full mb-6">
            Active Agent
          </span>

          {/* Thread Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste your email thread here
            </label>
            <textarea
              value={thread}
              onChange={(e) => setThread(e.target.value)}
              placeholder="Paste the entire email thread here..."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              required
            />
          </div>

          {/* Summary Length */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Summary Length
            </label>
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="length"
                  value="short"
                  checked={length === "short"}
                  onChange={(e) => setLength(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Short</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="length"
                  value="detailed"
                  checked={length === "detailed"}
                  onChange={(e) => setLength(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Detailed</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
            style={{ backgroundColor: loading ? '#9CA3AF' : '#1E3A8A' }}
          >
            {loading ? 'Summarizing thread...' : 'Summarise Thread'}
          </button>
        </form>

        {/* Result Section */}
        {loading && <p className="text-center mt-4">Summarizing thread...</p>}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {result && (
          <div className="mt-6 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Email Thread Summary</h3>
            </div>
            <div className="px-6 py-4 h-96 overflow-y-auto">
              {result.subject && (
                <div className="mb-4">
                  <h4 className="font-semibold">Subject:</h4>
                  <p>{result.subject}</p>
                </div>
              )}

              {result.participants && (
                <div className="mb-4">
                  <h4 className="font-semibold">Participants:</h4>
                  {Array.isArray(result.participants) ? (
                    <ul className="list-disc list-inside">
                      {result.participants.map((participant, index) => (
                        <li key={index}>{participant}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{result.participants}</p>
                  )}
                </div>
              )}

              {result.timeline && (
                <div className="mb-4">
                  <h4 className="font-semibold">Timeline:</h4>
                  {Array.isArray(result.timeline) ? (
                    <ul className="list-disc list-inside">
                      {result.timeline.map((event, index) => (
                        <li key={index}>{event}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{result.timeline}</p>
                  )}
                </div>
              )}

              {result.keyPoints && (
                <div className="mb-4">
                  <h4 className="font-semibold">Key Points:</h4>
                  {Array.isArray(result.keyPoints) ? (
                    <ul className="list-disc list-inside">
                      {result.keyPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{result.keyPoints}</p>
                  )}
                </div>
              )}

              {result.actionItems && (
                <div className="mb-4">
                  <h4 className="font-semibold">Action Items:</h4>
                  {Array.isArray(result.actionItems) ? (
                    <ul className="list-disc list-inside">
                      {result.actionItems.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{result.actionItems}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmailThreadSummariser;