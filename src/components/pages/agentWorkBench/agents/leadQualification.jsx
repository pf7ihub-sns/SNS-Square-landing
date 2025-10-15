import { useState, useEffect } from 'react';
import { Search, Download, X, AlertCircle, CheckCircle, Loader, FolderPlus, Upload, BarChart3, Eye, TrendingUp, FileText, Sparkles, Info } from 'lucide-react';

export default function LeadQualification() {
    const API_BASE_URL = 'http://localhost:8000/lead_qualification';

    const [currentView, setCurrentView] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [leads, setLeads] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [showCreateProject, setShowCreateProject] = useState(false);
    const [showUploadLeads, setShowUploadLeads] = useState(false);
    const [showUploadDocs, setShowUploadDocs] = useState(false);
    const [showProductSummary, setShowProductSummary] = useState(false);
    const [productAnalysis, setProductAnalysis] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState('all');
    const [processingProgress, setProcessingProgress] = useState(null);

    useEffect(() => {
        loadProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            loadProjectLeads(selectedProject.id);
        }
    }, [selectedProject, searchTerm, filterPriority]);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    const loadProjects = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/projects`);
            const data = await response.json();
            setProjects(data.projects || []);
        } catch (error) {
            showMessage('error', 'Failed to load projects');
        }
    };

    const loadProjectLeads = async (projectId) => {
        setLoading(true);
        try {
            let url = `${API_BASE_URL}/projects/${projectId}/leads`;
            const params = new URLSearchParams();
            if (filterPriority !== 'all') params.append('priority', filterPriority);
            if (searchTerm) params.append('search', searchTerm);
            if (params.toString()) url += `?${params.toString()}`;

            const response = await fetch(url);
            const data = await response.json();
            setLeads(data.leads || []);
        } catch (error) {
            showMessage('error', 'Failed to load leads');
        } finally {
            setLoading(false);
        }
    };

    const loadProductAnalysis = async (projectId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/projects/${projectId}/product-analysis`);
            const data = await response.json();
            
            if (data.status === 'not_analyzed') {
                showMessage('info', 'No product documents analyzed yet. Upload documents to enable AI context.');
                setProductAnalysis(null);
            } else if (data.status === 'success') {
                setProductAnalysis(data.analysis);
                setShowProductSummary(true);
            }
        } catch (error) {
            showMessage('error', 'Failed to load product analysis');
        }
    };

    const handleCreateProject = async (projectName, description) => {
        try {
            const response = await fetch(`${API_BASE_URL}/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: projectName, description })
            });
            await response.json();
            showMessage('success', `Project "${projectName}" created successfully`);
            setShowCreateProject(false);
            loadProjects();
        } catch (error) {
            showMessage('error', 'Failed to create project');
        }
    };

    const handleUploadDocuments = async (files) => {
        if (!selectedProject) {
            showMessage('error', 'Please select a project first');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            Array.from(files).forEach(file => {
                formData.append('files', file);
            });

            const response = await fetch(`${API_BASE_URL}/projects/${selectedProject.id}/upload-documents`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            showMessage('success', `${data.documents_uploaded} documents analyzed successfully`);
            setShowUploadDocs(false);
            loadProjects();
            // Reload selected project
            const updatedProjects = await fetch(`${API_BASE_URL}/projects`).then(r => r.json());
            const updatedProject = updatedProjects.projects.find(p => p.id === selectedProject.id);
            if (updatedProject) setSelectedProject(updatedProject);
        } catch (error) {
            showMessage('error', 'Failed to upload documents');
        } finally {
            setLoading(false);
        }
    };

    const handleUploadLeads = async (file) => {
        if (!selectedProject) {
            showMessage('error', 'Please select a project first');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${API_BASE_URL}/projects/${selectedProject.id}/upload-leads`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            showMessage('success', `${data.uploaded} leads uploaded successfully`);
            setShowUploadLeads(false);
            loadProjectLeads(selectedProject.id);
        } catch (error) {
            showMessage('error', 'Failed to upload leads');
        } finally {
            setLoading(false);
        }
    };

    const handleQualifyLeads = async () => {
        if (!selectedProject) {
            showMessage('error', 'Please select a project first');
            return;
        }

        setLoading(true);
        setProcessingProgress({ current: 0, total: leads.filter(l => l.processing_status === 'new').length });
        
        try {
            const response = await fetch(`${API_BASE_URL}/projects/${selectedProject.id}/qualify-leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            showMessage('success', `Qualified ${data.successful} leads successfully`);
            setProcessingProgress(null);
            loadProjectLeads(selectedProject.id);
        } catch (error) {
            showMessage('error', 'Failed to qualify leads');
            setProcessingProgress(null);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = async (format = 'csv') => {
        if (!selectedProject) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/projects/${selectedProject.id}/report?format=${format}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${selectedProject.name}_leads_report.${format}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            showMessage('error', 'Failed to download report');
        }
    };

    const getPriorityColor = (priority) => {
        const colors = {
            high: 'bg-red-100 text-red-800',
            medium: 'bg-yellow-100 text-yellow-800',
            low: 'bg-green-100 text-green-800',
            very_low: 'bg-gray-100 text-gray-800'
        };
        return colors[priority] || colors.very_low;
    };

    const getStatusColor = (status) => {
        const colors = {
            new: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            spam: 'bg-red-100 text-red-800',
            processing: 'bg-yellow-100 text-yellow-800'
        };
        return colors[status] || colors.new;
    };

    const ProductSummaryModal = () => {
        if (!showProductSummary || !productAnalysis) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pt-25">
                <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                    <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 flex justify-between items-center z-10">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-6 h-6" />
                            <h3 className="text-2xl font-bold">Product Analysis</h3>
                        </div>
                        <button onClick={() => setShowProductSummary(false)} className="text-white hover:text-gray-200">
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
                            <p className="text-gray-800 text-lg leading-relaxed">{productAnalysis.elevator_pitch}</p>
                        </div>

                        {/* Core Problem */}
                        {productAnalysis.core_problem && (
                            <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                                <h4 className="font-semibold text-gray-900 mb-3">Problem We Solve</h4>
                                <p className="text-gray-700">{productAnalysis.core_problem}</p>
                            </div>
                        )}

                        {/* Key Differentiators */}
                        {productAnalysis.key_differentiators && productAnalysis.key_differentiators.length > 0 && (
                            <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                                <h4 className="font-semibold text-gray-900 mb-4">Key Differentiators</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {productAnalysis.key_differentiators.map((diff, idx) => (
                                        <div key={idx} className="flex items-start gap-3 bg-green-50 p-3 rounded-lg border border-green-200">
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-800">{diff}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Key Features */}
                        {productAnalysis.key_features && productAnalysis.key_features.length > 0 && (
                            <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                                <h4 className="font-semibold text-gray-900 mb-4">Key Features</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {productAnalysis.key_features.map((feature, idx) => (
                                        <div key={idx} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <div className="font-medium text-blue-900 mb-1">
                                                {feature.feature_name || feature}
                                            </div>
                                            {feature.benefit && (
                                                <div className="text-sm text-gray-700">{feature.benefit}</div>
                                            )}
                                            {feature.priority && (
                                                <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                                                    feature.priority === 'must_have' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {feature.priority.replace('_', ' ')}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Value Propositions */}
                        {productAnalysis.value_propositions && productAnalysis.value_propositions.length > 0 && (
                            <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                                <h4 className="font-semibold text-gray-900 mb-4">Value Propositions</h4>
                                <ul className="space-y-2">
                                    {productAnalysis.value_propositions.map((vp, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <span className="text-purple-600 font-bold text-lg">•</span>
                                            <span className="text-gray-700">{vp}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Target Industries */}
                        {productAnalysis.target_industries && productAnalysis.target_industries.length > 0 && (
                            <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
                                <h4 className="font-semibold text-gray-900 mb-3">Target Industries</h4>
                                <div className="flex flex-wrap gap-2">
                                    {productAnalysis.target_industries.map((industry, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                            {industry}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ICP Summary */}
                        {productAnalysis.ideal_customer_profile && (
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200">
                                <h4 className="font-semibold text-gray-900 mb-4">Ideal Customer Profile</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {productAnalysis.ideal_customer_profile.company_profile && (
                                        <div className="bg-white p-4 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-1">Company Size</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {productAnalysis.ideal_customer_profile.company_profile.company_size_range || 'N/A'}
                                            </p>
                                        </div>
                                    )}
                                    {productAnalysis.decision_makers && productAnalysis.decision_makers.length > 0 && (
                                        <div className="bg-white p-4 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-1">Decision Makers</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {productAnalysis.decision_makers.join(', ')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Analysis Metadata */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-600">
                            <div className="flex justify-between items-center">
                                <span>Documents Analyzed: {productAnalysis.documents_analyzed || 0}</span>
                                <span>Analyzed: {productAnalysis.analyzed_at ? new Date(productAnalysis.analyzed_at).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const Sidebar = () => (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-900">Lead Qualifier</h1>
                <p className="text-xs text-gray-500 mt-1">AI-Powered Scoring</p>
            </div>
            <nav className="flex-1 p-4 overflow-y-auto">
                <button 
                    onClick={() => { setCurrentView('projects'); setSelectedProject(null); }} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                        currentView === 'projects' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    <FolderPlus className="w-5 h-5" />
                    <span className="font-medium">Projects</span>
                </button>
                
                {selectedProject && (
                    <div className="mt-4 pl-2 border-l-2 border-blue-200">
                        <button 
                            onClick={() => setCurrentView('leads')} 
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                                currentView === 'leads' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <BarChart3 className="w-5 h-5" />
                            <span className="font-medium">Leads</span>
                        </button>
                    </div>
                )}
            </nav>
            
            {selectedProject && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <p className="text-xs text-gray-500 mb-1">Current Project</p>
                    <p className="font-medium text-sm text-gray-900 truncate">{selectedProject.name}</p>
                    {selectedProject.project_context && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                            <Sparkles className="w-3 h-3" />
                            <span>Context Enabled</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    const CreateProjectModal = () => {
        const [projectName, setProjectName] = useState('');
        const [description, setDescription] = useState('');
        const [documents, setDocuments] = useState([]);
        const [uploadingDocs, setUploadingDocs] = useState(false);
        
        if (!showCreateProject) return null;

        const handleCreateWithDocs = async () => {
            if (!projectName.trim()) return;

            setLoading(true);
            try {
                // Step 1: Create project
                const response = await fetch(`${API_BASE_URL}/projects`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: projectName, description })
                });
                const data = await response.json();
                const newProjectId = data.project.id;

                // Step 2: Upload documents if any
                if (documents.length > 0) {
                    setUploadingDocs(true);
                    const formData = new FormData();
                    documents.forEach(file => {
                        formData.append('files', file);
                    });

                    await fetch(`${API_BASE_URL}/projects/${newProjectId}/upload-documents`, {
                        method: 'POST',
                        body: formData
                    });
                }

                showMessage('success', `Project "${projectName}" created successfully${documents.length > 0 ? ' with context analysis' : ''}`);
                setShowCreateProject(false);
                setProjectName('');
                setDescription('');
                setDocuments([]);
                loadProjects();
            } catch (error) {
                showMessage('error', 'Failed to create project');
            } finally {
                setLoading(false);
                setUploadingDocs(false);
            }
        };
        
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pt-10">
                <div className="bg-white p-6 rounded-xl shadow-xl max-w-lg w-full mx-4">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Create New Project</h3>
                        <button onClick={() => setShowCreateProject(false)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                            <input
                                type="text"
                                placeholder="e.g., Q1 2024 Outreach"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                            <textarea
                                placeholder="Project description..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-600" />
                                Product Documents (Optional)
                            </label>
                            <p className="text-xs text-gray-500 mb-3">Upload PRD, BRD, or product docs to enable AI-powered context matching</p>
                            <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center bg-purple-50">
                                <FileText className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                                <input
                                    type="file"
                                    accept=".pdf,.docx,.txt"
                                    multiple
                                    onChange={(e) => setDocuments(Array.from(e.target.files))}
                                    className="hidden"
                                    id="project-docs-upload"
                                />
                                <label htmlFor="project-docs-upload" className="cursor-pointer px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors inline-block text-sm font-medium">
                                    Choose Documents
                                </label>
                                {documents.length > 0 && (
                                    <div className="mt-3 text-left max-h-32 overflow-y-auto">
                                        {documents.map((f, i) => (
                                            <div key={i} className="flex items-center justify-between py-1 px-2 bg-white rounded mb-1">
                                                <span className="text-xs text-gray-700 truncate flex-1">📄 {f.name}</span>
                                                <button 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setDocuments(documents.filter((_, idx) => idx !== i));
                                                    }}
                                                    className="text-red-500 hover:text-red-700 ml-2"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleCreateWithDocs}
                        disabled={!projectName.trim() || loading}
                        className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader className="w-4 h-4 animate-spin" />
                                {uploadingDocs ? 'Analyzing Documents...' : 'Creating Project...'}
                            </>
                        ) : (
                            <>
                                <FolderPlus className="w-4 h-4" />
                                Create Project
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    };

    const UploadLeadsModal = () => {
        const [file, setFile] = useState(null);
        
        if (!showUploadLeads) return null;
        
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Upload Leads</h3>
                        <button onClick={() => setShowUploadLeads(false)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 mb-4">Upload CSV file with leads</p>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors inline-block">
                            Choose File
                        </label>
                        {file && <p className="text-sm text-gray-600 mt-3">Selected: {file.name}</p>}
                    </div>
                    <button
                        onClick={() => handleUploadLeads(file)}
                        disabled={!file}
                        className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Upload & Sync to Salesforce
                    </button>
                </div>
            </div>
        );
    };

    const UploadDocsModal = () => {
        const [files, setFiles] = useState([]);
        
        if (!showUploadDocs) return null;
        
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Upload Project Documents</h3>
                        <button onClick={() => setShowUploadDocs(false)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">Upload PRD, BRD, or product documents (.pdf, .docx, .txt)</p>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <input
                                type="file"
                                accept=".pdf,.docx,.txt"
                                multiple
                                onChange={(e) => setFiles(Array.from(e.target.files))}
                                className="hidden"
                                id="docs-upload"
                            />
                            <label htmlFor="docs-upload" className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors inline-block">
                                Choose Files
                            </label>
                            {files.length > 0 && (
                                <div className="mt-3 text-left">
                                    {files.map((f, i) => (
                                        <p key={i} className="text-sm text-gray-600">• {f.name}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => handleUploadDocuments(files)}
                        disabled={files.length === 0 || loading}
                        className="w-full mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Analyze Documents
                    </button>
                </div>
            </div>
        );
    };

    const ProjectsView = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">Projects</h2>
                <button 
                    onClick={() => setShowCreateProject(true)} 
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <FolderPlus className="w-5 h-5" />
                    New Project
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                    <div 
                        key={project.id}
                        onClick={() => {
                            setSelectedProject(project);
                            setCurrentView('leads');
                        }}
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FolderPlus className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                                    <p className="text-sm text-gray-500">{project.lead_count || 0} leads</p>
                                </div>
                            </div>
                            {project.project_context && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        loadProductAnalysis(project.id);
                                    }}
                                    className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                                    title="View Product Analysis"
                                >
                                    <Info className="w-5 h-5 text-purple-600" />
                                </button>
                            )}
                        </div>
                        {project.description && (
                            <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                        )}
                        {project.project_context && (
                            <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                <div className="flex items-center gap-2 text-purple-700 text-xs font-medium">
                                    <Sparkles className="w-4 h-4" />
                                    <span>AI Context Enabled</span>
                                </div>
                                <p className="text-xs text-purple-600 mt-1">
                                    {project.project_documents?.length || 0} document(s) analyzed
                                </p>
                            </div>
                        )}
                        <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor('completed')}`}>
                                {project.qualified_count || 0} Qualified
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor('new')}`}>
                                {project.pending_count || 0} Pending
                            </span>
                        </div>
                    </div>
                ))}
                
                {projects.length === 0 && (
                    <div className="col-span-3 text-center py-12">
                        <FolderPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                        <p className="text-gray-500 mb-6">Create your first project to start qualifying leads</p>
                        <button 
                            onClick={() => setShowCreateProject(true)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Create Project
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    const LeadsView = () => {
        const newLeadsCount = leads.filter(l => l.processing_status === 'new').length;
        const qualifiedCount = leads.filter(l => l.processing_status === 'completed').length;
        const avgScore = leads.filter(l => l.lead_score).reduce((sum, l) => sum + l.lead_score, 0) / (qualifiedCount || 1);

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-bold text-gray-900">{selectedProject?.name}</h2>
                        {selectedProject?.project_context && (
                            <button
                                onClick={() => loadProductAnalysis(selectedProject.id)}
                                className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                                title="View Product Summary"
                            >
                                <Info className="w-4 h-4" />
                                <span className="text-sm font-medium">Product Info</span>
                            </button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowUploadDocs(true)} 
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <FileText className="w-4 h-4" />
                            Upload Docs
                        </button>
                        <button 
                            onClick={() => setShowUploadLeads(true)} 
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Upload className="w-4 h-4" />
                            Upload Leads
                        </button>
                        <button 
                            onClick={handleQualifyLeads}
                            disabled={loading || newLeadsCount === 0}
                            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                                <Sparkles className="w-4 h-4" />
                            )}
                            {selectedProject?.project_context ? 'Qualify with Context' : 'Qualify Leads'} {newLeadsCount > 0 && `(${newLeadsCount})`}
                        </button>
                        <button 
                            onClick={() => handleDownloadReport('csv')}
                            disabled={qualifiedCount === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Leads</p>
                                <p className="text-3xl font-bold text-gray-900">{leads.length}</p>
                            </div>
                            <BarChart3 className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Qualified</p>
                                <p className="text-3xl font-bold text-green-600">{qualifiedCount}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Pending</p>
                                <p className="text-3xl font-bold text-yellow-600">{newLeadsCount}</p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-yellow-500" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Avg Score</p>
                                <p className="text-3xl font-bold text-purple-600">{avgScore.toFixed(1)}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-purple-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search leads..." 
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <select 
                                value={filterPriority} 
                                onChange={(e) => setFilterPriority(e.target.value)} 
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Priorities</option>
                                <option value="high">High Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="low">Low Priority</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {leads.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center">
                                            <Upload className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500">No leads yet. Upload a CSV file to get started.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    leads.map(lead => (
                                        <tr key={lead.lead_id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">{lead.name}</div>
                                                    <div className="text-sm text-gray-500">{lead.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{lead.company}</div>
                                                <div className="text-xs text-gray-500">{lead.industry}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{lead.title}</td>
                                            <td className="px-6 py-4">
                                                {lead.lead_score ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                                            {Math.round(lead.lead_score)}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {lead.priority && lead.priority !== 'unscored' ? (
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                                                        {lead.priority.toUpperCase()}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.processing_status)}`}>
                                                    {lead.processing_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button 
                                                    onClick={() => setSelectedLead(lead)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const LeadDetailsModal = () => {
        if (!selectedLead) return null;
        
        const scoreBreakdown = selectedLead.score_breakdown?.rule_based?.breakdown || {};
        const contextMatch = selectedLead.context_match || {};
        const recommendations = selectedLead.recommendations || {};
        
        // Get AI summary from qualification report
        const qualificationReport = selectedLead.qualification_report || {};
        const executiveSummary = qualificationReport.executive_summary || {};
        const aiSummary = executiveSummary.ai_summary || selectedLead.summary || `${selectedLead.name} (${selectedLead.title} at ${selectedLead.company}) - Lead qualification in progress.`;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pt-20">
                <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[80vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{selectedLead.name}</h3>
                            <p className="text-sm text-gray-500">{selectedLead.email}</p>
                        </div>
                        <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-2 space-y-6">
                                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-purple-600" />
                                        AI Analysis Summary
                                    </h4>
                                    <p className="text-sm text-gray-700 leading-relaxed">{aiSummary}</p>
                                </div>

                                {contextMatch.match_quality && (
                                    <div className="bg-white border border-gray-200 p-6 rounded-xl">
                                        <h4 className="font-semibold text-gray-900 mb-4">Project Fit Analysis</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-600">Match Quality</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    contextMatch.match_quality === 'excellent' ? 'bg-green-100 text-green-800' :
                                                    contextMatch.match_quality === 'good' ? 'bg-blue-100 text-blue-800' :
                                                    contextMatch.match_quality === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {contextMatch.match_quality.toUpperCase()}
                                                </span>
                                            </div>
                                            
                                            {contextMatch.industry_match && (
                                                <div className="p-3 bg-gray-50 rounded-lg">
                                                    <p className="text-xs font-medium text-gray-500 mb-1">Industry Match</p>
                                                    <p className="text-sm text-gray-700">{contextMatch.industry_match}</p>
                                                </div>
                                            )}
                                            
                                            {contextMatch.title_match && (
                                                <div className="p-3 bg-gray-50 rounded-lg">
                                                    <p className="text-xs font-medium text-gray-500 mb-1">Title Match</p>
                                                    <p className="text-sm text-gray-700">{contextMatch.title_match}</p>
                                                </div>
                                            )}
                                            
                                            {contextMatch.pain_point_alignment && (
                                                <div className="p-3 bg-gray-50 rounded-lg">
                                                    <p className="text-xs font-medium text-gray-500 mb-1">Pain Point Alignment</p>
                                                    <p className="text-sm text-gray-700">{contextMatch.pain_point_alignment}</p>
                                                </div>
                                            )}

                                            {contextMatch.intent_signals && contextMatch.intent_signals.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500 mb-2">Intent Signals</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {contextMatch.intent_signals.map((signal, i) => (
                                                            <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                                                {signal}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="bg-white border border-gray-200 p-6 rounded-xl">
                                    <h4 className="font-semibold text-gray-900 mb-4">Contact Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Phone</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedLead.phone || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Company</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedLead.company}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Title</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedLead.title}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Industry</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedLead.industry}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Location</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedLead.location || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Intent</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedLead.intent || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {selectedLead.tech_stack && (
                                    <div className="bg-white border border-gray-200 p-6 rounded-xl">
                                        <h4 className="font-semibold text-gray-900 mb-3">Tech Stack</h4>
                                        <p className="text-sm text-gray-700">{selectedLead.tech_stack}</p>
                                    </div>
                                )}

                                {selectedLead.interest_tags && (
                                    <div className="bg-white border border-gray-200 p-6 rounded-xl">
                                        <h4 className="font-semibold text-gray-900 mb-3">Interest Tags</h4>
                                        <p className="text-sm text-gray-700">{selectedLead.interest_tags}</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-xl text-white text-center">
                                    <p className="text-sm opacity-90 mb-2">Lead Score</p>
                                    <p className="text-5xl font-bold mb-2">{Math.round(selectedLead.lead_score || 0)}</p>
                                    <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold bg-white ${
                                        selectedLead.priority === 'high' ? 'text-red-600' :
                                        selectedLead.priority === 'medium' ? 'text-yellow-600' :
                                        'text-green-600'
                                    }`}>
                                        {selectedLead.priority?.toUpperCase()}
                                    </span>
                                </div>

                                {Object.keys(scoreBreakdown).length > 0 && (
                                    <div className="bg-white border border-gray-200 p-6 rounded-xl">
                                        <h4 className="font-semibold text-gray-900 mb-4">Score Breakdown</h4>
                                        <div className="space-y-3">
                                            {Object.entries(scoreBreakdown).map(([key, value]) => (
                                                <div key={key}>
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs text-gray-600 capitalize">{key.replace('_', ' ')}</span>
                                                        <span className="text-sm font-bold text-gray-900">
                                                            {typeof value === 'number' ? value.toFixed(1) : value}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                        <div 
                                                            className="bg-blue-600 h-1.5 rounded-full" 
                                                            style={{width: `${Math.min((value / 25) * 100, 100)}%`}}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="bg-white border border-gray-200 p-6 rounded-xl">
                                    <h4 className="font-semibold text-gray-900 mb-3">Status</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Processing</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLead.processing_status)}`}>
                                                {selectedLead.processing_status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Confidence</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {selectedLead.intent_confidence || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {recommendations.next_steps && recommendations.next_steps.length > 0 && (
                            <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
                                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    Recommended Next Steps
                                </h4>
                                <ul className="space-y-2">
                                    {recommendations.next_steps.map((step, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                                {idx + 1}
                                            </span>
                                            <span className="text-sm text-gray-700 pt-0.5">{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {recommendations.talking_points && recommendations.talking_points.length > 0 && (
                            <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
                                <h4 className="font-semibold text-gray-900 mb-4">Key Talking Points</h4>
                                <ul className="space-y-2">
                                    {recommendations.talking_points.map((point, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <span className="text-blue-600 mt-1">•</span>
                                            <span className="text-sm text-gray-700">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {recommendations.risks && recommendations.risks.length > 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
                                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                                    Potential Risks & Concerns
                                </h4>
                                <ul className="space-y-2">
                                    {recommendations.risks.map((risk, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <span className="text-yellow-600 mt-1">⚠</span>
                                            <span className="text-sm text-gray-700">{risk}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {recommendations.personalized_approach && (
                            <div className="bg-purple-50 border border-purple-200 p-6 rounded-xl">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-purple-600" />
                                    Personalized Approach
                                </h4>
                                <p className="text-sm text-gray-700 leading-relaxed">{recommendations.personalized_approach}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex pt-20">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                        message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
                        message.type === 'info' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                        'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : 
                         message.type === 'info' ? <Info className="w-5 h-5" /> :
                         <AlertCircle className="w-5 h-5" />}
                        {message.text}
                    </div>
                )}
                
                {processingProgress && (
                    <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
                        <div className="flex items-center gap-3 mb-2">
                            <Loader className="w-5 h-5 animate-spin text-blue-600" />
                            <span className="text-blue-800 font-medium">Processing leads in parallel...</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full transition-all animate-pulse" style={{width: '60%'}}></div>
                        </div>
                    </div>
                )}
                
                {currentView === 'projects' && <ProjectsView />}
                {currentView === 'leads' && selectedProject && <LeadsView />}
                
                <CreateProjectModal />
                <UploadLeadsModal />
                <UploadDocsModal />
                <ProductSummaryModal />
                <LeadDetailsModal />
            </div>
        </div>
    );
}
