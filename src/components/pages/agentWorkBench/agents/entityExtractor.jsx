import { useState } from "react";

export default function EntityExtractor() {
  const [rawText, setRawText] = useState("");
  const [file, setFile] = useState(null);
  const [entities, setEntities] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    if (file) formData.append("file", file);
    if (rawText.trim()) formData.append("raw_text", rawText);
    formData.append("entity_types", "Person,Date,Organization,Location,Money");
    formData.append("confidence_threshold", "0.7");
    formData.append("export_format", "json");

    try {
      const response = await fetch("http://localhost:8000/entity_extractor/extract", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setEntities(data.entities || []);
      setSummary(data);
    } catch (err) {
      console.error("Error extracting entities:", err);
    }
    setLoading(false);
  };

  const exportData = (format) => {
    let content;
    const header = "Entity Type,Entity Value,Confidence\n";
    const rows = entities
      .map(
        (e) =>
          `${e.entity_type},${e.entity_value},${(e.confidence * 100).toFixed(1)}%`
      )
      .join("\n");

    if (format === "csv") {
      content = header + rows;
      downloadFile(content, "entities.csv", "text/csv");
    } else if (format === "json") {
      content = JSON.stringify(entities, null, 2);
      downloadFile(content, "entities.json", "application/json");
    } else if (format === "excel") {
      content = header + rows;
      downloadFile(content, "entities.xlsx", "application/vnd.ms-excel");
    }
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  const filteredEntities =
    filter === "all" ? entities : entities.filter((e) => e.entity_type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F6FE] to-[#E9EEFC] p-6 pt-44 font-sans">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#064EE3] to-[#3D76EC] bg-clip-text text-transparent">
          Entity Extraction Tool
        </h1>

        {/* Input Section */}
        <textarea
          className="w-full border border-gray-300 rounded-2xl p-4 mb-4 focus:ring-2 focus:ring-[#3D76EC] focus:outline-none"
          rows={4}
          placeholder="Enter your text here..."
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
        />
        <div className="mb-4">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center border-2 border-dashed border-[#3D76EC] rounded-2xl p-6 cursor-pointer hover:border-[#064EE3] transition"
          >
            <svg
              className="w-10 h-10 text-[#3D76EC] mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V8a4 4 0 018 0v8m-4 4v-4m0 0H7m4 0h4"
              ></path>
            </svg>
            <span className="text-[#064EE3] font-semibold">
              Click to upload or drag & drop
            </span>
            <span className="text-gray-500 text-sm mt-1">
              Supported formats: .txt, .pdf, .doc, .docx
            </span>
            <input
              id="file-upload"
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {file && (
            <div className="mt-2 text-sm text-gray-700">
              Selected file: <span className="font-semibold">{file.name}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#064EE3] to-[#3D76EC] text-white px-6 py-3 rounded-2xl font-semibold shadow hover:scale-[1.02] transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Extract Entities"}
        </button>

        {/* Summary Section */}
        {summary && (
          <div className="mt-6 bg-gray-50 border border-gray-200 p-6 rounded-2xl">
            <h2 className="font-semibold text-lg text-gray-800">Response Summary</h2>
            {summary.total_entities !== undefined && (
              <p className="mt-2 text-gray-700">
                Total Entities: {summary.total_entities}
              </p>
            )}
            {summary.entities_by_type && (
              <div className="flex flex-wrap gap-3 mt-3">
                {Object.entries(summary.entities_by_type).map(([type, count]) => (
                  <span
                    key={type}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {type}: {String(count)}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* No Entities Found */}
        {entities.length === 0 && summary?.status === "no_entities_found" && (
          <div className="mt-6 p-4 rounded-2xl bg-yellow-50 border border-yellow-300 text-yellow-800 shadow">
            <h3 className="font-semibold mb-1">No Entities Found</h3>
            <p>{summary.message}</p>
            <div className="mt-2 text-sm text-gray-700">
              <strong>Text length:</strong> {summary.text_length}
              <br />
              <strong>Entity types searched:</strong>{" "}
              {summary.entity_types_searched?.join(", ")}
            </div>
          </div>
        )}

        {/* Filters */}
        {entities.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
            <select
              className="border px-4 py-2 rounded-2xl focus:ring-2 focus:ring-[#3D76EC]"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              {[...new Set(entities.map((e) => e.entity_type))].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => exportData("csv")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-2xl shadow"
              >
                Export CSV
              </button>
              <button
                onClick={() => exportData("excel")}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-2xl shadow"
              >
                Export Excel
              </button>
              <button
                onClick={() => exportData("json")}
                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-2xl shadow"
              >
                Export JSON
              </button>
            </div>
          </div>
        )}

        {/* Results Table */}
        {filteredEntities.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 rounded-2xl overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-[#064EE3] to-[#3D76EC] text-white">
                  <th className="border p-3 text-left">Entity Type</th>
                  <th className="border p-3 text-left">Entity Value</th>
                  <th className="border p-3 text-left">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntities.map((entity, idx) => (
                  <tr
                    key={idx}
                    className={
                      entity.confidence < 0.7
                        ? "bg-red-50 text-red-800"
                        : "hover:bg-gray-50"
                    }
                  >
                    <td className="border p-3">{entity.entity_type}</td>
                    <td className="border p-3">{entity.entity_value}</td>
                    <td className="border p-3">
                      {(entity.confidence * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}