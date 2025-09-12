import { useState } from "react";

function DefenseEquipmentClassifier() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [depth, setDepth] = useState("small");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, description, depth });
    // Add API call here
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
              Defense Equipment Classifier
            </h2>
            <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
              Active Agent
            </span>
          </div>

          {/* Equipment Title */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Defense Equipment Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Impact of radar system on battlefield"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Equipment Description */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Defense Equipment Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Effects on communication, detection range, and mobility"
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
              <option value="large">📚 Large - In-depth</option>
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
            Classify Equipment
          </button>
        </form>
      </main>
    </div>
  );
}

export default DefenseEquipmentClassifier;
