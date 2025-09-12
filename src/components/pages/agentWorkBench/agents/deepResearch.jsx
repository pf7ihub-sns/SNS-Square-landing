import { useState } from "react";
import axios from "axios";

function DeepResearchAgent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [depth, setDepth] = useState("small");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const formatContent = (content) => {
    // Replace **text** with <strong>text</strong>
    let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Split by double newlines for paragraphs
    return formatted.split('\n\n').map((para, index) => (
      <p key={index} dangerouslySetInnerHTML={{ __html: para.replace(/\n/g, '<br />') }} />
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/research/run', {
        title,
        brief: description || null,
        length: depth
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <header className="w-full bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-700">SNS Square</h1>
          <nav className="flex space-x-6">
            <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
            <a href="/agent" className="text-blue-600 font-semibold">Agent Workbench</a>
            <a href="/usecase" className="text-gray-700 hover:text-blue-600">Use Case</a>
            <a href="/life" className="text-gray-700 hover:text-blue-600">Life at SNS Square</a>
            <a href="/about" className="text-gray-700 hover:text-blue-600">About Us</a>
          </nav>
          <button className="bg-black text-white px-4 py-2 rounded-full">
            Contact Us
          </button>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex justify-center px-4 py-16">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg border border-blue-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-700">
              Deep Research Agent
            </h2>
            <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
              Active Agent
            </span>
          </div>

          {/* Equipment Title */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Research Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Latest advancements in AI"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Equipment Description */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Research Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Detailed analysis of benefits and challenges"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={4}
            />
          </div>

          {/* Research Depth */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Research Depth
            </label>
            <select
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="small">🚀 Small - Quick Overview</option>
              <option value="medium">📘 Medium - Detailed</option>
              <option value="deep">📚 Deep - In-depth</option>
            </select>
            {depth === "small" && (
              <p className="mt-2 text-xs text-gray-500">
                Quick overview (2-3 minutes read)
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition"
          >
            Run Deep Research
          </button>
        </form>
      </main>

      {/* Result Section */}
      {loading && <p className="text-center mt-4">Researching...</p>}
      {error && <p className="text-center mt-4 text-red-500">{error}</p>}
      {result && (
        <div className="mt-8 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">{result.title}</h3>
          <div className="mb-4">
            <h4 className="font-semibold">Content:</h4>
            <div>{formatContent(result.content)}</div>
          </div>
          <div>
            <h4 className="font-semibold">Sources:</h4>
            <ul>
              {result.sources.map((source, index) => (
                <li key={index}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {source.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeepResearchAgent;
