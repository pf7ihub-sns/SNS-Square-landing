
import React, { useState, useRef, useEffect } from "react"
import axios from "axios"
import { Database, Upload, FileText, X, Check, Loader2, Download, ChevronDown, ChevronUp } from "lucide-react"

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
    const [particles, setParticles] = useState([])
    const fileInputRef = useRef(null)

    useEffect(() => {
        const generateParticles = () => {
            const newParticles = []
            for (let i = 0; i < 20; i++) {
                const seed = i * 0.618033988749895
                const left = ((seed * 9301) % 100)
                const top = ((seed * 49297) % 100)
                const delay = ((seed * 233280) % 5)
                const duration = 3 + ((seed * 982451653) % 4)
                newParticles.push({
                    left: Math.max(0, Math.min(100, left)),
                    top: Math.max(0, Math.min(100, top)),
                    delay: Math.max(0, delay),
                    duration: Math.max(3, Math.min(7, duration)),
                })
            }
            setParticles(newParticles)
        }
        generateParticles()
    }, [])

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
        <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-auto border border-gray-700">
            <table className="w-full text-sm text-gray-200">
                <thead>
                    <tr className="bg-gray-800">
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
                            <th key={header} className="px-3 py-2 text-left font-semibold text-xs border-b border-gray-700">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {(Array.isArray(report) ? report : []).map((row, index) => (
                        <tr key={index} className="hover:bg-gray-800">
                            <td className="px-3 py-2 border-b border-gray-700 text-xs font-medium">{row['Column Name']}</td>
                            <td className="px-3 py-2 border-b border-gray-700 text-xs">{row['Count the values']}</td>
                            <td className="px-3 py-2 border-b border-gray-700 text-xs">{row['Data Type']}</td>
                            <td className="px-3 py-2 border-b border-gray-700 text-xs">{row['Min'] ?? 'N/A'}</td>
                            <td className="px-3 py-2 border-b border-gray-700 text-xs">{row['Max'] ?? 'N/A'}</td>
                            <td className="px-3 py-2 border-b border-gray-700 text-xs">{row['Mean'] ?? 'N/A'}</td>
                            <td className="px-3 py-2 border-b border-gray-700 text-xs">{row['Std Dev'] ?? 'N/A'}</td>
                            <td className="px-3 py-2 border-b border-gray-700 text-xs">{row['Null Values Count']}</td>
                            <td className="px-3 py-2 border-b border-gray-700 text-xs">{row['Completeness %']}%</td>
                            <td className="px-3 py-2 border-b border-gray-700 text-xs">{row['Unique count']}</td>
                            <td className="px-3 py-2 border-b border-gray-700 text-xs">{row['Uniqueness %']}%</td>
                            <td className="px-3 py-2 border-b border-gray-700 text-xs">
                                <span className={`px-2 py-1 rounded text-xs ${row['Primary Key'] === 'Yes' ? 'bg-green-600/30 text-green-400' : 'bg-gray-600/30 text-gray-400'}`}>
                                    {row['Primary Key']}
                                </span>
                            </td>
                            <td className="px-3 py-2 border-b border-gray-700 text-xs">
                                <span className={`px-2 py-1 rounded text-xs ${row['Foreign Key'] === 'Yes' ? 'bg-blue-600/30 text-blue-400' : 'bg-gray-600/30 text-gray-400'}`}>
                                    {row['Foreign Key']}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {(!Array.isArray(report) || report.length === 0) && (
                <div className="text-gray-400 text-sm mt-3">No rows to display.</div>
            )}
        </div>
    )

    const renderDataQualityIssues = (issues) => (
        <div className="space-y-4">
            {issues.missing_values && Object.keys(issues.missing_values).length > 0 && (
                <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-4">
                    <h4 className="text-red-400 font-semibold mb-2">Missing Values</h4>
                    {Object.entries(issues.missing_values).map(([col, data]) => (
                        <div key={col} className="text-sm text-gray-300">
                            <span className="font-medium">{col}:</span> {data.count} missing ({data.percentage}%)
                        </div>
                    ))}
                </div>
            )}
            {issues.duplicate_rows > 0 && (
                <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4">
                    <h4 className="text-yellow-400 font-semibold mb-2">Duplicate Rows</h4>
                    <div className="text-sm text-gray-300">{issues.duplicate_rows} duplicate rows found</div>
                </div>
            )}
            {issues.outliers && Object.keys(issues.outliers).length > 0 && (
                <div className="bg-orange-900/30 border border-orange-600/50 rounded-lg p-4">
                    <h4 className="text-orange-400 font-semibold mb-2">Outliers</h4>
                    {Object.entries(issues.outliers).map(([col, data]) => (
                        <div key={col} className="text-sm text-gray-300">
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
                <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4">
                    <h4 className="text-blue-400 font-semibold mb-2">Email Patterns</h4>
                    {Object.entries(patterns.email_patterns).map(([col, data]) => (
                        <div key={col} className="text-sm text-gray-300">
                            <span className="font-medium">{col}:</span> {data.count} emails ({data.percentage}%)
                        </div>
                    ))}
                </div>
            )}
            {patterns.phone_patterns && Object.keys(patterns.phone_patterns).length > 0 && (
                <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4">
                    <h4 className="text-green-400 font-semibold mb-2">Phone Patterns</h4>
                    {Object.entries(patterns.phone_patterns).map(([col, data]) => (
                        <div key={col} className="text-sm text-gray-300">
                            <span className="font-medium">{col}:</span> {data.count} phone numbers ({data.percentage}%)
                        </div>
                    ))}
                </div>
            )}
            {patterns.date_patterns && Object.keys(patterns.date_patterns).length > 0 && (
                <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-4">
                    <h4 className="text-purple-400 font-semibold mb-2">Date Patterns</h4>
                    {Object.entries(patterns.date_patterns).map(([col, patterns]) => (
                        <div key={col} className="text-sm text-gray-300">
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
                <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4">
                    <h4 className="text-green-400 font-semibold mb-2">Potential Primary Keys</h4>
                    {Object.entries(keyAnalysis.potential_primary_keys).map(([col, data]) => (
                        <div key={col} className="text-sm text-gray-300">
                            <span className="font-medium">{col}:</span>
                            <span className={`ml-2 px-2 py-1 rounded text-xs ${data.confidence === 'High' ? 'bg-green-600/30 text-green-400' :
                                    data.confidence === 'Medium' ? 'bg-yellow-600/30 text-yellow-400' :
                                        'bg-red-600/30 text-red-400'
                                }`}>
                                {data.confidence} confidence
                            </span>
                        </div>
                    ))}
                </div>
            )}
            {keyAnalysis.potential_foreign_keys && Object.keys(keyAnalysis.potential_foreign_keys).length > 0 && (
                <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4">
                    <h4 className="text-blue-400 font-semibold mb-2">Potential Foreign Keys</h4>
                    {Object.entries(keyAnalysis.potential_foreign_keys).map(([col, data]) => (
                        <div key={col} className="text-sm text-gray-300">
                            <span className="font-medium">{col}:</span>
                            <span className="ml-2 px-2 py-1 rounded text-xs bg-blue-600/30 text-blue-400">
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
                <div className="bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border border-blue-600/50 rounded-lg p-4">
                    <div className="text-3xl font-bold text-blue-400">{summary.overall_quality_score}</div>
                    <div className="text-sm text-gray-400">Overall Quality Score</div>
                </div>
                <div className="bg-gradient-to-r from-green-600/30 to-emerald-600/30 border border-green-600/50 rounded-lg p-4">
                    <div className="text-3xl font-bold text-green-400">{summary.completeness_score}%</div>
                    <div className="text-sm text-gray-400">Completeness Score</div>
                </div>
                <div className="bg-gradient-to-r from-purple-600/30 to-violet-600/30 border border-purple-600/50 rounded-lg p-4">
                    <div className="text-3xl font-bold text-purple-400">{summary.data_health}</div>
                    <div className="text-sm text-gray-400">Data Health Status</div>
                </div>
            </div>
            {summary.key_insights && summary.key_insights.length > 0 && (
                <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-3">Key Insights</h4>
                    <ul className="space-y-2">
                        {summary.key_insights.map((insight, index) => (
                            <li key={index} className="flex items-center text-gray-300">
                                <Check className="w-4 h-4 text-green-400 mr-2" />
                                {insight}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {summary.recommendations && summary.recommendations.length > 0 && (
                <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-3">Recommendations</h4>
                    <ul className="space-y-2">
                        {summary.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-center text-gray-300">
                                <Database className="w-4 h-4 text-yellow-400 mr-2" />
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
                <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400">{datasetInfo.dataset_overview.total_rows.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Total Rows</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400">{datasetInfo.dataset_overview.total_columns}</div>
                    <div className="text-sm text-gray-400">Total Columns</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-400">{datasetInfo.dataset_overview.memory_usage_mb} MB</div>
                    <div className="text-sm text-gray-400">Memory Usage</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-400">{datasetInfo.sparsity_analysis.sparsity_percentage}%</div>
                    <div className="text-sm text-gray-400">Sparsity</div>
                </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Column Type Distribution</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(datasetInfo.column_type_distribution).map(([type, count]) => (
                        <div key={type} className="bg-gray-800 rounded-lg p-3">
                            <div className="text-xl font-bold text-white">{count}</div>
                            <div className="text-sm text-gray-400 capitalize">{type}</div>
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
                    <div key={ruleType} className="bg-red-900/30 border border-red-600/50 rounded-lg p-4">
                        <h4 className="text-red-400 font-semibold mb-2 capitalize">{ruleType.replace('_', ' ')} Violations</h4>
                        {Object.entries(rules).map(([col, violations]) => (
                            <div key={col} className="text-sm text-gray-300 mb-2">
                                <span className="font-medium">{col}:</span> {violations.violations} violations ({violations.percentage}%)
                                <div className="text-xs text-gray-400 ml-4">Rule: {violations.rule}</div>
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
                <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4">
                    <h4 className="text-blue-400 font-semibold mb-2">High Correlations</h4>
                    <div className="space-y-2">
                        {correlations.high_correlations.map((corr, index) => (
                            <div key={index} className="text-sm text-gray-300">
                                <span className="font-medium">{corr.column1}</span> ↔ <span className="font-medium">{corr.column2}</span>
                                <span className={`ml-2 px-2 py-1 rounded text-xs ${corr.strength === 'Strong' ? 'bg-red-600/30 text-red-400' : 'bg-yellow-600/30 text-yellow-400'
                                    }`}>
                                    {corr.correlation} ({corr.type} {corr.strength})
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {correlations.categorical_correlations && Object.keys(correlations.categorical_correlations).length > 0 && (
                <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4">
                    <h4 className="text-green-400 font-semibold mb-2">Categorical Correlations (Cramér's V)</h4>
                    <div className="space-y-2">
                        {Object.entries(correlations.categorical_correlations).map(([pair, stats]) => (
                            <div key={pair} className="text-sm text-gray-300">
                                <span className="font-medium">{pair}:</span> {stats.cramers_v} ({stats.strength})
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 font-sans relative overflow-hidden">
            {/* Particle Animation */}
            {particles.map((particle, index) => (
                <div
                    key={index}
                    className="absolute bg-blue-400/30 rounded-full w-1 h-1 animate-particle"
                    style={{
                        left: `${particle.left}%`,
                        top: `${particle.top}%`,
                        animationDelay: `${particle.delay}s`,
                        animationDuration: `${particle.duration}s`,
                    }}
                />
            ))}

            <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-6 shadow-lg">
                        <Database className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Data Profiling Tool
                    </h1>
                    <p className="text-lg text-gray-300 max-w-xl mx-auto">
                        Upload your CSV or Excel dataset to generate a comprehensive profiling report
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-center mb-12">
                    <div className="flex items-center space-x-4">
                        {[1, 2].map((stepNum) => (
                            <div key={stepNum} className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${step >= stepNum
                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                                        : 'bg-gray-700 text-gray-400'
                                    }`}>
                                    {step > stepNum ? <Check className="w-5 h-5" /> : stepNum}
                                </div>
                                {stepNum < 2 && (
                                    <div className={`h-1 w-16 transition-all duration-300 ${step > stepNum ? 'bg-blue-500' : 'bg-gray-700'
                                        }`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upload Section */}
                {!results && (
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 mb-8 shadow-lg transition-all duration-300 hover:shadow-blue-500/20">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold text-white flex items-center">
                                <Upload className="w-6 h-6 text-blue-400 mr-3" />
                                Upload Dataset
                            </h2>
                        </div>
                        <div
                            className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 transition-all duration-300"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <input
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                className="hidden"
                                id="fileUpload"
                            />
                            <label
                                htmlFor="fileUpload"
                                className="cursor-pointer flex flex-col items-center justify-center"
                            >
                                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                                <p className="text-gray-300 mb-2">Drag and drop a CSV or Excel file, or click to browse</p>
                                <button
                                    className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-all duration-300 shadow-md"
                                >
                                    Browse Files
                                </button>
                            </label>
                            {file && (
                                <div className="mt-4 text-gray-300 flex items-center justify-center">
                                    <FileText className="w-5 h-5 mr-2" />
                                    <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                </div>
                            )}
                        </div>
                        {error && (
                            <div className="mt-4 bg-red-600/20 text-red-400 p-4 rounded-lg border border-red-600/50">
                                {error}
                            </div>
                        )}
                        <button
                            className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            onClick={handleUpload}
                            disabled={!file || loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5 mr-3" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5 mr-3" />
                                    Analyze Dataset
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Results Section */}
                {results && (
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 mb-8 shadow-lg transition-all duration-300 hover:shadow-blue-500/20">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-white flex items-center">
                                <FileText className="w-6 h-6 text-blue-400 mr-3" />
                                Profiling Report
                            </h2>
                            <div className="flex gap-3">
                                <button
                                    className="flex items-center bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 text-sm"
                                    onClick={() => setShowReport(!showReport)}
                                >
                                    {showReport ? <X className="w-4 h-4 mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                                    {showReport ? 'Hide Report' : 'Show Report'}
                                </button>
                                <button
                                    className="flex items-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 text-sm"
                                    onClick={downloadReport}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Report
                                </button>
                                <button
                                    className="flex items-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 text-sm"
                                    onClick={resetForm}
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    New File
                                </button>
                            </div>
                        </div>

                        {showReport && (
                            <div className="space-y-6">
                                {/* File Information */}
                                <div className="bg-gray-900 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        File: {results?.file_info?.filename || 'Unknown'} ({results?.file_info?.type || 'Unknown'})
                                    </h3>
                                    {results?.file_info?.type === 'Excel' && results?.file_info?.sheet_names && (
                                        <p className="text-gray-400">
                                            Sheets: {results.file_info.sheet_names.join(', ')}
                                        </p>
                                    )}
                                </div>

                                {/* Dataset Information */}
                                {results?.dataset_info && (
                                    <div className="bg-gray-900 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-xl font-semibold text-white flex items-center">
                                                <Database className="w-5 h-5 text-blue-400 mr-2" />
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
                                    <div className="bg-gray-900 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-xl font-semibold text-white flex items-center">
                                                <Check className="w-5 h-5 text-green-400 mr-2" />
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
                                    <div className="bg-gray-900 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-xl font-semibold text-white flex items-center">
                                                <X className="w-5 h-5 text-red-400 mr-2" />
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
                                    <div className="bg-gray-900 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-xl font-semibold text-white flex items-center">
                                                <Check className="w-5 h-5 text-green-400 mr-2" />
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
                                    <div className="bg-gray-900 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-xl font-semibold text-white flex items-center">
                                                <Database className="w-5 h-5 text-purple-400 mr-2" />
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
                                    <div className="bg-gray-900 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-xl font-semibold text-white flex items-center">
                                                <Database className="w-5 h-5 text-indigo-400 mr-2" />
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
                                    <div className="bg-gray-900 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-xl font-semibold text-white flex items-center">
                                                <X className="w-5 h-5 text-red-400 mr-2" />
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
                                    <div className="bg-gray-900 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-xl font-semibold text-white flex items-center">
                                                <FileText className="w-5 h-5 text-blue-400 mr-2" />
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
                                    <div className="bg-gray-900 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-xl font-semibold text-white flex items-center">
                                                <FileText className="w-5 h-5 text-indigo-400 mr-2" />
                                                Sheet-by-Sheet Analysis
                                            </h3>
                                            <button onClick={() => toggleSection('sheetAnalysis')}>
                                                {expandedSections.sheetAnalysis ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                            </button>
                                        </div>
                                        {expandedSections.sheetAnalysis && Object.entries(results.sheets_analysis).map(([sheetName, sheetAnalysis]) => (
                                            <div key={sheetName} className="mb-6 bg-gray-800/50 rounded-lg p-4">
                                                <h4 className="text-lg font-semibold text-white border-b border-gray-700 pb-2 mb-4">
                                                    Sheet: {sheetName}
                                                </h4>
                                                {sheetAnalysis.dataset_info && (
                                                    <div className="mb-4">
                                                        <h5 className="text-md font-semibold text-gray-300 mb-3">Dataset Information</h5>
                                                        {renderDatasetInfo(sheetAnalysis.dataset_info)}
                                                    </div>
                                                )}
                                                {sheetAnalysis.comprehensive_summary && (
                                                    <div className="mb-4">
                                                        <h5 className="text-md font-semibold text-gray-300 mb-3">Quality Summary</h5>
                                                        {renderComprehensiveSummary(sheetAnalysis.comprehensive_summary)}
                                                    </div>
                                                )}
                                                {sheetAnalysis.data_quality_issues && (
                                                    <div className="mb-4">
                                                        <h5 className="text-md font-semibold text-gray-300 mb-3">Quality Issues</h5>
                                                        {renderDataQualityIssues(sheetAnalysis.data_quality_issues)}
                                                    </div>
                                                )}
                                                {sheetAnalysis.relationship_analysis && (
                                                    <div className="mb-4">
                                                        <h5 className="text-md font-semibold text-gray-300 mb-3">Relationship Analysis</h5>
                                                        {renderKeyAnalysis(sheetAnalysis.relationship_analysis)}
                                                    </div>
                                                )}
                                                {sheetAnalysis.basic_profile && (
                                                    <div>
                                                        <h5 className="text-md font-semibold text-gray-300 mb-3">Column Details</h5>
                                                        {renderTable(sheetAnalysis.basic_profile)}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Overall Summary for Excel */}
                                {results?.file_info?.type === 'Excel' && results?.overall_summary && (
                                    <div className="bg-gray-900 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-xl font-semibold text-white flex items-center">
                                                <Database className="w-5 h-5 text-blue-400 mr-2" />
                                                Overall File Summary
                                            </h3>
                                            <button onClick={() => toggleSection('overallSummary')}>
                                                {expandedSections.overallSummary ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                            </button>
                                        </div>
                                        {expandedSections.overallSummary && (
                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                <div className="bg-gray-800 rounded-lg p-3">
                                                    <div className="text-xl font-bold text-blue-400">{results.overall_summary.total_rows.toLocaleString()}</div>
                                                    <div className="text-sm text-gray-400">Total Rows</div>
                                                </div>
                                                <div className="bg-gray-800 rounded-lg p-3">
                                                    <div className="text-xl font-bold text-green-400">{results.overall_summary.total_columns}</div>
                                                    <div className="text-sm text-gray-400">Total Columns</div>
                                                </div>
                                                <div className="bg-gray-800 rounded-lg p-3">
                                                    <div className="text-xl font-bold text-purple-400">{results.overall_summary.largest_sheet}</div>
                                                    <div className="text-sm text-gray-400">Largest Sheet</div>
                                                </div>
                                                <div className="bg-gray-800 rounded-lg p-3">
                                                    <div className="text-xl font-bold text-orange-400">{results.overall_summary.average_quality_score}</div>
                                                    <div className="text-sm text-gray-400">Avg Quality Score</div>
                                                </div>
                                                <div className="bg-gray-800 rounded-lg p-3">
                                                    <div className="text-xl font-bold text-yellow-400">{results.overall_summary.average_completeness}%</div>
                                                    <div className="text-sm text-gray-400">Avg Completeness</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
        @keyframes particle {
          0% { transform: translateY(0) scale(1); opacity: 0.5; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }
        .animate-particle {
          animation: particle linear infinite;
        }
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(100, 100, 100, 0.7);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(150, 150, 150, 0.9);
        }
      `}</style>
        </div>
    )
}