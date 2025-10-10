import { useState, useEffect } from 'react';
import { Search, Download, X, AlertCircle, CheckCircle, Loader, FolderPlus, Upload, BarChart3, Eye, TrendingUp } from 'lucide-react';

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

    const handleCreateProject = async (projectName, description) => {
        try {
            const response = await fetch(`${API_BASE_URL}/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: projectName, description })
            });
            const data = await response.json();
            showMessage('success', `Project "${projectName}" created successfully`);
            setShowCreateProject(false);
            loadProjects();
        } catch (error) {
            showMessage('error', 'Failed to create project');
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
            formData.append('project_id', selectedProject.id);

            const response = await fetch(`${API_BASE_URL}/projects/${selectedProject.id}/upload-leads`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            showMessage('success', `${data.leads_uploaded} leads uploaded successfully`);
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
                </div>
            )}
        </div>
    );

    const CreateProjectModal = () => {
        const [projectName, setProjectName] = useState('');
        const [description, setDescription] = useState('');
        
        if (!showCreateProject) return null;
        
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
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
                    </div>
                    <button
                        onClick={() => handleCreateProject(projectName, description)}
                        disabled={!projectName.trim()}
                        className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Create Project
                    </button>
                </div>
            </div>
        );
    };

    const UploadLeadsModal = () => {
        const [file, setFile] = useState(null);
        
        if (!showUploadLeads) return null;
        
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
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
                        </div>
                        {project.description && (
                            <p className="text-sm text-gray-600 mb-4">{project.description}</p>
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
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">{selectedProject?.name}</h2>
                        <p className="text-gray-500 mt-1">{leads.length} total leads</p>
                    </div>
                    <div className="flex gap-3">
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
                                <CheckCircle className="w-4 h-4" />
                            )}
                            Qualify Leads {newLeadsCount > 0 && `(${newLeadsCount})`}
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
                                    placeholder="Search leads by name, company, email..." 
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
    const recommendations = selectedLead.recommendations || {};

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 top-20">
            <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[calc(85vh-80px)] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-20">
                    <h3 className="text-2xl font-bold text-gray-900">{selectedLead.name}</h3>
                    <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Contact Information</h4>
                            <div className="space-y-2">
                                <p className="text-sm"><span className="text-gray-500">Email:</span> <span className="font-medium">{selectedLead.email}</span></p>
                                <p className="text-sm"><span className="text-gray-500">Phone:</span> <span className="font-medium">{selectedLead.phone || 'N/A'}</span></p>
                                <p className="text-sm"><span className="text-gray-500">Company:</span> <span className="font-medium">{selectedLead.company}</span></p>
                                <p className="text-sm"><span className="text-gray-500">Title:</span> <span className="font-medium">{selectedLead.title}</span></p>
                                <p className="text-sm"><span className="text-gray-500">Industry:</span> <span className="font-medium">{selectedLead.industry}</span></p>
                                <p className="text-sm"><span className="text-gray-500">Location:</span> <span className="font-medium">{selectedLead.location}</span></p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Qualification Details</h4>
                            <div className="flex items-center justify-center">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                                        <div className="text-center text-white">
                                            <div className="text-4xl font-bold">{Math.round(selectedLead.lead_score || 0)}</div>
                                            <div className="text-xs">Score</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm"><span className="text-gray-500">Priority:</span> <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedLead.priority)}`}>{selectedLead.priority?.toUpperCase()}</span></p>
                                <p className="text-sm"><span className="text-gray-500">Status:</span> <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLead.processing_status)}`}>{selectedLead.processing_status}</span></p>
                                <p className="text-sm"><span className="text-gray-500">Intent:</span> <span className="font-medium">{selectedLead.intent || 'N/A'}</span></p>
                                <p className="text-sm"><span className="text-gray-500">Intent Confidence:</span> <span className="font-medium">{selectedLead.intent_confidence || 'N/A'}</span></p>
                            </div>
                        </div>
                    </div>

                    {Object.keys(scoreBreakdown).length > 0 && (
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Score Breakdown</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(scoreBreakdown).map(([key, value]) => (
                                    <div key={key} className="bg-gray-50 p-3 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600 capitalize">{key.replace('_', ' ')}</span>
                                            <span className="font-semibold text-gray-900">{typeof value === 'number' ? value.toFixed(1) : value}</span>
                                        </div>
                                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-600 h-2 rounded-full" style={{width: `${Math.min((value / 25) * 100, 100)}%`}}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedLead.tech_stack && (
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Tech Stack</h4>
                            <p className="text-sm text-gray-700">{selectedLead.tech_stack}</p>
                        </div>
                    )}

                    {selectedLead.interest_tags && (
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Interest Tags</h4>
                            <p className="text-sm text-gray-700">{selectedLead.interest_tags}</p>
                        </div>
                    )}

                    {recommendations.next_steps && recommendations.next_steps.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Recommended Next Steps</h4>
                            <ul className="space-y-2">
                                {recommendations.next_steps.map((step, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {selectedLead.summary && (
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Summary</h4>
                            <p className="text-sm text-gray-700 bg-blue-50 p-4 rounded-lg">{selectedLead.summary}</p>
                        </div>
                    )}

                    {recommendations.risks && recommendations.risks.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Potential Risks</h4>
                            <ul className="space-y-2">
                                {recommendations.risks.map((risk, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">{risk}</span>
                                    </li>
                                ))}
                            </ul>
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
            <div className="flex-1 p-8">
                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                        message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {message.text}
                    </div>
                )}
                
                {processingProgress && (
                    <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
                        <div className="flex items-center gap-3 mb-2">
                            <Loader className="w-5 h-5 animate-spin text-blue-600" />
                            <span className="text-blue-800 font-medium">Processing leads...</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full transition-all" style={{width: `${(processingProgress.current / processingProgress.total) * 100}%`}}></div>
                        </div>
                    </div>
                )}
                
                {currentView === 'projects' && <ProjectsView />}
                {currentView === 'leads' && selectedProject && <LeadsView />}
                
                <CreateProjectModal />
                <UploadLeadsModal />
                <LeadDetailsModal />
            </div>
        </div>
    );
}