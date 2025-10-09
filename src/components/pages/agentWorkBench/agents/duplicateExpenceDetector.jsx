import React, { useState } from "react";

const DuplicateExpenseDetector = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a file first!");
      return;
    }
    console.log("File uploaded:", file.name);
    // Add API call logic here
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center px-6 py-12 font-sans">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-gradient-to-b from-blue-50 to-blue-200 rounded-2xl shadow-lg border border-gray-200 p-8"
      >
        {/* Header block with explicit spacing under it (50px) */}
        <div className="text-center" style={{ marginBottom: 50 }}>
          <h2 className="text-2xl font-semibold text-black">Classify from File</h2>
          <p className="text-sm text-black/90 mt-3">
            Upload PDF, DOCX, TXT, CSV, Excel (.xlsx/.xls), or JSON
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="text-md font-semibold text-gray-700 mb-2">
            Upload Projects
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Please upload files in pdf, docx, doc format and make sure the file
            size is under 25 MB.
          </p>

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
              Format: pdf, docx, doc & Max file size: 25 MB
            </span>
            <input
              id="fileInput"
              type="file"
              accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-4 mb-4">
          <button
            type="button"
            onClick={() => setFile(null)}
            className="w-1/2 bg-white border border-gray-300 text-gray-600 font-medium py-2 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg shadow-md transition"
          >
            Done
          </button>
        </div>

        {/* Bottom Button */}
        <button
          type="submit"
          className="w-full bg-gray-300 text-gray-600 font-medium py-3 rounded-lg cursor-not-allowed"
          disabled
        >
          Upload & Classify
        </button>
      </form>
    </div>
  );
};

export default DuplicateExpenseDetector;