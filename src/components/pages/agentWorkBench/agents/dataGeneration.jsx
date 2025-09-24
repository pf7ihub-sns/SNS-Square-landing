import React, { useState, useEffect } from "react";
import axios from "axios";
import { Database, Plus, Download, Sparkles, Settings, FileText, Hash, Eye, EyeOff, ChevronDown, ChevronUp, X, Check, Loader2, Upload, ArrowLeft, Mic } from "lucide-react";

// Button component
const Button = ({ children, className, onClick, disabled, ...props }) => (
  <button
    className={className}
    onClick={onClick}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

// Initialize SpeechRecognition API
const SpeechRecognition = typeof window !== "undefined" ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;

export default function DataGenerationPage({ onBack }) {
  const [selectedMethodCard, setSelectedMethodCard] = useState(null);
  const [tableName, setTableName] = useState("");
  const [domain, setDomain] = useState("");
  const [tableInstructions, setTableInstructions] = useState("");
  const [isRecordingTableInstr, setIsRecordingTableInstr] = useState(false);
  const [schema, setSchema] = useState("");
  const [sampleFile, setSampleFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [newColumn, setNewColumn] = useState("");
  const [newColumnType, setNewColumnType] = useState("TEXT");
  const [numRows, setNumRows] = useState(5);
  const [title, setTitle] = useState("");
  const [isRecordingTitle, setIsRecordingTitle] = useState(false);
  const [description, setDescription] = useState("");
  const [isRecordingDescription, setIsRecordingDescription] = useState(false);
  const [columnInstructions, setColumnInstructions] = useState({});
  const [csvData, setCsvData] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    columns: true,
    instructions: false,
    parameters: true,
  });
  const [step, setStep] = useState(1);
  const [particles, setParticles] = useState([]);
  const [isRecognizing, setIsRecognizing] = useState({});
  const [recognition, setRecognition] = useState(null);

  // Available data types for the dropdown
  const dataTypes = ["TEXT", "INTEGER", "FLOAT", "DATE", "BOOLEAN"];

  // Initialize SpeechRecognition
  useEffect(() => {
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = "en-US";
      setRecognition(recog);
    }
  }, []);

  // Voice recognition handlers
  const startRecognition = (field) => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    if (isRecognizing[field] || field === "table" && isRecordingTableInstr || field === "title" && isRecordingTitle || field === "description" && isRecordingDescription) return;

    if (field === "table") setIsRecordingTableInstr(true);
    else if (field === "title") setIsRecordingTitle(true);
    else if (field === "description") setIsRecordingDescription(true);
    else setIsRecognizing((prev) => ({ ...prev, [field]: true }));

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + " ";
      }
      if (field === "table") {
        setTableInstructions((prev) => prev + finalTranscript);
      } else if (field === "title") {
        setTitle((prev) => prev + finalTranscript);
      } else if (field === "description") {
        setDescription((prev) => prev + finalTranscript);
      } else {
        setColumnInstructions((prev) => ({ ...prev, [field]: (prev[field] || "") + finalTranscript }));
      }
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (field === "table") setIsRecordingTableInstr(false);
      else if (field === "title") setIsRecordingTitle(false);
      else if (field === "description") setIsRecordingDescription(false);
      else setIsRecognizing((prev) => ({ ...prev, [field]: false }));
      alert(`Speech recognition error: ${event.error}`);
    };
    recognition.onend = () => {
      if (field === "table") setIsRecordingTableInstr(false);
      else if (field === "title") setIsRecordingTitle(false);
      else if (field === "description") setIsRecordingDescription(false);
      else setIsRecognizing((prev) => ({ ...prev, [field]: false }));
    };
    recognition.start();
  };

  const stopRecognition = (field) => {
    if (recognition) {
      if (field === "table" && isRecordingTableInstr) {
        recognition.stop();
        setIsRecordingTableInstr(false);
      } else if (field === "title" && isRecordingTitle) {
        recognition.stop();
        setIsRecordingTitle(false);
      } else if (field === "description" && isRecordingDescription) {
        recognition.stop();
        setIsRecordingDescription(false);
      } else if (isRecognizing[field]) {
        recognition.stop();
        setIsRecognizing((prev) => ({ ...prev, [field]: false }));
      }
    }
  };

  const parseCsvToTableData = (csvString) => {
    if (!csvString) return { headers: [], rows: [] };
    const lines = csvString.trim().split("\n");
    if (lines.length === 0) return { headers: [], rows: [] };
    const headers = lines[0].split(",").map((h) => h.trim());
    const rows = lines.slice(1).map((line) => line.split(",").map((cell) => cell.trim()));
    return { headers, rows };
  };

  const fetchColumnSuggestions = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/data-generation/columns-suggestions`, {
        params: {
          table_name: tableName,
          domain: domain || undefined,
          table_instructions: tableInstructions || undefined,
        },
      });
      console.log("fetchColumnSuggestions response:", res.data);
      const suggestions = Array.isArray(res.data.suggestions)
        ? res.data.suggestions.map((col) => ({ name: col.name, type: col.type }))
        : [];
      console.log("Setting columns:", suggestions);
      setColumns(suggestions);
      setSelectedColumns(suggestions);
      setStep(2);
      setCsvData("");
    } catch (error) {
      console.error("Error fetching column suggestions:", error);
      alert("Failed to fetch column suggestions.");
      setColumns([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSchemaColumns = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(`http://localhost:8000/data-generation/schema-columns`, { schema });
      console.log("fetchSchemaColumns response:", res.data);
      const columns = Array.isArray(res.data.columns)
        ? res.data.columns.map((col) => ({ name: col, type: "TEXT" }))
        : [];
      console.log("Setting columns:", columns);
      setColumns(columns);
      setSelectedColumns(columns);
      setStep(2);
      setCsvData("");
    } catch (error) {
      console.error("Error parsing schema:", error);
      alert("Failed to parse SQL schema.");
      setColumns([]);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCSV = () => {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${tableName || "generated_data"}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 mt-26" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="relative">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white text-center mb-6 p-3 sm:p-4 rounded-lg mx-8 sm:mx-12 lg:mx-0" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            Data Generation
          </h1>
          <button
            onClick={handleBack}
            className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-4 lg:right-4 flex items-center gap-1 sm:gap-2 text-white font-medium hover:text-blue-200 transition-colors text-sm sm:text-base p-2 hover:bg-white-50 hover:bg-opacity-10 rounded-md"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            <span>Back</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="text-center mb-6 text-gray-700">
          <p className="mb-2">Generate custom datasets with AI-powered data creation tools.</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Instructions Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-32">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Use</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Choose Method</p>
                    <p className="text-sm text-gray-600">Select from Custom, Schema, or Sample CSV</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Configure Columns</p>
                    <p className="text-sm text-gray-600">Customize column names and data types</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Set Parameters</p>
                    <p className="text-sm text-gray-600">Specify number of rows and instructions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Generate Data</p>
                    <p className="text-sm text-gray-600">Create and download your dataset</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Generation Features</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• AI-powered realistic data</li>
                  <li>• Multiple data types support</li>
                  <li>• Custom column instructions</li>
                  <li>• CSV export functionality</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Form Area */}
          <div className="lg:col-span-3">
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <MethodCard
                    icon={<Sparkles className="w-8 h-8" />}
                    title="Customized Data"
                    description="Generate data by specifying a table name, domain, and customizing columns."
                    onClick={() => setSelectedMethodCard("custom")}
                    isSelected={selectedMethodCard === "custom"}
                  />
                  <MethodCard
                    icon={<FileText className="w-8 h-8" />}
                    title="SQL Schema"
                    description="Generate data based on an SQL schema definition."
                    onClick={() => setSelectedMethodCard("schema")}
                    isSelected={selectedMethodCard === "schema"}
                  />
                  <MethodCard
                    icon={<Upload className="w-8 h-8" />}
                    title="Sample CSV"
                    description="Generate data based on an uploaded CSV file."
                    onClick={() => setSelectedMethodCard("sample")}
                    isSelected={selectedMethodCard === "sample"}
                  />
                </div>

                {selectedMethodCard && (
                  <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    {selectedMethodCard === "custom" && (
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="tableName" className="block text-sm font-medium text-gray-700 mb-2">
                            Table Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="tableName"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            placeholder="Enter table name (e.g., employees)"
                            value={tableName}
                            onChange={(e) => setTableName(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="tableInstructions" className="block text-sm font-medium text-gray-700 mb-2">
                            Table Instructions <span className="text-gray-400 font-normal">(Optional)</span>
                          </label>
                          <div className="flex items-center gap-3">
                            <textarea
                              id="tableInstructions"
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                              placeholder="Describe the table context (e.g., Employee performance in Q1)..."
                              value={tableInstructions}
                              onChange={(e) => setTableInstructions(e.target.value)}
                              rows={4}
                            />
                            {SpeechRecognition && (
                              <button
                                onClick={() =>
                                  isRecordingTableInstr
                                    ? stopRecognition("table")
                                    : startRecognition("table")
                                }
                                className={`px-3 py-2 rounded-lg ${isRecordingTableInstr ? "bg-red-600" : "bg-blue-600"} text-white`}
                              >
                                <Mic className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Help guide the data generation with specific requirements
                          </p>
                        </div>
                        <div>
                          <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
                            Domain <span className="text-gray-400 font-normal">(Optional)</span>
                          </label>
                          <input
                            id="domain"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            placeholder="Enter domain (e.g., HR, Sales)"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                          />
                          <p className="mt-1 text-sm text-gray-500">
                            Specify the business domain for more relevant data
                          </p>
                        </div>
                        <button
                          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${isLoading || !tableName.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                          style={{ backgroundColor: isLoading || !tableName.trim() ? '#9CA3AF' : '#1E3A8A' }}
                          onClick={fetchColumnSuggestions}
                          disabled={isLoading || !tableName.trim()}
                        >
                          {isLoading ? (
                            <span className="flex items-center justify-center">
                              <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Loading...
                            </span>
                          ) : (
                            'Suggest Columns'
                          )}
                        </button>
                      </div>
                    )}

                    {selectedMethodCard === "schema" && (
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="schema" className="block text-sm font-medium text-gray-700 mb-2">
                            SQL Schema <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="schema"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            placeholder="Enter SQL schema (e.g., CREATE TABLE employees (...))"
                            rows={6}
                            value={schema}
                            onChange={(e) => setSchema(e.target.value)}
                            required
                          />
                          <p className="mt-1 text-sm text-gray-500">
                            Paste your CREATE TABLE statement to extract columns
                          </p>
                        </div>
                        <button
                          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${isLoading || !schema.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                          style={{ backgroundColor: isLoading || !schema.trim() ? '#9CA3AF' : '#1E3A8A' }}
                          onClick={fetchSchemaColumns}
                          disabled={isLoading || !schema.trim()}
                        >
                          {isLoading ? (
                            <span className="flex items-center justify-center">
                              <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Loading...
                            </span>
                          ) : (
                            'Extract Columns'
                          )}
                        </button>
                      </div>
                    )}

                    {selectedMethodCard === "sample" && (
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="sampleFile" className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Sample CSV <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="sampleFile"
                            type="file"
                            accept=".csv"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white file:hover:bg-blue-700"
                            onChange={(e) => setSampleFile(e.target.files ? e.target.files[0] : null)}
                          />
                          <p className="mt-1 text-sm text-gray-500">
                            Upload a CSV file to use as a template for data generation
                          </p>
                        </div>
                        <button
                          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${isLoading || !sampleFile ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                          style={{ backgroundColor: isLoading || !sampleFile ? '#9CA3AF' : '#1E3A8A' }}
                          onClick={async () => {
                            if (!sampleFile) {
                              alert("Please upload a CSV file.");
                              return;
                            }
                            setIsLoading(true);
                            try {
                              const formData = new FormData();
                              formData.append("file", sampleFile);
                              const res = await axios.post(`http://localhost:8000/data-generation/sample-columns`, formData);
                              console.log("sample-columns response:", res.data);
                              const columns = Array.isArray(res.data.columns)
                                ? res.data.columns.map((col) => ({ name: col, type: "TEXT" }))
                                : [];
                              console.log("Setting columns:", columns);
                              setColumns(columns);
                              setSelectedColumns(columns);
                              setStep(2);
                              setCsvData("");
                            } catch (error) {
                              console.error("Error parsing sample CSV:", error);
                              alert("Failed to parse sample CSV.");
                              setColumns([]);
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                          disabled={isLoading || !sampleFile}
                        >
                          {isLoading ? (
                            <span className="flex items-center justify-center">
                              <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Loading...
                            </span>
                          ) : (
                            'Extract Columns'
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <button
                    onClick={() => {
                      setStep(1);
                      setColumns([]);
                      setSelectedColumns([]);
                      setCsvData("");
                    }}
                    className="mr-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedMethodCard === "custom"
                      ? "Customize Columns"
                      : selectedMethodCard === "schema"
                        ? "Columns from Schema"
                        : "Columns from Sample CSV"}
                  </h2>
                </div>

                <div className="space-y-8">
                  {/* Columns Section */}
                  <div>
                    <div
                      className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-lg"
                      onClick={() =>
                        setExpandedSections((prev) => ({ ...prev, columns: !prev.columns }))
                      }
                    >
                      <h3 className="text-lg font-semibold text-gray-900">Select and Customize Columns</h3>
                      {expandedSections.columns ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    {expandedSections.columns && (
                      <div className="mt-4 space-y-4 p-4 border border-gray-200 rounded-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="font-medium text-gray-700">Column Name</div>
                          <div className="font-medium text-gray-700">Data Type</div>
                          <div className="font-medium text-gray-700">Action</div>
                        </div>
                        {selectedColumns.map((col, index) => (
                          <div key={col.name} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center p-3 bg-gray-50 rounded-lg">
                            <input
                              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                              value={col.name}
                              onChange={(e) => {
                                const newColumns = [...selectedColumns];
                                newColumns[index].name = e.target.value;
                                setSelectedColumns(newColumns);
                              }}
                            />
                            <select
                              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                              value={col.type}
                              onChange={(e) => {
                                const newColumns = [...selectedColumns];
                                newColumns[index].type = e.target.value;
                                setSelectedColumns(newColumns);
                              }}
                            >
                              {dataTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => setSelectedColumns(selectedColumns.filter((_, i) => i !== index))}
                              className="text-red-500 hover:text-red-700 transition-colors duration-200 flex justify-center"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                          <input
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            placeholder="Enter a new column name"
                            value={newColumn}
                            onChange={(e) => setNewColumn(e.target.value)}
                          />
                          <select
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            value={newColumnType}
                            onChange={(e) => setNewColumnType(e.target.value)}
                          >
                            {dataTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                          <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex justify-center items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                            onClick={() => {
                              if (newColumn.trim() && !selectedColumns.some((col) => col.name === newColumn)) {
                                setSelectedColumns([...selectedColumns, { name: newColumn, type: newColumnType }]);
                                setNewColumn("");
                                setNewColumnType("TEXT");
                              }
                            }}
                            disabled={!newColumn.trim()}
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Column Instructions Section */}
                  <div>
                    <div
                      className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-lg"
                      onClick={() =>
                        setExpandedSections((prev) => ({ ...prev, instructions: !prev.instructions }))
                      }
                    >
                      <h3 className="text-lg font-semibold text-gray-900">Column Instructions <span className="text-gray-400 font-normal">(Optional)</span></h3>
                      {expandedSections.instructions ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    {expandedSections.instructions && (
                      <div className="mt-4 space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        {selectedColumns.map((col) => (
                          <div key={col.name} className="flex items-center gap-3">
                            <label htmlFor={col.name} className="w-1/3 text-sm text-gray-700 font-medium truncate">
                              {col.name} ({col.type})
                            </label>
                            <div className="flex-1 flex items-center gap-2">
                              <input
                                id={col.name}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                placeholder={`Instructions for ${col.name} (e.g., realistic names)`}
                                value={columnInstructions[col.name] || ""}
                                onChange={(e) =>
                                  setColumnInstructions((prev) => ({
                                    ...prev,
                                    [col.name]: e.target.value,
                                  }))
                                }
                              />
                              {SpeechRecognition && (
                                <button
                                  onClick={() =>
                                    isRecognizing[col.name] ? stopRecognition(col.name) : startRecognition(col.name)
                                  }
                                  className={`px-3 py-2 rounded-lg ${isRecognizing[col.name] ? "bg-red-600" : "bg-blue-600"} text-white`}
                                >
                                  <Mic className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Parameters Section */}
                  <div>
                    <div
                      className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-lg"
                      onClick={() =>
                        setExpandedSections((prev) => ({ ...prev, parameters: !prev.parameters }))
                      }
                    >
                      <h3 className="text-lg font-semibold text-gray-900">Parameters</h3>
                      {expandedSections.parameters ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    {expandedSections.parameters && (
                      <div className="mt-4 space-y-6 p-4 border border-gray-200 rounded-lg">
                        <div>
                          <label htmlFor="numRows" className="block text-sm font-medium text-gray-700 mb-2">
                            Number of Rows
                          </label>
                          <input
                            id="numRows"
                            type="number"
                            min="1"
                            max="1000"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            value={numRows}
                            onChange={(e) => setNumRows(Number(e.target.value))}
                          />
                          <p className="mt-1 text-sm text-gray-500">
                            Specify how many rows of data to generate (1-1000)
                          </p>
                        </div>
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Table Title <span className="text-gray-400 font-normal">(Optional)</span>
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              id="title"
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                              placeholder="Enter table title"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                            />
                            {SpeechRecognition && (
                              <button
                                onClick={() =>
                                  isRecordingTitle ? stopRecognition("title") : startRecognition("title")
                                }
                                className={`px-3 py-2 rounded-lg ${isRecordingTitle ? "bg-red-600" : "bg-blue-600"} text-white`}
                              >
                                <Mic className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Table Description <span className="text-gray-400 font-normal">(Optional)</span>
                          </label>
                          <div className="flex items-center gap-3">
                            <textarea
                              id="description"
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                              placeholder="Describe the table"
                              rows={4}
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                            />
                            {SpeechRecognition && (
                              <button
                                onClick={() =>
                                  isRecordingDescription ? stopRecognition("description") : startRecognition("description")
                                }
                                className={`px-3 py-2 rounded-lg ${isRecordingDescription ? "bg-red-600" : "bg-blue-600"} text-white`}
                              >
                                <Mic className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Generate Button */}
                  <div className="pt-4">
                    <button
                      className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${isGenerating || selectedColumns.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                      style={{ backgroundColor: isGenerating || selectedColumns.length === 0 ? '#9CA3AF' : '#1E3A8A' }}
                      onClick={async () => {
                        setIsGenerating(true);
                        try {
                          let res;
                          if (selectedMethodCard === "custom") {
                            res = await axios.post(`http://localhost:8000/data-generation/generate`, {
                              columns: selectedColumns.map((col) => col.name),
                              num_rows: numRows,
                              title,
                              description,
                              column_instructions: Object.entries(columnInstructions).map(([column_name, instruction]) => ({
                                column_name,
                                instruction,
                              })),
                              domain,
                            });
                          } else if (selectedMethodCard === "schema") {
                            res = await axios.post(`http://localhost:8000/data-generation/generate-from-schema`, {
                              columns: selectedColumns.map((col) => col.name),
                              num_rows: numRows,
                              title,
                              description,
                              column_instructions: Object.entries(columnInstructions).map(([column_name, instruction]) => ({
                                column_name,
                                instruction,
                              })),
                              schema,
                              domain,
                            });
                          } else if (selectedMethodCard === "sample") {
                            const formData = new FormData();
                            formData.append("file", sampleFile);
                            formData.append(
                              "data",
                              JSON.stringify({
                                columns: selectedColumns.map((col) => col.name),
                                num_rows: numRows,
                                title,
                                description,
                                column_instructions: Object.entries(columnInstructions).map(([column_name, instruction]) => ({
                                  column_name,
                                  instruction,
                                })),
                                domain,
                              })
                            );
                            res = await axios.post(`http://localhost:8000/data-generation/generate-from-sample`, formData);
                          }
                          console.log("generate response:", res.data);
                          setCsvData(res.data.csv);
                        } catch (error) {
                          console.error("Error generating data:", error);
                          alert("Failed to generate data.");
                        } finally {
                          setIsGenerating(false);
                        }
                      }}
                      disabled={isGenerating || selectedColumns.length === 0}
                    >
                      {isGenerating ? (
                        <span className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Generating Data...
                        </span>
                      ) : (
                        'Generate Data'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Results Section */}
            {csvData && (
              <div className="mt-6 bg-white rounded-lg shadow-md border border-gray-200">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Generated Dataset</h2>
                      <p className="text-gray-600 mt-1">Data generation completed successfully</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Complete
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Data Preview</h3>
                    <div className="flex gap-4">
                      <button
                        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
                        onClick={() => setShowPreview(!showPreview)}
                      >
                        {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                        {showPreview ? "Hide" : "Show"} Data
                      </button>
                      <button
                        className="flex items-center bg-blue-700 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-800 transition-colors shadow-md text-sm sm:text-base"
                        style={{ backgroundColor: '#1E3A8A' }}
                        onClick={downloadCSV}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download CSV
                      </button>
                    </div>
                  </div>
                  {showPreview && (
                    <div className="h-96 overflow-y-auto border border-gray-300 rounded-lg">
                      {(() => {
                        const { headers, rows } = parseCsvToTableData(csvData);
                        if (headers.length === 0) return <p className="text-gray-500 italic p-4">No data to display.</p>;
                        return (
                          <table className="min-w-full divide-y divide-gray-200 table-auto relative">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                              <tr>
                                {headers.map((header, index) => (
                                  <th
                                    key={index}
                                    scope="col"
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                  >
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {rows.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-150">
                                  {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        );
                      })()}
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Dataset generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => window.print()}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      >
                        Print Dataset
                      </button>
                      <button
                        onClick={() => {
                          setCsvData("");
                          setStep(1);
                          setSelectedMethodCard(null);
                          setColumns([]);
                          setSelectedColumns([]);
                        }}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                      >
                        New Generation
                      </button>
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
}

function MethodCard({ icon, title, description, onClick, isSelected }) {
  return (
    <button
      onClick={onClick}
      className={`group p-6 rounded-lg border-2 transition-all duration-300 text-left
        ${isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
        }
      `}
    >
      <div className={`p-3 rounded-full mb-4 inline-flex ${isSelected ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-blue-50'}`}>
        <div className={`${isSelected ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'}`}>
          {icon}
        </div>
      </div>
      <h3 className={`text-lg font-semibold mb-2 ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </button>
  );
}