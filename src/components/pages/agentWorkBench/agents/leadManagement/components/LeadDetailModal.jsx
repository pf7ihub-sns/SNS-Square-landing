import { User, X, CheckCircle, AlertCircle, Lightbulb, MessageSquare, TrendingUp, Target } from 'lucide-react';

export default function LeadDetailModal({ lead, onClose }) {
    // Use real data from lead object, fallback to defaults if not available
    const qualificationScore = lead.qualification_score || 0;
    const qualificationGrade = lead.qualification_grade || 'low';
    const scoreBreakdown = lead.score_breakdown || {};
    const reasoning = lead.qualification_reasoning || '';
    const recommendations = lead.recommendations || {};
    const nextSteps = recommendations.next_steps || [];
    const talkingPoints = recommendations.talking_points || [];
    const risks = recommendations.risks || [];

    // Parse score breakdown for display
    const displayScores = Object.entries(scoreBreakdown).reduce((acc, [key, value]) => {
        if (typeof value === 'number') {
            acc[key] = value;
        }
        return acc;
    }, {});

    // Determine grade color
    const getGradeColor = (grade) => {
        switch(grade) {
            case 'high':
                return { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-700', label: '🔥 HOT' };
            case 'medium':
                return { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-700', label: '⚡ WARM' };
            case 'low':
                return { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700', label: '❄️ COLD' };
            default:
                return { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-700', label: 'N/A' };
        }
    };

    const gradeStyle = getGradeColor(qualificationGrade);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pt-25">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <User className="w-6 h-6" />
                        <div>
                            <h3 className="text-xl font-bold">{lead.name}</h3>
                            <p className="text-blue-100 text-sm">{lead.title} at {lead.company}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Qualification Score Card */}
                    <div className={`${gradeStyle.bg} border-2 ${gradeStyle.border} p-6 rounded-xl`}>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className={`text-sm font-medium ${gradeStyle.text}`}>Qualification Grade</p>
                                <p className={`text-4xl font-bold ${gradeStyle.text} mt-2`}>{qualificationScore.toFixed(1)}/100</p>
                            </div>
                            <div className="text-right">
                                <p className={`text-2xl font-bold ${gradeStyle.text}`}>{gradeStyle.label}</p>
                                <p className="text-xs text-gray-600 mt-2 capitalize">{qualificationGrade} priority lead</p>
                            </div>
                        </div>
                        <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all ${
                                    qualificationGrade === 'high' ? 'bg-red-600' :
                                    qualificationGrade === 'medium' ? 'bg-orange-600' : 'bg-blue-600'
                                }`}
                                style={{ width: `${qualificationScore}%` }}
                            />
                        </div>
                    </div>

                    {/* Reasoning */}
                    {reasoning && (
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border-2 border-indigo-200">
                            <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-indigo-600" />
                                Qualification Analysis
                            </h4>
                            <p className="text-gray-800 leading-relaxed">{reasoning}</p>
                        </div>
                    )}

                    {/* Contact Information */}
                    <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-4">Contact Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="text-sm font-medium text-gray-900">{lead.email || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Phone</p>
                                <p className="text-sm font-medium text-gray-900">{lead.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Company</p>
                                <p className="text-sm font-medium text-gray-900">{lead.company || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Title</p>
                                <p className="text-sm font-medium text-gray-900">{lead.title || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Industry</p>
                                <p className="text-sm font-medium text-gray-900">{lead.industry || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Location</p>
                                <p className="text-sm font-medium text-gray-900">{lead.location || 'N/A'}</p>
                            </div>
                            {lead.company_size && (
                                <div>
                                    <p className="text-sm text-gray-600">Company Size</p>
                                    <p className="text-sm font-medium text-gray-900">{lead.company_size} employees</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Score Breakdown */}
                    {Object.keys(displayScores).length > 0 && (
                        <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                Score Breakdown
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(displayScores).map(([key, value]) => (
                                    <div key={key} className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 capitalize">{key.replace(/_/g, ' ')}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="w-full h-2 bg-gray-200 rounded-full">
                                                <div
                                                    className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                                                    style={{ width: `${Math.min(value, 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 min-w-[3rem]">
                                                {typeof value === 'number' ? value.toFixed(1) : value}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recommendations */}
                    {nextSteps.length > 0 && (
                        <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5 text-purple-600" />
                                Next Steps
                            </h4>
                            <ul className="space-y-2">
                                {nextSteps.map((step, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Talking Points */}
                    {talkingPoints.length > 0 && (
                        <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-yellow-600" />
                                Talking Points
                            </h4>
                            <ul className="space-y-2">
                                {talkingPoints.map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Risk Assessment */}
                    {risks.length > 0 && (
                        <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                Risks & Considerations
                            </h4>
                            <div className="space-y-2">
                                {risks.map((risk, idx) => (
                                    <div key={idx} className="flex items-start gap-3 bg-red-50 p-3 rounded-lg border border-red-200">
                                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-gray-700">{risk}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Additional Lead Info */}
                    {(lead.tech_stack || lead.interest_tags) && (
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-4">Additional Information</h4>
                            <div className="space-y-3">
                                {lead.tech_stack && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-2">Tech Stack</p>
                                        <p className="text-sm text-gray-800">{lead.tech_stack}</p>
                                    </div>
                                )}
                                {lead.interest_tags && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-2">Interest Tags</p>
                                        <p className="text-sm text-gray-800">{lead.interest_tags}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-600">
                        <div className="flex justify-between items-center">
                            <span>Qualified: {lead.qualified_at ? new Date(lead.qualified_at).toLocaleString() : 'Not yet qualified'}</span>
                            {lead.lead_source && <span>Source: {lead.lead_source}</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}