import { Sparkles, X, Info, FileText } from 'lucide-react';

export default function ProductSummaryModal({ productAnalysis, onClose }) {
    // Mock product analysis data (same as in ProjectDetails.jsx for consistency)
    const mockProductAnalysis = {
        elevator_pitch: "An AI-powered lead generation and qualification platform that automates prospecting, scoring, and outreach to help sales teams focus on high-value opportunities.",
        core_problem: "Sales teams waste time on unqualified leads and manual outreach, resulting in low conversion rates and inefficient resource allocation.",
        key_differentiators: [
            "AI-powered lead scoring with 95% accuracy",
            "Automated personalized outreach at scale",
            "Real-time conversation intelligence",
            "Seamless Salesforce integration"
        ],
        key_features: [
            { feature_name: "Smart Lead Scoring", benefit: "Prioritize high-value prospects automatically", priority: "must_have" },
            { feature_name: "Automated Outreach", benefit: "Personalized emails sent automatically", priority: "must_have" },
            { feature_name: "Conversation AI", benefit: "Intelligent response handling", priority: "nice_to_have" }
        ],
        value_propositions: [
            "Increase conversion rates by 3x",
            "Reduce manual prospecting time by 80%",
            "Improve lead quality with AI scoring",
            "Scale outreach without adding headcount"
        ],
        target_industries: ["SaaS", "Technology", "Financial Services", "Healthcare"],
        ideal_customer_profile: {
            company_profile: {
                company_size_range: "50-500 employees"
            }
        },
        decision_makers: ["VP Sales", "Sales Director", "Chief Revenue Officer"],
        documents_analyzed: productAnalysis?.documents_analyzed || 2,
        analyzed_at: new Date().toISOString()
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto">
                <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 flex justify-between items-center z-10">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6" />
                        <h3 className="text-2xl font-bold">Product Analysis</h3>
                    </div>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* Elevator Pitch */}
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-200">
                        <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                            <Info className="w-5 h-5 text-purple-600" />
                            Product Overview
                        </h4>
                        <p className="text-gray-800 text-lg leading-relaxed">{mockProductAnalysis.elevator_pitch}</p>
                    </div>

                    {/* Core Problem */}
                    <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-3">Problem We Solve</h4>
                        <p className="text-gray-700">{mockProductAnalysis.core_problem}</p>
                    </div>

                    {/* Key Differentiators */}
                    <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-4">Key Differentiators</h4>
                        <div className="grid grid-cols-1 gap-3">
                            {mockProductAnalysis.key_differentiators.map((diff, idx) => (
                                <div key={idx} className="flex items-start gap-3 bg-green-50 p-3 rounded-lg border border-green-200">
                                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-800">{diff}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Key Features */}
                    <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-4">Key Features</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {mockProductAnalysis.key_features.map((feature, idx) => (
                                <div key={idx} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <div className="font-medium text-blue-900 mb-1">{feature.feature_name}</div>
                                    <div className="text-sm text-gray-700">{feature.benefit}</div>
                                    <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                                        feature.priority === 'must_have' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {feature.priority.replace('_', ' ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Value Propositions */}
                    <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-4">Value Propositions</h4>
                        <ul className="space-y-2">
                            {mockProductAnalysis.value_propositions.map((vp, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <span className="text-purple-600 font-bold text-lg">•</span>
                                    <span className="text-gray-700">{vp}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Target Industries */}
                    <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-3">Target Industries</h4>
                        <div className="flex flex-wrap gap-2">
                            {mockProductAnalysis.target_industries.map((industry, idx) => (
                                <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                    {industry}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* ICP Summary */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200">
                        <h4 className="font-semibold text-gray-900 mb-4">Ideal Customer Profile</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Company Size</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {mockProductAnalysis.ideal_customer_profile.company_profile.company_size_range}
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Decision Makers</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {mockProductAnalysis.decision_makers.join(', ')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Metadata */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-600">
                        <div className="flex justify-between items-center">
                            <span>Documents Analyzed: {mockProductAnalysis.documents_analyzed}</span>
                            <span>Analyzed: {new Date(mockProductAnalysis.analyzed_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}