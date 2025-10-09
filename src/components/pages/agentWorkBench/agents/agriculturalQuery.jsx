import React, { useState } from "react";

function AgriculturalQueryAgent() {
  const [textQuery, setTextQuery] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textQuery.trim()) {
      alert("Please enter a query first!");
      return;
    }
    console.log("Text query submitted:", textQuery);
    // Add API call for text classification
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a file first!");
      return;
    }
    console.log("File uploaded:", file.name);
    // Add API call for file classification
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 py-12 font-sans pt-44">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Agricultural Query Agent
        </h1>
        <p className="text-gray-600">
          Classify agricultural queries by category, urgency, routing and keywords
        </p>
      </div>

      {/* Two Section Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Left Card: Text Classification */}
        <form
          onSubmit={handleTextSubmit}
          className="bg-gradient-to-b from-blue-50 to-blue-200 rounded-2xl shadow-lg border border-gray-200 p-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Classify from Text
          </h2>
          <p className="text-sm text-gray-600 mb-4">Enter one query per line.</p>
          <textarea
            value={textQuery}
            onChange={(e) => setTextQuery(e.target.value)}
            className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white"
            placeholder={`Water supply stopped in my field
Wheat crop showing pest infection
Market price for tomatoes is low`}
          />
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-full shadow-md transition"
          >
            Classify Text
          </button>
        </form>

        {/* Right Card: File Upload Classification */}
        <form
          onSubmit={handleFileSubmit}
          className="bg-gradient-to-b from-blue-50 to-blue-200 rounded-2xl shadow-lg border border-gray-200 p-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Classify from File
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Upload CSV, Excel (.xlsx/.xls), JSON, or TXT
          </p>

          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <label
              htmlFor="fileInput"
              className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-lg py-8 cursor-pointer hover:bg-blue-50 transition"
            >
              <span className="text-gray-600">
                {file ? (
                  <span className="font-medium">{file.name}</span>
                ) : (
                  <>
                    Drop file or{" "}
                    <span className="text-blue-600 font-medium">Browse</span>
                  </>
                )}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                Format: CSV, Excel, JSON, TXT — Max file size: 25 MB
              </span>
              <input
                id="fileInput"
                type="file"
                accept=".csv,.xlsx,.xls,.json,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-full shadow-md transition"
          >
            Upload & Classify
          </button>
        </form>
      </div>
    </div>
  );
}

export default AgriculturalQueryAgent;
