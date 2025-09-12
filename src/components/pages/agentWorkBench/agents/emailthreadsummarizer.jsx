import { useState } from "react";

function EmailThreadSummariser() {
  const [thread, setThread] = useState("");
  const [length, setLength] = useState("short");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ thread, length });
    // Add API call here
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="w-full bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-700">SNS Square</h1>
          <nav className="flex space-x-6">
            <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
            <a href="/agent" className="text-gray-700 hover:text-blue-600">Agent Workbench</a>
            <a href="/usecase" className="text-gray-700 hover:text-blue-600">Use Case</a>
            <a href="/life" className="text-gray-700 hover:text-blue-600">Life at SNS Square</a>
            <a href="/about" className="text-gray-700 hover:text-blue-600">About Us</a>
          </nav>
          <button className="bg-black text-white px-4 py-2 rounded-full">
            Contact Us
          </button>
        </div>
      </header>

      {/* Main Card */}
      <main className="flex justify-center px-4 py-16">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg border border-blue-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-700">
              Email Thread Summariser
            </h2>
            <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
              Active Agent
            </span>
          </div>

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
              className="w-full px-4 py-3 border rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition"
          >
            Summarise Thread
          </button>
        </form>
      </main>
    </div>
  );
}

export default EmailThreadSummariser;