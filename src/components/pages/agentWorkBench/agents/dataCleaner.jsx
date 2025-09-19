import { useState } from "react";
import axios from "axios";
import { ArrowLeft } from 'lucide-react';

function DataCleaner() {
    const [file, setFile] = useState(null);
    const [instruction, setInstruction] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const simulateProgress = () => {
        setLoadingProgress(0);
        const interval = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 85) {
                    clearInterval(interval);
                    return 85;
                }
                return prev + Math.random() * 12;
            });
        }, 300);
        return interval;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError("Please select a CSV file");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        const progressInterval = simulateProgress();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("instruction", instruction);

        try {
            const response = await axios.post("http://127.0.0.1:8000/data-cleaner/clean", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            clearInterval(progressInterval);
            setLoadingProgress(100);

            setTimeout(() => {
                setResult(response.data);
                setLoading(false);
                setLoadingProgress(0);
            }, 500);

        } catch (err) {
            clearInterval(progressInterval);
            setError(err.response?.data?.error || "Error cleaning CSV. Please try again.");
            setLoading(false);
            setLoadingProgress(0);
        }
    };

    const handleDownload = () => {
        if (result) {
            const csvContent = result.rows.map(row => row.join(",")).join("\n");
            const csv = `${result.columns.join(",")}\n${csvContent}`;
            const blob = new Blob([csv], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "cleaned_data.csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setResult(null);
        setError(null);
    };

    const resetForm = () => {
        setFile(null);
        setInstruction("");
        setResult(null);
        setError(null);
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 min-h-screen">
            {/* Hero Section */}
            <section className="py-8 px-4 mt-19">
                <div className="max-w-4xl mx-auto text-center mb-4 ">

                    <div className="relative">
                        <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                            AI Data Cleaner
                        </h1>
                        <button
                            onClick={() => window.location.href = '/media-entertainment'}
                            className="absolute top-4 right-4 flex items-center gap-2 text-white font-medium hover:text-blue-200 transition-colors p-2 hover:bg-white-50 hover:bg-opacity-10 rounded-md z-10"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back</span>
                        </button>
                    </div>
                    <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Upload your CSV files and let AI clean, organize, and optimize your data automatically.
                    </p>
                </div>

                {/* Main Content Container */}
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-6">

                        {/* Input Section */}
                        <div className="space-y-4">
                            <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
                                {/* Active Agent Badge */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1 animate-pulse"></div>
                                        Active Agent
                                    </span>
                                    <span className="text-xs text-gray-500">AI Powered</span>
                                </div>

                                {/* File Upload */}
                                <div className="mb-6">
                                    <label className="block text-base font-semibold text-gray-800 mb-3">
                                        Upload CSV File 📁
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={handleFileChange}
                                            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl bg-white/90 text-gray-800 focus:ring-2 focus:ring-green-500/30 focus:border-green-500 focus:outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                        />
                                    </div>
                                    {file && (
                                        <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                                            <span className="text-sm text-blue-700 font-medium">📄 {file.name}</span>
                                            <span className="text-xs text-blue-600 ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading || !file}
                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span className="text-sm">Cleaning Data...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center space-x-2">
                                            <span className="text-sm">Clean CSV Data</span>
                                            <span>🚀</span>
                                        </div>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Output Section */}
                        <div className="space-y-4">

                            {/* Loading State */}
                            {loading && (
                                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
                                    <div className="text-center">
                                        <div className="relative w-16 h-16 mx-auto mb-4">
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-ping opacity-20"></div>
                                            <div className="relative w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                                <span className="text-xl animate-bounce">🔄</span>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-800 mb-1">Processing Data</h3>
                                        <p className="text-sm text-gray-600 mb-4">AI is cleaning your CSV file...</p>

                                        {/* Progress Bar */}
                                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                                                style={{ width: `${loadingProgress}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-4">{Math.round(loadingProgress)}% Complete</p>

                                        {/* Processing Steps */}
                                        <div className="space-y-1">
                                            <div className={`flex items-center justify-center text-xs ${loadingProgress > 25 ? 'text-blue-600' : 'text-gray-400'}`}>
                                                <span className="mr-1">{loadingProgress > 25 ? '✅' : '⏳'}</span>
                                                Reading CSV structure
                                            </div>
                                            <div className={`flex items-center justify-center text-xs ${loadingProgress > 50 ? 'text-blue-600' : 'text-gray-400'}`}>
                                                <span className="mr-1">{loadingProgress > 50 ? '✅' : '⏳'}</span>
                                                Applying cleaning rules
                                            </div>
                                            <div className={`flex items-center justify-center text-xs ${loadingProgress > 75 ? 'text-blue-600' : 'text-gray-400'}`}>
                                                <span className="mr-1">{loadingProgress > 75 ? '✅' : '⏳'}</span>
                                                Optimizing data quality
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Error State */}
                            {error && (
                                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4 shadow-lg">
                                    <div className="flex items-start">
                                        <span className="text-xl mr-2">❌</span>
                                        <div>
                                            <h3 className="text-sm font-semibold text-red-800">Processing Failed</h3>
                                            <p className="text-xs text-red-700 mt-1">{error}</p>
                                            <button
                                                onClick={() => setError(null)}
                                                className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                                            >
                                                Try again
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Success Result */}
                            {result && result.success && (
                                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <span className="text-xl mr-2">✅</span>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800">Data Cleaned Successfully</h3>
                                                <p className="text-xs text-gray-600">{result.rows.length} rows processed</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleDownload}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                            >
                                                📥 Download
                                            </button>
                                        </div>
                                    </div>

                                    {/* Data Preview */}
                                    <div className="bg-gradient-to-br from-gray-50/80 to-blue-50/80 backdrop-blur-sm p-4 rounded-lg border border-gray-200/50 max-h-80 overflow-auto">
                                        <div className="mb-3 flex items-center justify-between">
                                            <h4 className="text-sm font-semibold text-gray-700">Data Preview</h4>
                                            <span className="text-xs text-gray-500">{result.columns.length} columns</span>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-white/70">
                                                        {result.columns.slice(0, 6).map((col, index) => (
                                                            <th key={index} className="p-2 border-b font-medium text-gray-700 text-xs">
                                                                {col}
                                                            </th>
                                                        ))}
                                                        {result.columns.length > 6 && (
                                                            <th className="p-2 border-b font-medium text-gray-500 text-xs">...</th>
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {result.rows.slice(0, 5).map((row, rowIndex) => (
                                                        <tr key={rowIndex} className="border-b border-gray-100">
                                                            {row.slice(0, 6).map((cell, cellIndex) => (
                                                                <td key={cellIndex} className="p-2 text-gray-600 text-xs">
                                                                    {String(cell).length > 20 ? `${String(cell).substring(0, 20)}...` : String(cell)}
                                                                </td>
                                                            ))}
                                                            {row.length > 6 && (
                                                                <td className="p-2 text-gray-400 text-xs">...</td>
                                                            )}
                                                        </tr>
                                                    ))}
                                                    {result.rows.length > 5 && (
                                                        <tr>
                                                            <td colSpan={Math.min(result.columns.length, 7)} className="p-2 text-center text-gray-400 text-xs">
                                                                ... and {result.rows.length - 5} more rows
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
                                        <button
                                            onClick={resetForm}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                                        >
                                            Clean New File
                                        </button>
                                        <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors">
                                            View Details
                                        </button>
                                        <button className="bg-green-200 hover:bg-green-300 text-green-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors">
                                            Share
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Placeholder */}
                            {!loading && !error && !result && (
                                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border-2 border-dashed border-gray-300 text-center">
                                    <div className="text-4xl mb-3">📈</div>
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Clean Data Output</h3>
                                    <p className="text-sm text-gray-500">Your processed CSV will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default DataCleaner;