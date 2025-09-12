import { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Brain, FileText, MessageSquare, RefreshCw, Loader } from 'lucide-react';

const LogicValidationAgent = () => {
    const [text, setText] = useState('');
    const [analysisType, setAnalysisType] = useState('comprehensive');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const analysisTypes = [
        {
            value: 'comprehensive',
            label: 'Comprehensive Analysis',
            description: 'Full logical analysis including structure, fallacies, and consistency'
        },
        {
            value: 'fallacy',
            label: 'Fallacy Detection',
            description: 'Focus on detecting logical fallacies'
        },
        {
            value: 'structure',
            label: 'Structure Analysis',
            description: 'Analyze logical structure and argumentation'
        }
    ];

    const handleValidate = async () => {
        if (!text.trim()) {
            setError('Please enter text to validate');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('https://32e913875221.ngrok-free.app/logic-validation/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text.trim(),
                    analysis_type: analysisType,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Validation failed');
            }

            const data = await response.json();
            setResult(data);
        } catch (error) {
            setError(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setText('');
        setResult(null);
        setError(null);
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return 'text-red-600 bg-red-50 border-red-200';
            case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getConfidenceColor = (score) => {
        if (score >= 0.8) return 'text-green-600';
        if (score >= 0.6) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-6 pt-44">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Brain className="w-8 h-8 text-purple-600" />
                        <h1 className="text-3xl font-bold text-gray-800">Logic Validation Agent</h1>
                    </div>
                    <p className="text-gray-600">
                        Analyze text for logical consistency, detect fallacies, and evaluate argumentation structure
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Text Analysis Input
                        </h2>

                        {/* Analysis Type Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Analysis Type
                            </label>
                            <div className="space-y-2">
                                {analysisTypes.map((type) => (
                                    <label key={type.value} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="analysisType"
                                            value={type.value}
                                            checked={analysisType === type.value}
                                            onChange={(e) => setAnalysisType(e.target.value)}
                                            className="mt-1"
                                        />
                                        <div>
                                            <div className="font-medium text-gray-800">{type.label}</div>
                                            <div className="text-sm text-gray-600">{type.description}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Text Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Text to Analyze
                            </label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter the text you want to validate for logical consistency..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 h-48 resize-none"
                            />
                            <div className="text-sm text-gray-500 mt-1">
                                {text.length} characters
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleValidate}
                                disabled={loading}
                                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <Loader className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Brain className="w-4 h-4" />
                                )}
                                {loading ? 'Analyzing...' : 'Validate Logic'}
                            </button>
                            <button
                                onClick={resetForm}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reset
                            </button>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                <span className="text-red-700 text-sm">{error}</span>
                            </div>
                        )}
                    </div>

                    {/* Results Section */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            Analysis Results
                        </h2>

                        {!result ? (
                            <div className="text-center text-gray-500 py-12">
                                <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">Enter text and click "Validate Logic" to see analysis</p>
                                <p className="text-sm mt-2">The agent will check for logical consistency, fallacies, and argumentation structure</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Overall Result */}
                                <div className={`p-4 rounded-lg border-2 ${result.is_valid
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-red-50 border-red-200'
                                    }`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        {result.is_valid ? (
                                            <CheckCircle className="w-6 h-6 text-green-600" />
                                        ) : (
                                            <XCircle className="w-6 h-6 text-red-600" />
                                        )}
                                        <div>
                                            <h3 className="font-semibold text-lg">
                                                {result.is_valid ? 'Logically Valid' : 'Issues Detected'}
                                            </h3>
                                            <p className={`text-sm ${getConfidenceColor(result.confidence_score)}`}>
                                                Confidence: {Math.round(result.confidence_score * 100)}%
                                            </p>
                                        </div>
                                    </div>
                                    {result.analysis.overall_assessment && (
                                        <p className="text-gray-700">{result.analysis.overall_assessment}</p>
                                    )}
                                </div>

                                {/* Analysis Details */}
                                <div className="grid grid-cols-2 gap-4">
                                    {result.analysis.text_length && (
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <div className="text-sm text-gray-600">Text Length</div>
                                            <div className="font-semibold">{result.analysis.text_length} chars</div>
                                        </div>
                                    )}
                                    {result.analysis.sentences_analyzed && (
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <div className="text-sm text-gray-600">Sentences</div>
                                            <div className="font-semibold">{result.analysis.sentences_analyzed}</div>
                                        </div>
                                    )}
                                    {result.analysis.fallacies_found !== undefined && (
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <div className="text-sm text-gray-600">Fallacies Found</div>
                                            <div className="font-semibold">{result.analysis.fallacies_found}</div>
                                        </div>
                                    )}
                                    {result.analysis.issues_found !== undefined && (
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <div className="text-sm text-gray-600">Issues Found</div>
                                            <div className="font-semibold">{result.analysis.issues_found}</div>
                                        </div>
                                    )}
                                </div>

                                {/* Detected Issues */}
                                {result.detected_issues.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-3">Detected Issues</h4>
                                        <div className="space-y-2">
                                            {result.detected_issues.map((issue, index) => (
                                                <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(issue.severity)}`}>
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <div className="font-medium capitalize">{issue.type.replace('_', ' ')}</div>
                                                            <div className="text-sm mt-1">{issue.description}</div>
                                                            <div className="text-xs mt-1 opacity-75">Location: {issue.location}</div>
                                                        </div>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                                                            issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-blue-100 text-blue-700'
                                                            }`}>
                                                            {issue.severity}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Analysis Insights */}
                                {result.analysis.logical_strengths && result.analysis.logical_strengths.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-green-800 mb-3">Logical Strengths</h4>
                                        <ul className="list-disc list-inside space-y-1 text-green-700">
                                            {result.analysis.logical_strengths.map((strength, index) => (
                                                <li key={index} className="text-sm">{strength}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {result.analysis.logical_weaknesses && result.analysis.logical_weaknesses.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-red-800 mb-3">Logical Weaknesses</h4>
                                        <ul className="list-disc list-inside space-y-1 text-red-700">
                                            {result.analysis.logical_weaknesses.map((weakness, index) => (
                                                <li key={index} className="text-sm">{weakness}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Recommendations */}
                                {result.recommendations.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-blue-800 mb-3">Recommendations</h4>
                                        <ul className="list-disc list-inside space-y-1 text-blue-700">
                                            {result.recommendations.map((rec, index) => (
                                                <li key={index} className="text-sm">{rec}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogicValidationAgent;