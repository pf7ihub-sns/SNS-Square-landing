
import React, { useState, useRef, useEffect } from "react"
import axios from "axios"
import { Database, Upload, FileText, X, Check, Loader2, Download, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"

export default function DataProfiler() {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [results, setResults] = useState(null)
    const [step, setStep] = useState(1)
    const [showReport, setShowReport] = useState(true)
    const [expandedSections, setExpandedSections] = useState({
        datasetInfo: true,
        summary: true,
        qualityIssues: true,
        patterns: true,
        relationships: true,
        correlations: true,
        businessRules: true,
        columnProfiling: true,
        sheetAnalysis: true,
        overallSummary: true,
    })
    const fileInputRef = useRef(null)

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
                setError('Please select a CSV or Excel file')
                return
            }
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError('File must be less than 10MB')
                return
            }
            setFile(selectedFile)
            setError("")
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        const selectedFile = e.dataTransfer.files[0]
        if (selectedFile) {
            if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
                setError('Please select a CSV or Excel file')
                return
            }
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError('File must be less than 10MB')
                return
            }
            setFile(selectedFile)
            setError("")
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
    }

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first')
            return
        }

        setLoading(true)
        setError("")
        setResults(null)

        const formData = new FormData()
        formData.append("file", file)

        try {
            const response = await axios.post("http://localhost:8000/data-profiling/profile", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            setResults(response.data)
            setStep(2)
        } catch (err) {
            setError(err.response?.data?.detail || err.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFile(null)
        setResults(null)
        setError("")
        setStep(1)
        setShowReport(true)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const downloadReport = () => {
        const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${results.file_info.filename.split('.')[0]}_profile_report.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    const renderTable = (report) => (
        <div className="bg-white rounded-lg p-4 max-h-96 overflow-auto border border-gray-200 shadow-sm">
            <table className="w-full text-sm text-gray-700">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        {[
                            'Column Name',
                            'Count',
                            'Data Type',
                            'Min',
                            'Max',
                            'Mean',
                            'Std Dev',
                            'Null Count',
                            'Completeness %',
                            'Unique Count',
                            'Uniqueness %',
                            'Primary Key',
                            'Foreign Key'
                        ].map((header) => (
                            <th key={header} className="px-3 py-2 text-left font-semibold text-xs text-gray-900 border-b border-gray-200">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {(Array.isArray(report) ? report : []).map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50 border-b border-gray-100">
                            <td className="px-3 py-2 text-xs font-medium text-gray-900">{row['Column Name']}</td>
                            <td className="px-3 py-2 text-xs text-gray-600">{row['Count the values']}</td>
                            <td className="px-3 py-2 text-xs text-gray-600">{row['Data Type']}</td>
                            <td className="px-3 py-2 text-xs text-gray-600">{row['Min'] ?? 'N/A'}</td>
                            <td className="px-3 py-2 text-xs text-gray-600">{row['Max'] ?? 'N/A'}</td>
                            <td className="px-3 py-2 text-xs text-gray-600">{row['Mean'] ?? 'N/A'}</td>
                            <td className="px-3 py-2 text-xs text-gray-600">{row['Std Dev'] ?? 'N/A'}</td>
                            <td className="px-3 py-2 text-xs text-gray-600">{row['Null Values Count']}</td>
                            <td className="px-3 py-2 text-xs text-gray-600">{row['Completeness %']}%</td>
                            <td className="px-3 py-2 text-xs text-gray-600">{row['Unique count']}</td>
                            <td className="px-3 py-2 text-xs text-gray-600">{row['Uniqueness %']}%</td>
                            <td className="px-3 py-2 text-xs">
                                <span className={`px-2 py-1 rounded text-xs ${row['Primary Key'] === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                    {row['Primary Key']}
                                </span>
                            </td>
                            <td className="px-3 py-2 text-xs">
                                <span className={`px-2 py-1 rounded text-xs ${row['Foreign Key'] === 'Yes' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                                    {row['Foreign Key']}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {(!Array.isArray(report) || report.length === 0) && (
                <div className="text-gray-500 text-sm mt-3 text-center">No rows to display.</div>
            )}
        </div>
    )

    const renderDataQualityIssues = (issues) => (
        <div className="space-y-4">
            {issues.missing_values && Object.keys(issues.missing_values).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="text-red-800 font-semibold mb-2">Missing Values</h4>
                    {Object.entries(issues.missing_values).map(([col, data]) => (
                        <div key={col} className="text-sm text-red-700">
                            <span className="font-medium">{col}:</span> {data.count} missing ({data.percentage}%)
                        </div>
                    ))}
                </div>
            )}
            {issues.duplicate_rows > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="text-yellow-800 font-semibold mb-2">Duplicate Rows</h4>
                    <div className="text-sm text-yellow-700">{issues.duplicate_rows} duplicate rows found</div>
                </div>
            )}
            {issues.outliers && Object.keys(issues.outliers).length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="text-orange-800 font-semibold mb-2">Outliers</h4>
                    {Object.entries(issues.outliers).map(([col, data]) => (
                        <div key={col} className="text-sm text-orange-700">
                            <span className="font-medium">{col}:</span> {data.count} outliers ({data.percentage}%)
                        </div>
                    ))}
                </div>
            )}
        </div>
    )

    const renderPatternAnalysis = (patterns) => (
        <div className="space-y-4">
            {patterns.email_patterns && Object.keys(patterns.email_patterns).length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-blue-800 font-semibold mb-2">Email Patterns</h4>
                    {Object.entries(patterns.email_patterns).map(([col, data]) => (
                        <div key={col} className="text-sm text-blue-700">
                            <span className="font-medium">{col}:</span> {data.count} emails ({data.percentage}%)
                        </div>
                    ))}
                </div>
            )}
            {patterns.phone_patterns && Object.keys(patterns.phone_patterns).length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-green-800 font-semibold mb-2">Phone Patterns</h4>
                    {Object.entries(patterns.phone_patterns).map(([col, data]) => (
                        <div key={col} className="text-sm text-green-700">
                            <span className="font-medium">{col}:</span> {data.count} phone numbers ({data.percentage}%)
                        </div>
                    ))}
                </div>
            )}
            {patterns.date_patterns && Object.keys(patterns.date_patterns).length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="text-purple-800 font-semibold mb-2">Date Patterns</h4>
                    {Object.entries(patterns.date_patterns).map(([col, patterns]) => (
                        <div key={col} className="text-sm text-purple-700">
                            <span className="font-medium">{col}:</span>
                            {Object.entries(patterns).map(([pattern, data]) => (
                                <div key={pattern} className="ml-4">
                                    {pattern}: {data.count} matches ({data.percentage}%)
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )

    const renderKeyAnalysis = (keyAnalysis) => (
        <div className="space-y-4">
            {keyAnalysis.potential_primary_keys && Object.keys(keyAnalysis.potential_primary_keys).length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-green-800 font-semibold mb-2">Potential Primary Keys</h4>
                    {Object.entries(keyAnalysis.potential_primary_keys).map(([col, data]) => (
                        <div key={col} className="text-sm text-green-700">
                            <span className="font-medium">{col}:</span>
                            <span className={`ml-2 px-2 py-1 rounded text-xs ${data.confidence === 'High' ? 'bg-green-100 text-green-800' :
                                    data.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                }`}>
                                {data.confidence} confidence
                            </span>
                        </div>
                    ))}
                </div>
            )}
            {keyAnalysis.potential_foreign_keys && Object.keys(keyAnalysis.potential_foreign_keys).length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-blue-800 font-semibold mb-2">Potential Foreign Keys</h4>
                    {Object.entries(keyAnalysis.potential_foreign_keys).map(([col, data]) => (
                        <div key={col} className="text-sm text-blue-700">
                            <span className="font-medium">{col}:</span>
                            <span className="ml-2 px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                {data.confidence} confidence
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )

    const renderComprehensiveSummary = (summary) => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-3xl font-bold text-blue-700">{summary.overall_quality_score}</div>
                    <div className="text-sm text-gray-600">Overall Quality Score</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-3xl font-bold text-green-700">{summary.completeness_score}%</div>
                    <div className="text-sm text-gray-600">Completeness Score</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="text-3xl font-bold text-purple-700">{summary.data_health}</div>
                    <div className="text-sm text-gray-600">Data Health Status</div>
                </div>
            </div>
            {summary.key_insights && summary.key_insights.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Insights</h4>
                    <ul className="space-y-2">
                        {summary.key_insights.map((insight, index) => (
                            <li key={index} className="flex items-center text-gray-700">
                                <Check className="w-4 h-4 text-green-500 mr-2" />
                                {insight}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {summary.recommendations && summary.recommendations.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-yellow-800 mb-3">Recommendations</h4>
                    <ul className="space-y-2">
                        {summary.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-center text-yellow-700">
                                <Database className="w-4 h-4 text-yellow-600 mr-2" />
                                {rec}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )

    const renderDatasetInfo = (datasetInfo) => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-blue-600">{datasetInfo.dataset_overview.total_rows.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Rows</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-green-600">{datasetInfo.dataset_overview.total_columns}</div>
                    <div className="text-sm text-gray-600">Total Columns</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-purple-600">{datasetInfo.dataset_overview.memory_usage_mb} MB</div>
                    <div className="text-sm text-gray-600">Memory Usage</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-orange-600">{datasetInfo.sparsity_analysis.sparsity_percentage}%</div>
                    <div className="text-sm text-gray-600">Sparsity</div>
                </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Column Type Distribution</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(datasetInfo.column_type_distribution).map(([type, count]) => (
                        <div key={type} className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xl font-bold text-gray-900">{count}</div>
                            <div className="text-sm text-gray-600 capitalize">{type}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

    const renderBusinessRules = (businessRules) => (
        <div className="space-y-4">
            {Object.entries(businessRules).map(([ruleType, rules]) => {
                if (!rules || Object.keys(rules).length === 0) return null;
                return (
                    <div key={ruleType} className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="text-red-800 font-semibold mb-2 capitalize">{ruleType.replace('_', ' ')} Violations</h4>
                        {Object.entries(rules).map(([col, violations]) => (
                            <div key={col} className="text-sm text-red-700 mb-2">
                                <span className="font-medium">{col}:</span> {violations.violations} violations ({violations.percentage}%)
                                <div className="text-xs text-red-600 ml-4">Rule: {violations.rule}</div>
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    )

    const renderCorrelationAnalysis = (correlations) => (
        <div className="space-y-4">
            {correlations.high_correlations && correlations.high_correlations.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-blue-800 font-semibold mb-2">High Correlations</h4>
                    <div className="space-y-2">
                        {correlations.high_correlations.map((corr, index) => (
                            <div key={index} className="text-sm text-blue-700">
                                <span className="font-medium">{corr.column1}</span> ↔ <span className="font-medium">{corr.column2}</span>
                                <span className={`ml-2 px-2 py-1 rounded text-xs ${corr.strength === 'Strong' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {corr.correlation} ({corr.type} {corr.strength})
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {correlations.categorical_correlations && Object.keys(correlations.categorical_correlations).length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-green-800 font-semibold mb-2">Categorical Correlations (Cramér's V)</h4>
                    <div className="space-y-2">
                        {Object.entries(correlations.categorical_correlations).map(([pair, stats]) => (
                            <div key={pair} className="text-sm text-green-700">
                                <span className="font-medium">{pair}:</span> {stats.cramers_v} ({stats.strength})
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 mt-26" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="w-full max-w-5xl">
                {/* Header */}
                <div className="relative">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white text-center mb-6 p-3 sm:p-4 rounded-lg mx-8 sm:mx-12 lg:mx-0" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        Data Profiling Tool
                    </h1>
                    <button
                        onClick={() => window.location.href = '/media-entertainment'}
                        className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-4 lg:right-4 flex items-center gap-1 sm:gap-2 text-white font-medium hover:text-blue-200 transition-colors text-sm sm:text-base p-2 hover:bg-white-50 hover:bg-opacity-10 rounded-md"
                    >
                        <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                        <span>Back</span>
                    </button>
                </div>

                {/* Instructions */}
                <div className="text-center mb-6 text-gray-700">
                    <p className="mb-2">Upload your CSV or Excel dataset to generate comprehensive profiling reports.</p>
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
                                        <p className="text-sm font-medium text-gray-900">Upload Dataset</p>
                                        <p className="text-sm text-gray-600">Select a CSV or Excel file from your device</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                        2
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Analyze Data</p>
                                        <p className="text-sm text-gray-600">Click to start comprehensive data profiling</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                        3
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Review Report</p>
                                        <p className="text-sm text-gray-600">Examine detailed analysis and insights</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                        4
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Download Results</p>
                                        <p className="text-sm text-gray-600">Export the complete profiling report</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <h4 className="text-sm font-medium text-blue-900 mb-2">Profiling Features</h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Data quality assessment</li>
                                    <li>• Pattern recognition analysis</li>
                                    <li>• Statistical summaries</li>
                                    <li>• Relationship detection</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {!results && (
                            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                                <div className="space-y-6">
                                    {/* File Upload Section */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Dataset File <span className="text-red-500">*</span>
                                        </label>
                                        <div
                                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <input
                                                type="file"
                                                accept=".csv,.xlsx,.xls"
                                                onChange={handleFileChange}
                                                ref={fileInputRef}
                                                className="hidden"
                                            />
                                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 mb-2">Drag and drop a file here, or click to browse</p>
                                            <p className="text-sm text-gray-500">Supports CSV, XLSX, and XLS files (max 10MB)</p>
                                            {file && (
                                                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                                                    <div className="flex items-center justify-center text-gray-700">
                                                        <FileText className="w-5 h-5 mr-2" />
                                                        <span className="font-medium">{file.name}</span>
                                                        <span className="ml-2 text-sm text-gray-500">
                                                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Upload your dataset to begin comprehensive data profiling and quality analysis
                                        </p>
                                    </div>

                                    {/* Error Display */}
                                    {error && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <div className="flex items-center">
                                                <X className="w-5 h-5 text-red-500 mr-2" />
                                                <p className="text-red-800 font-medium">Upload Error</p>
                                            </div>
                                            <p className="text-red-700 mt-1">{error}</p>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <div className="pt-4">
                                        <button
                                            onClick={handleUpload}
                                            disabled={loading || !file}
                                            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || (!file) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                                            style={{ backgroundColor: loading || (!file) ? '#9CA3AF' : '#1E3A8A' }}
                                        >
                                            {loading ? (
                                                <span className="flex items-center justify-center">
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                    Analyzing Dataset...
                                                </span>
                                            ) : (
                                                'Start Data Profiling'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Results Section */}
                        {results && (
                            <div className="bg-white rounded-lg shadow-md border border-gray-200">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">Data Profiling Report</h2>
                                            <p className="text-gray-600 mt-1">Analysis completed successfully</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                <Check className="w-4 h-4 mr-1" />
                                                Complete
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* File Information */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            File: {results?.file_info?.filename || 'Unknown'} ({results?.file_info?.type || 'Unknown'})
                                        </h3>
                                        {results?.file_info?.type === 'Excel' && results?.file_info?.sheet_names && (
                                            <p className="text-gray-600">
                                                Sheets: {results.file_info.sheet_names.join(', ')}
                                            </p>
                                        )}
                                    </div>

                                    {/* Dataset Information */}
                                    {results?.dataset_info && (
                                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                                    <Database className="w-5 h-5 text-blue-600 mr-2" />
                                                    Dataset Information
                                                </h3>
                                                <button onClick={() => toggleSection('datasetInfo')}>
                                                    {expandedSections.datasetInfo ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                                </button>
                                            </div>
                                            {expandedSections.datasetInfo && renderDatasetInfo(results.dataset_info)}
                                        </div>
                                    )}

                                    {/* Comprehensive Summary */}
                                    {results?.comprehensive_summary && (
                                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                                    <Check className="w-5 h-5 text-green-600 mr-2" />
                                                    Data Quality Summary
                                                </h3>
                                                <button onClick={() => toggleSection('summary')}>
                                                    {expandedSections.summary ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                                </button>
                                            </div>
                                            {expandedSections.summary && renderComprehensiveSummary(results.comprehensive_summary)}
                                        </div>
                                    )}

                                    {/* Data Quality Issues */}
                                    {results?.data_quality_issues && (
                                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                                    <X className="w-5 h-5 text-red-600 mr-2" />
                                                    Data Quality Issues
                                                </h3>
                                                <button onClick={() => toggleSection('qualityIssues')}>
                                                    {expandedSections.qualityIssues ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                                </button>
                                            </div>
                                            {expandedSections.qualityIssues && renderDataQualityIssues(results.data_quality_issues)}
                                        </div>
                                    )}

                                    {/* Pattern Analysis */}
                                    {results?.pattern_analysis && (
                                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                                    <Check className="w-5 h-5 text-green-600 mr-2" />
                                                    Pattern Analysis
                                                </h3>
                                                <button onClick={() => toggleSection('patterns')}>
                                                    {expandedSections.patterns ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                                </button>
                                            </div>
                                            {expandedSections.patterns && renderPatternAnalysis(results.pattern_analysis)}
                                        </div>
                                    )}

                                    {/* Relationship Analysis */}
                                    {results?.relationship_analysis && (
                                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                                    <Database className="w-5 h-5 text-purple-600 mr-2" />
                                                    Relationship Analysis
                                                </h3>
                                                <button onClick={() => toggleSection('relationships')}>
                                                    {expandedSections.relationships ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                                </button>
                                            </div>
                                            {expandedSections.relationships && renderKeyAnalysis(results.relationship_analysis)}
                                        </div>
                                    )}

                                    {/* Correlation Analysis */}
                                    {results?.correlation_analysis && (
                                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                                    <Database className="w-5 h-5 text-indigo-600 mr-2" />
                                                    Correlation Analysis
                                                </h3>
                                                <button onClick={() => toggleSection('correlations')}>
                                                    {expandedSections.correlations ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                                </button>
                                            </div>
                                            {expandedSections.correlations && renderCorrelationAnalysis(results.correlation_analysis)}
                                        </div>
                                    )}

                                    {/* Business Rules Validation */}
                                    {results?.business_rules && (
                                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                                    <X className="w-5 h-5 text-red-600 mr-2" />
                                                    Business Rules Validation
                                                </h3>
                                                <button onClick={() => toggleSection('businessRules')}>
                                                    {expandedSections.businessRules ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                                </button>
                                            </div>
                                            {expandedSections.businessRules && renderBusinessRules(results.business_rules)}
                                        </div>
                                    )}

                                    {/* Basic Column Profiling */}
                                    {results?.basic_report && (
                                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                                    <FileText className="w-5 h-5 text-blue-600 mr-2" />
                                                    Column Profiling
                                                </h3>
                                                <button onClick={() => toggleSection('columnProfiling')}>
                                                    {expandedSections.columnProfiling ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                                </button>
                                            </div>
                                            {expandedSections.columnProfiling && renderTable(results.basic_report)}
                                        </div>
                                    )}

                                    {/* Excel Sheets Analysis */}
                                    {results?.file_info?.type === 'Excel' && results?.sheets_analysis && (
                                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                                    <FileText className="w-5 h-5 text-indigo-600 mr-2" />
                                                    Sheet-by-Sheet Analysis
                                                </h3>
                                                <button onClick={() => toggleSection('sheetAnalysis')}>
                                                    {expandedSections.sheetAnalysis ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                                </button>
                                            </div>
                                            {expandedSections.sheetAnalysis && Object.entries(results.sheets_analysis).map(([sheetName, sheetAnalysis]) => (
                                                <div key={sheetName} className="mb-6 bg-gray-50 rounded-lg p-4">
                                                    <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                                                        Sheet: {sheetName}
                                                    </h4>
                                                    {sheetAnalysis.dataset_info && (
                                                        <div className="mb-4">
                                                            <h5 className="text-md font-semibold text-gray-700 mb-3">Dataset Information</h5>
                                                            {renderDatasetInfo(sheetAnalysis.dataset_info)}
                                                        </div>
                                                    )}
                                                    {sheetAnalysis.comprehensive_summary && (
                                                        <div className="mb-4">
                                                            <h5 className="text-md font-semibold text-gray-700 mb-3">Quality Summary</h5>
                                                            {renderComprehensiveSummary(sheetAnalysis.comprehensive_summary)}
                                                        </div>
                                                    )}
                                                    {sheetAnalysis.data_quality_issues && (
                                                        <div className="mb-4">
                                                            <h5 className="text-md font-semibold text-gray-700 mb-3">Quality Issues</h5>
                                                            {renderDataQualityIssues(sheetAnalysis.data_quality_issues)}
                                                        </div>
                                                    )}
                                                    {sheetAnalysis.relationship_analysis && (
                                                        <div className="mb-4">
                                                            <h5 className="text-md font-semibold text-gray-700 mb-3">Relationship Analysis</h5>
                                                            {renderKeyAnalysis(sheetAnalysis.relationship_analysis)}
                                                        </div>
                                                    )}
                                                    {sheetAnalysis.basic_profile && (
                                                        <div>
                                                            <h5 className="text-md font-semibold text-gray-700 mb-3">Column Details</h5>
                                                            {renderTable(sheetAnalysis.basic_profile)}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Overall Summary for Excel */}
                                    {results?.file_info?.type === 'Excel' && results?.overall_summary && (
                                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                                    <Database className="w-5 h-5 text-blue-600 mr-2" />
                                                    Overall File Summary
                                                </h3>
                                                <button onClick={() => toggleSection('overallSummary')}>
                                                    {expandedSections.overallSummary ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                                </button>
                                            </div>
                                            {expandedSections.overallSummary && (
                                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                                        <div className="text-xl font-bold text-blue-600">{results.overall_summary.total_rows.toLocaleString()}</div>
                                                        <div className="text-sm text-gray-600">Total Rows</div>
                                                    </div>
                                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                                        <div className="text-xl font-bold text-green-600">{results.overall_summary.total_columns}</div>
                                                        <div className="text-sm text-gray-600">Total Columns</div>
                                                    </div>
                                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                                        <div className="text-xl font-bold text-purple-600">{results.overall_summary.largest_sheet}</div>
                                                        <div className="text-sm text-gray-600">Largest Sheet</div>
                                                    </div>
                                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                                        <div className="text-xl font-bold text-orange-600">{results.overall_summary.average_quality_score}</div>
                                                        <div className="text-sm text-gray-600">Avg Quality Score</div>
                                                    </div>
                                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                                        <div className="text-xl font-bold text-yellow-600">{results.overall_summary.average_completeness}%</div>
                                                        <div className="text-sm text-gray-600">Avg Completeness</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-600">
                                            Analysis generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                                        </p>
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={downloadReport}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors flex items-center"
                                            >
                                                <Download className="w-4 h-4 mr-1" />
                                                Download Report
                                            </button>
                                            <button
                                                onClick={resetForm}
                                                className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                                            >
                                                New Analysis
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