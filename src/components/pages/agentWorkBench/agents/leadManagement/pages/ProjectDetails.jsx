import { Zap, Users, Loader, ChevronRight, Upload, Target, Sparkles, Info, FileText, Briefcase, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function ProjectDetails({ projectDetails, selectedProject, loading, handleGenerateLeads, setCurrentView, loadProjectLeads }) {
    const [showUploadLeads, setShowUploadLeads] = useState(false);
    const [showProductSummary, setShowProductSummary] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [qualifying, setQualifying] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');

    const API_BASE_URL = 'http://localhost:8000/lead-generation';

    const handleUploadLeads = async () => {
        if (!uploadFile || !selectedProject) {
            alert('Please select a CSV file');
            return;
        }
        
        setUploading(true);
        setUploadStatus('Uploading CSV...');
        
        try {
            const formData = new FormData();
            formData.append('file', uploadFile);
            formData.append('project_id', selectedProject);
            
            // Step 1: Upload CSV
            const uploadResponse = await fetch(`${API_BASE_URL}/leads/upload-csv`, {
                method: 'POST',
                body: formData
            });
            
            if (!uploadResponse.ok) {
                const error = await uploadResponse.json();
                throw new Error(error.detail || 'Upload failed');
            }
            
            const uploadData = await uploadResponse.json();
            console.log('Upload successful:', uploadData);
            
            if (uploadData.status === 'success') {
                setUploadStatus('Qualifying leads based on product fit...');
                setUploading(false);
                setQualifying(true);
                
                // Step 2: Qualify the uploaded leads
                const qualifyResponse = await fetch(
                    `${API_BASE_URL}/leads/qualify?project_id=${selectedProject}`,
                    {
                        method: 'POST'
                    }
                );
                
                if (!qualifyResponse.ok) {
                    const error = await qualifyResponse.json();
                    throw new Error(error.detail || 'Qualification failed');
                }
                
                const qualifyData = await qualifyResponse.json();
                console.log('Qualification complete:', qualifyData);
                
                // Show success message
                alert(`Successfully uploaded and qualified ${qualifyData.summary.total_qualified} leads!\n\n` +
                      `High Priority: ${qualifyData.summary.high_priority}\n` +
                      `Medium Priority: ${qualifyData.summary.medium_priority}\n` +
                      `Low Priority: ${qualifyData.summary.low_priority}`);
                
                setShowUploadLeads(false);
                setUploadFile(null);
                setUploadStatus('');
                
                // Reload project details and leads
                if (loadProjectLeads) {
                    await loadProjectLeads(selectedProject);
                }
                
                // Wait a moment then automatically navigate to leads view
                setTimeout(() => {
                    setCurrentView('leads');
                }, 1000);
            } else {
                throw new Error(uploadData.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
            setUploadStatus('');
        } finally {
            setUploading(false);
            setQualifying(false);
        }
    };

    const UploadLeadsModal = () => {
        if (!showUploadLeads) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Upload & Qualify Leads</h3>
                        <button 
                            onClick={() => setShowUploadLeads(false)} 
                            disabled={uploading || qualifying}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Status message */}
                    {uploadStatus && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                            <Loader className="w-4 h-4 animate-spin text-blue-600" />
                            <p className="text-sm text-blue-700">{uploadStatus}</p>
                        </div>
                    )}

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 mb-4">Upload CSV file with leads</p>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={(e) => setUploadFile(e.target.files[0])}
                            disabled={uploading || qualifying}
                            className="hidden"
                            id="lead-file-upload"
                        />
                        <label 
                            htmlFor="lead-file-upload" 
                            className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors inline-block disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Choose File
                        </label>
                        {uploadFile && (
                            <p className="text-sm text-green-600 mt-3 font-medium">
                                ✓ Selected: {uploadFile.name}
                            </p>
                        )}
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700">
                            <span className="font-semibold">Process:</span> Upload CSV → Qualify leads based on product fit → Score and grade each lead
                        </p>
                    </div>

                    <button
                        onClick={handleUploadLeads}
                        disabled={!uploadFile || uploading || qualifying}
                        className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                    >
                        {uploading || qualifying ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                {uploadStatus || 'Processing...'}
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                Upload & Qualify Leads
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    };

    const ProductSummaryModal = () => {
        if (!showProductSummary || !projectDetails) return null;

        const analysis = projectDetails;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pt-25">
                <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[80vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 flex justify-between items-center z-10">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-6 h-6" />
                            <h3 className="text-2xl font-bold">AI Product Analysis</h3>
                        </div>
                        <button onClick={() => setShowProductSummary(false)} className="text-white hover:text-gray-200">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {/* Requirements Section */}
                        {analysis.requirements && (
                            <>
                                {/* Business Objective */}
                                {analysis.requirements.business_objective && (
                                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-200">
                                        <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                                            <Target className="w-5 h-5 text-purple-600" />
                                            Business Objective
                                        </h4>
                                        <p className="text-gray-800 leading-relaxed">{analysis.requirements.business_objective}</p>
                                    </div>
                                )}

                                {/* Product Description */}
                                {analysis.requirements.product_description && (
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
                                        <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                                            <Info className="w-5 h-5 text-blue-600" />
                                            Product Description
                                        </h4>
                                        <p className="text-gray-800 leading-relaxed">{analysis.requirements.product_description}</p>
                                    </div>
                                )}

                                {/* Target Market */}
                                {analysis.requirements.target_market && (
                                    <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <Briefcase className="w-5 h-5 text-gray-600" />
                                            Target Market
                                        </h4>
                                        <p className="text-gray-700 leading-relaxed">{analysis.requirements.target_market}</p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Product Info */}
                        {analysis.product_info && (
                            <div className="bg-white border-2 border-indigo-200 p-6 rounded-xl">
                                <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-indigo-600" />
                                    Product Information
                                </h4>
                                <div className="space-y-3">
                                    {analysis.product_info.name && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Name:</span>
                                            <p className="text-gray-900 font-medium mt-1">{analysis.product_info.name}</p>
                                        </div>
                                    )}
                                    {analysis.product_info.category && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Category:</span>
                                            <p className="text-gray-900 font-medium mt-1">{analysis.product_info.category}</p>
                                        </div>
                                    )}
                                    {analysis.product_info.key_features && analysis.product_info.key_features.length > 0 && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-600 mb-2 block">Key Features:</span>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {analysis.product_info.key_features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
                                                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-gray-800">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Pain Points */}
                        {analysis.pain_points && analysis.pain_points.length > 0 && (
                            <div className="bg-white border-2 border-red-200 p-6 rounded-xl">
                                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                    Pain Points Addressed
                                </h4>
                                <div className="space-y-2">
                                    {analysis.pain_points.map((pain, idx) => (
                                        <div key={idx} className="flex items-start gap-3 bg-red-50 p-3 rounded-lg border border-red-200">
                                            <span className="text-red-600 font-bold text-lg flex-shrink-0">•</span>
                                            <span className="text-gray-800">{pain}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Value Propositions */}
                        {analysis.value_propositions && analysis.value_propositions.length > 0 && (
                            <div className="bg-white border-2 border-green-200 p-6 rounded-xl">
                                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                    Value Propositions
                                </h4>
                                <div className="space-y-2">
                                    {analysis.value_propositions.map((vp, idx) => (
                                        <div key={idx} className="flex items-start gap-3 bg-green-50 p-3 rounded-lg border border-green-200">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-800">{vp}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Lead Criteria */}
                        {analysis.lead_criteria && (
                            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-xl border-2 border-orange-200">
                                <h4 className="font-bold text-lg text-gray-900 mb-4">Lead Generation Criteria</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Decision Maker Roles */}
                                    {analysis.lead_criteria.decision_maker_roles && analysis.lead_criteria.decision_maker_roles.length > 0 && (
                                        <div className="bg-white p-4 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-2 font-medium">Target Roles</p>
                                            <div className="flex flex-wrap gap-2">
                                                {analysis.lead_criteria.decision_maker_roles.map((role, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                                        {role}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Industries */}
                                    {analysis.lead_criteria.industries && analysis.lead_criteria.industries.length > 0 && (
                                        <div className="bg-white p-4 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-2 font-medium">Industries</p>
                                            <div className="flex flex-wrap gap-2">
                                                {analysis.lead_criteria.industries.map((industry, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                                                        {industry}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Company Sizes */}
                                    {analysis.lead_criteria.company_sizes && analysis.lead_criteria.company_sizes.length > 0 && (
                                        <div className="bg-white p-4 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-2 font-medium">Company Sizes</p>
                                            <div className="flex flex-wrap gap-2">
                                                {analysis.lead_criteria.company_sizes.map((size, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium capitalize">
                                                        {size}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Locations */}
                                    {analysis.lead_criteria.locations && analysis.lead_criteria.locations.length > 0 && (
                                        <div className="bg-white p-4 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-2 font-medium">Locations</p>
                                            <div className="flex flex-wrap gap-2">
                                                {analysis.lead_criteria.locations.map((location, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                                                        {location}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Target Industries (if different from lead_criteria) */}
                        {analysis.target_industries && analysis.target_industries.length > 0 && (
                            <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                                <h4 className="font-semibold text-gray-900 mb-3">Target Industries (Detailed)</h4>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.target_industries.map((industry, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                                            {industry}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Analysis Metadata */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center text-sm text-gray-600">
                                <div className="flex items-center gap-4">
                                    <span>
                                        <span className="font-medium">Suggested Lead Count:</span> {analysis.suggested_count || 50}
                                    </span>
                                    {analysis.document_name && (
                                        <span>
                                            <span className="font-medium">Document:</span> {analysis.document_name}
                                        </span>
                                    )}
                                </div>
                                {analysis.extracted_at && (
                                    <span>
                                        <span className="font-medium">Analyzed:</span> {new Date(analysis.extracted_at).toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <button onClick={() => setCurrentView('projects')} className="hover:text-gray-700">Projects</button>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">{projectDetails?.project_name}</span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{projectDetails?.project_name}</h2>
                            <p className="text-gray-500 text-sm mt-1">{projectDetails?.project_id}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowUploadLeads(true)}
                            disabled={uploading || qualifying}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                            <Upload className="w-5 h-5" />
                            Upload & Qualify Leads
                        </button>
                       
                        {/* <button
                            onClick={handleGenerateLeads}
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                            Generate & Qualify Leads
                        </button> */}
                        <button
                            onClick={() => {
                                loadProjectLeads(selectedProject);
                                setCurrentView('leads');
                            }}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 disabled:opacity-50">
                            <Users className="w-5 h-5" />
                            View Leads
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-blue-600 font-medium">Target Count</p>
                        <p className="text-2xl font-bold text-blue-900 mt-1">{projectDetails?.target_count || 0}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm text-green-600 font-medium">Leads Generated</p>
                        <p className="text-2xl font-bold text-green-900 mt-1">{projectDetails?.leads_generated || 0}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-sm text-purple-600 font-medium">Qualified</p>
                        <p className="text-2xl font-bold text-purple-900 mt-1">{projectDetails?.qualified_count || 0}</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                        <p className="text-sm text-orange-600 font-medium">Status</p>
                        <p className="text-xl font-bold text-orange-900 mt-1 capitalize">{projectDetails?.status || 'Active'}</p>
                    </div>
                </div>

                {projectDetails?.document_name && (
                    <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-purple-600" />
                                <div>
                                    <p className="text-sm font-medium text-purple-900">AI-Analyzed Document</p>
                                    <p className="text-xs text-purple-700">{projectDetails.document_name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowProductSummary(true)}
                                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                            >
                                View Full Analysis
                            </button>
                        </div>
                    </div>
                )}

                {projectDetails?.product_info && (
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Product Information</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <div>
                                <span className="text-sm font-medium text-gray-700">Name: </span>
                                <span className="text-sm text-gray-900">{projectDetails.product_info.name}</span>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-700">Category: </span>
                                <span className="text-sm text-gray-900">{projectDetails.product_info.category}</span>
                            </div>
                        </div>
                    </div>
                )}

                {projectDetails?.lead_criteria && (
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Target Criteria</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Target Roles</p>
                                <div className="flex flex-wrap gap-2">
                                    {projectDetails.lead_criteria.decision_maker_roles?.map((role, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Industries</p>
                                <div className="flex flex-wrap gap-2">
                                    {projectDetails.lead_criteria.industries?.map((industry, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                            {industry}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <UploadLeadsModal />
            <ProductSummaryModal />
        </div>
    );
}