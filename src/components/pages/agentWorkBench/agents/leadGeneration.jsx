import { useState, useEffect } from 'react';
import { Upload, FileText, Plus, Minus, Loader, CheckCircle, AlertCircle, Home, List, BarChart3, ChevronLeft, Edit2, Save, X, Send } from 'lucide-react';

export default function LeadGeneration() {
    const API_BASE_URL = 'http://localhost:8000/lead-generation';

    // State management
    const [currentView, setCurrentView] = useState('home');
    const [inputMode, setInputMode] = useState('form'); // 'form' or 'document'
    const [loading, setLoading] = useState(false);
    const [currentJobId, setCurrentJobId] = useState(null);
    const [jobStatus, setJobStatus] = useState(null);
    
    // Form state
    const [formData, setFormData] = useState({
        product_name: '',
        target_industry: 'Technology',
        target_role: 'VP Sales',
        target_company_size: '50-500 employees',
        pain_points: [''],
        value_propositions: [''],
        features: [''],
        use_cases: [''],
        competitive_advantages: [''],
        lead_count: 15
    });
    
    // Projects & Leads
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectLeads, setProjectLeads] = useState([]);
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [editingLeadId, setEditingLeadId] = useState(null);
    const [editedMessage, setEditedMessage] = useState({});
    const [statistics, setStatistics] = useState({});
    
    // Document upload
    const [uploadedFile, setUploadedFile] = useState(null);
    const [message, setMessage] = useState(null);

    // Poll job status
    useEffect(() => {
        let interval;
        if (currentJobId && loading) {
            interval = setInterval(async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/status/${currentJobId}`);
                    const data = await response.json();
                    setJobStatus(data);
                    
                    if (data.status === 'completed') {
                        setLoading(false);
                        showMessage('success', 'Lead generation completed!');
                        loadJobResults(currentJobId);
                        clearInterval(interval);
                    } else if (data.status === 'failed') {
                        setLoading(false);
                        showMessage('error', 'Generation failed');
                        clearInterval(interval);
                    }
                } catch (error) {
                    console.error('Poll error:', error);
                }
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [currentJobId, loading]);

    // Load statistics on mount
    useEffect(() => {
        loadStatistics();
        loadProjects();
    }, []);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    const loadStatistics = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/statistics`);
            const data = await response.json();
            setStatistics(data);
        } catch (error) {
            console.error('Failed to load statistics:', error);
        }
    };

    const loadProjects = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/projects`);
            const data = await response.json();
            setProjects(data.projects || []);
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    };

    const loadJobResults = async (jobId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/results/${jobId}`);
            const data = await response.json();
            
            if (data.project_id) {
                await loadProjects();
                setSelectedProject(data.project_id);
                await loadProjectLeads(data.project_id);
                setCurrentView('leads');
            }
        } catch (error) {
            console.error('Failed to load results:', error);
        }
    };

    const loadProjectLeads = async (projectId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/project-leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_id: projectId, limit: 50 })
            });
            const data = await response.json();
            setProjectLeads(data.leads || []);
        } catch (error) {
            console.error('Failed to load leads:', error);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await fetch(`${API_BASE_URL}/generate-from-form`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            setCurrentJobId(data.job_id);
            showMessage('success', 'Generation started!');
        } catch (error) {
            setLoading(false);
            showMessage('error', 'Failed to start generation');
        }
    };

    const handleDocumentUpload = async () => {
        if (!uploadedFile) return;
        
        setLoading(true);
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('lead_count', '15');
        
        try {
            const response = await fetch(`${API_BASE_URL}/generate-from-document`, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            setCurrentJobId(data.job_id);
            showMessage('success', 'Document uploaded and processing!');
        } catch (error) {
            setLoading(false);
            showMessage('error', 'Upload failed');
        }
    };

    const handleArrayInput = (field, index, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData({ ...formData, [field]: newArray });
    };

    const addArrayField = (field) => {
        setFormData({ ...formData, [field]: [...formData[field], ''] });
    };

    const removeArrayField = (field, index) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: newArray });
    };

    const toggleLeadSelection = (leadId) => {
        setSelectedLeads(prev =>
            prev.includes(leadId)
                ? prev.filter(id => id !== leadId)
                : [...prev, leadId]
        );
    };

    const selectAllLeads = () => {
        if (selectedLeads.length === projectLeads.length) {
            setSelectedLeads([]);
        } else {
            setSelectedLeads(projectLeads.map(l => l.lead_id));
        }
    };

    const startEditingMessage = (lead) => {
        setEditingLeadId(lead.lead_id);
        setEditedMessage({
            subject: lead.message.subject,
            body: lead.message.body,
            cta: lead.message.cta
        });
    };

    const saveMessage = async (leadId) => {
        try {
            await fetch(`${API_BASE_URL}/update-message`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lead_id: leadId,
                    ...editedMessage
                })
            });
            
            showMessage('success', 'Message updated!');
            setEditingLeadId(null);
            await loadProjectLeads(selectedProject);
        } catch (error) {
            showMessage('error', 'Failed to update message');
        }
    };

    const handleSelectLeads = async () => {
        try {
            await fetch(`${API_BASE_URL}/select-leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedLeads)
            });
            
            showMessage('success', `${selectedLeads.length} leads selected for outreach!`);
            await loadProjectLeads(selectedProject);
        } catch (error) {
            showMessage('error', 'Failed to select leads');
        }
    };

    // Sidebar
    const Sidebar = () => (
        <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col pt-20">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-900">Lead Generation</h1>
            </div>
            
            <nav className="flex-1 p-4">
                <button
                    onClick={() => setCurrentView('home')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
                        currentView === 'home' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    <Home className="w-5 h-5" />
                    <span>Home</span>
                </button>
                
                <button
                    onClick={() => setCurrentView('projects')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
                        currentView === 'projects' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    <List className="w-5 h-5" />
                    <span>Projects</span>
                </button>
                
                <button
                    onClick={() => setCurrentView('leads')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
                        currentView === 'leads' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    disabled={!selectedProject}
                >
                    <BarChart3 className="w-5 h-5" />
                    <span>Leads</span>
                </button>
            </nav>
        </div>
    );

    // Home View
    const renderHome = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Generate Leads</h2>
                <p className="text-gray-500 text-sm mt-1">Upload a document or fill in the form to generate leads</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                            <List className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Projects</p>
                            <p className="text-2xl font-bold text-gray-900">{statistics.total_projects || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Leads</p>
                            <p className="text-2xl font-bold text-gray-900">{statistics.total_leads || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Selected</p>
                            <p className="text-2xl font-bold text-gray-900">{statistics.selected_leads || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
                            <Send className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">{statistics.pending_outreach || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Input Mode Selection */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setInputMode('form')}
                        className={`flex-1 py-3 px-6 rounded-lg font-medium ${
                            inputMode === 'form'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <FileText className="w-5 h-5 inline mr-2" />
                        Fill Form
                    </button>
                    <button
                        onClick={() => setInputMode('document')}
                        className={`flex-1 py-3 px-6 rounded-lg font-medium ${
                            inputMode === 'document'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <Upload className="w-5 h-5 inline mr-2" />
                        Upload Document
                    </button>
                </div>

                {/* Form Input */}
                {inputMode === 'form' && (
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                                <input
                                    type="text"
                                    value={formData.product_name}
                                    onChange={(e) => setFormData({...formData, product_name: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Lead Count</label>
                                <input
                                    type="number"
                                    value={formData.lead_count}
                                    onChange={(e) => setFormData({...formData, lead_count: parseInt(e.target.value)})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    min="1"
                                    max="50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Target Industry</label>
                                <input
                                    type="text"
                                    value={formData.target_industry}
                                    onChange={(e) => setFormData({...formData, target_industry: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Target Role</label>
                                <input
                                    type="text"
                                    value={formData.target_role}
                                    onChange={(e) => setFormData({...formData, target_role: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                                <input
                                    type="text"
                                    value={formData.target_company_size}
                                    onChange={(e) => setFormData({...formData, target_company_size: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Dynamic Arrays */}
                        {['pain_points', 'value_propositions', 'features'].map(field => (
                            <div key={field}>
                                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                                    {field.replace('_', ' ')}
                                </label>
                                {formData[field].map((value, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => handleArrayInput(field, index, e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder={`${field.replace('_', ' ')} ${index + 1}`}
                                        />
                                        {formData[field].length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeArrayField(field, index)}
                                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <Minus className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayField(field)}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add {field.replace('_', ' ')}
                                </button>
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>Generate Leads</>
                            )}
                        </button>
                    </form>
                )}

                {/* Document Upload */}
                {inputMode === 'document' && (
                    <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600 mb-4">Upload PRD, BRD, or any document</p>
                            <input
                                type="file"
                                onChange={(e) => setUploadedFile(e.target.files[0])}
                                accept=".txt,.doc,.docx,.pdf"
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                            >
                                Choose File
                            </label>
                            {uploadedFile && (
                                <p className="text-sm text-gray-600 mt-4">
                                    Selected: {uploadedFile.name}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={handleDocumentUpload}
                            disabled={!uploadedFile || loading}
                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>Upload & Generate</>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Job Status */}
            {jobStatus && loading && (
                <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
                    <div className="flex items-center gap-3">
                        <Loader className="w-6 h-6 text-blue-600 animate-spin" />
                        <div>
                            <p className="font-medium text-blue-900">Processing...</p>
                            <p className="text-sm text-blue-700">
                                Completed stages: {jobStatus.result?.stages_completed?.join(', ') || 'Starting...'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    // Projects View
    const renderProjects = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
                <p className="text-gray-500 text-sm mt-1">View all your lead generation projects</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Project ID</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Leads</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {projects.map((project) => (
                            <tr key={project.project_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900">{project.project_id}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{project.product_name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{project.target_industry}</td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{project.lead_count}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        project.status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                        {project.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(project.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => {
                                            setSelectedProject(project.project_id);
                                            loadProjectLeads(project.project_id);
                                            setCurrentView('leads');
                                        }}
                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                    >
                                        View Leads
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Leads View
    const renderLeads = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Leads & Messages</h2>
                    <p className="text-gray-500 text-sm mt-1">Review and edit messages before sending</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={selectAllLeads}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                    >
                        {selectedLeads.length === projectLeads.length ? 'Deselect All' : 'Select All'}
                    </button>
                    <button
                        onClick={handleSelectLeads}
                        disabled={selectedLeads.length === 0}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        Mark for Outreach ({selectedLeads.length})
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="space-y-6">
                    {projectLeads.map((lead) => (
                        <div key={lead.lead_id} className="border border-gray-200 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <input
                                    type="checkbox"
                                    checked={selectedLeads.includes(lead.lead_id)}
                                    onChange={() => toggleLeadSelection(lead.lead_id)}
                                    className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />

                                <div className="flex-1">
                                    {/* Lead Info */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{lead.name}</h3>
                                            <p className="text-gray-600">{lead.role} at {lead.company}</p>
                                            <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                                <span>{lead.industry}</span>
                                                <span>•</span>
                                                <span>{lead.company_size}</span>
                                                {lead.email && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{lead.email}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-500">Score:</span>
                                            <span className="text-lg font-bold text-blue-600">
                                                {(lead.personalization_score * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Message Preview/Edit */}
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                        {editingLeadId === lead.lead_id ? (
                                            <>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Subject:</label>
                                                    <input
                                                        type="text"
                                                        value={editedMessage.subject}
                                                        onChange={(e) => setEditedMessage({...editedMessage, subject: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Message Body:</label>
                                                    <textarea
                                                        value={editedMessage.body}
                                                        onChange={(e) => setEditedMessage({...editedMessage, body: e.target.value})}
                                                        rows="6"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Call-to-Action:</label>
                                                    <input
                                                        type="text"
                                                        value={editedMessage.cta}
                                                        onChange={(e) => setEditedMessage({...editedMessage, cta: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => saveMessage(lead.lead_id)}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
                                                    >
                                                        <Save className="w-4 h-4" />
                                                        Save Changes
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingLeadId(null)}
                                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium flex items-center gap-2"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Cancel
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-gray-900 mb-2">
                                                            📧 {lead.message.subject}
                                                        </p>
                                                        <p className="text-sm text-gray-700 whitespace-pre-line mb-3">
                                                            {lead.message.body}
                                                        </p>
                                                        <p className="text-sm font-medium text-blue-600">
                                                            {lead.message.cta}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => startEditingMessage(lead)}
                                                        className="ml-4 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                        Edit
                                                    </button>
                                                </div>

                                                {/* Talking Points */}
                                                {lead.talking_points && lead.talking_points.length > 0 && (
                                                    <div className="border-t border-gray-200 pt-3">
                                                        <p className="text-xs font-semibold text-gray-700 mb-2">💬 Talking Points:</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {lead.talking_points.map((point, idx) => (
                                                                <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                                    {point}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            
            <div className="flex-1 ml-64 pt-20">
                <div className="max-w-7xl mx-auto px-8 py-8">
                    {/* Alert Messages */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
                            'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                            {message.type === 'success' ? (
                                <CheckCircle className="w-5 h-5" />
                            ) : (
                                <AlertCircle className="w-5 h-5" />
                            )}
                            <span className="font-medium">{message.text}</span>
                        </div>
                    )}

                    {/* Render Current View */}
                    {currentView === 'home' && renderHome()}
                    {currentView === 'projects' && renderProjects()}
                    {currentView === 'leads' && renderLeads()}
                </div>
            </div>
        </div>
    );
}

// //test
// import React from 'react';
// import { ArrowLeft } from 'lucide-react';

// const LeadGenerationCard = () => {
//     const handleClick = () => {
//         // Check for userId before redirecting
//         const userId = localStorage.getItem('userId');
//         if (!userId) {
//             console.log('No userId found, redirecting to login');
//             alert('Please log in to access this feature.');
//             // Optionally redirect to login page
//             // window.location.href = '/login'; // Adjust based on your app's login route
//             return;
//         }

//         try {
//             window.location.href = 'http://industry-specific-workflow.s3-website-ap-southeast-2.amazonaws.com/sales/agent-1';
//         } catch (error) {
//             console.error('Failed to redirect:', error);
//             alert('Unable to redirect. Please try again later.');
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center" style={{ backgroundColor: '#F9FAFB' }}>
//             <div className="max-w-xl w-full p-6">
//                 {/* Card Header with Back Button */}
//                 <div className="relative mb-6">
//                     <h1 className="text-2xl font-semibold text-white text-center p-4 rounded-lg" style={{ 
//                         backgroundColor: 'blue', // blue/blue color for sales/lead generation theme
//                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' 
//                     }}>
//                         Lead Generation
//                     </h1>
//                     <button
//                         onClick={() => window.location.href = '/media-entertainment'} // Adjust to your desired back route
//                         className="absolute top-4 right-4 flex items-center gap-2 text-white font-medium hover:text-blue-200 transition-colors p-2 hover:bg-white-50 hover:bg-opacity-10 rounded-md"
//                     >
//                         <ArrowLeft className="w-5 h-5" />
//                         <span>Back</span>
//                     </button>
//                 </div>

//                 {/* Card Content */}
//                 <div
//                     className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center cursor-pointer transition-transform hover:scale-105 hover:shadow-md"
//                     onClick={handleClick}
//                     role="button"
//                     tabIndex={0}
//                     onKeyDown={(e) => {
//                         if (e.key === 'Enter' || e.key === ' ') {
//                             handleClick();
//                         }
//                     }}
//                 >
//                     {/* Lead Generation Icon/Image */}
//                     <div className="mb-4">
//                         <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
//                             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
//                             </svg>
//                         </div>
//                     </div>

//                     <h3 className="text-xl font-medium text-gray-800 mb-2">Lead Generation</h3>
//                     <p className="text-gray-600 text-sm mb-4">Sales Lead Generation - Find and qualify high-potential prospects automatically.</p>
                    

//                     {/* Call to Action */}
//                     <div className="w-full border-t border-gray-200 pt-4">
//                         <button className="w-full bg-gradient-to-r from-blue-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
//                             <span>Generate Leads Now</span>
//                             <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                             </svg>
//                         </button>
//                     </div>

//                     {/* Use Cases */}
//                     <div className="mt-4 w-full text-left text-xs text-gray-500">
//                         <p className="mb-1">Use Cases:</p>
//                         <div className="flex flex-wrap gap-2 text-xs">
//                             <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">B2B lead generation</span>
//                             <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">Account-based marketing</span>
//                             <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">Sales pipeline growth</span>
//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LeadGenerationCard;