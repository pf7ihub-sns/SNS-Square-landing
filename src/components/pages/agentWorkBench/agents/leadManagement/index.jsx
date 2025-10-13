import { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import AllProjects from './pages/AllProjects';
import ProjectDetails from './pages/ProjectDetails';
import ManageLeads from './pages/ManageLeads';
import OutreachReview from './pages/OutreachReview';
import EmailMonitor from './pages/EmailMonitor';
import Campaigns from './pages/Campaigns';
import Conversations from './pages/Conversations';
import Qualification from './pages/Qualification';
// import SalesforceSync from './pages/SalesforceSync';

export default function LeadManagement() {
    const API_BASE_URL = 'http://localhost:8000/lead-generation';

    // Main Navigation State
    const [currentView, setCurrentView] = useState('dashboard');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Project States
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectDetails, setProjectDetails] = useState(null);

    // Lead States
    const [leads, setLeads] = useState([]);
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [leadFilter, setLeadFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Refs to prevent duplicate API calls
    const loadingLeadsRef = useRef(false);
    const lastLoadedProjectRef = useRef(null);
    const leadsLoadedRef = useRef(false);

    // Outreach States
    const [outreachMessages, setOutreachMessages] = useState([]);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editedMessage, setEditedMessage] = useState({});
    const [campaignStatus, setCampaignStatus] = useState(null);

    // Email Monitor States
    const [emailMonitorStatus, setEmailMonitorStatus] = useState(false);
    const [emailStats, setEmailStats] = useState({});

    // Form States for Project Creation
    const [createProjectMode, setCreateProjectMode] = useState('form');
    const [projectForm, setProjectForm] = useState({
        project_name: '',
        business_objective: '',
        product_name: '',
        product_description: '',
        target_roles: [''],
        industries: [''],
        locations: [''],
        lead_count: 50,
        pain_points: [''],
        value_propositions: ['']
    });
    const [uploadedFile, setUploadedFile] = useState(null);

    // Statistics
    const [statistics, setStatistics] = useState({
        total_projects: 0,
        total_leads: 0,
        approved_leads: 0,
        sent_outreach: 0,
        qualified_leads: 0
    });

    // ==================== HELPER FUNCTIONS (DEFINE FIRST) ====================
    
    const showMessage = useCallback((type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    }, []);

    const handleArrayInput = useCallback((field, index, value) => {
        setProjectForm(prev => {
            const newArray = [...prev[field]];
            newArray[index] = value;
            return { ...prev, [field]: newArray };
        });
    }, []);

    const addArrayField = useCallback((field) => {
        setProjectForm(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    }, []);

    const removeArrayField = useCallback((field, index) => {
        setProjectForm(prev => {
            const newArray = prev[field].filter((_, i) => i !== index);
            return { ...prev, [field]: newArray };
        });
    }, []);

    const toggleLeadSelection = useCallback((leadId) => {
        setSelectedLeads(prev =>
            prev.includes(leadId)
                ? prev.filter(id => id !== leadId)
                : [...prev, leadId]
        );
    }, []);

    const selectAllLeads = useCallback(() => {
        setSelectedLeads(prev =>
            prev.length === leads.length ? [] : leads.map(l => l._id)
        );
    }, [leads]);

    // ==================== API FUNCTIONS ====================

    const loadStatistics = async () => {
        try {
            const projectsRes = await fetch(`${API_BASE_URL}/projects/list`);
            const projectsData = await projectsRes.json();
            
            let totalLeads = 0;
            let approvedLeads = 0;
            let qualifiedLeads = 0;
            let sentOutreach = 0;
            
            if (projectsData.projects) {
                for (const project of projectsData.projects) {
                    const leadsRes = await fetch(`${API_BASE_URL}/leads/project/${project.project_id}?limit=1000`);
                    const leadsData = await leadsRes.json();
                    totalLeads += leadsData.total || 0;
                    
                    if (leadsData.leads) {
                        approvedLeads += leadsData.leads.filter(lead => lead.approved === true).length;
                        qualifiedLeads += leadsData.leads.filter(lead => lead.qualification_grade).length;
                        sentOutreach += leadsData.leads.filter(lead => lead.outreach_status === 'sent').length;
                    }
                }
            }

            setStatistics({
                total_projects: projectsData.projects?.length || 0,
                total_leads: totalLeads,
                approved_leads: approvedLeads,
                sent_outreach: sentOutreach,
                qualified_leads: qualifiedLeads
            });
        } catch (error) {
            console.error('Failed to load statistics:', error);
        }
    };

    const loadProjects = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/projects/list`);
            const data = await response.json();
            if (data.status === 'success') {
                setProjects(data.projects || []);
            }
        } catch (error) {
            showMessage('error', 'Failed to load projects');
        }
    };

    const loadProjectDetails = async (projectId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/projects/${projectId}`);
            const data = await response.json();
            if (data.status === 'success') {
                setProjectDetails(data.project);
            }
        } catch (error) {
            showMessage('error', 'Failed to load project details');
        }
    };

    const loadProjectLeads = async (projectId, force = false) => {
        if (!force && (loadingLeadsRef.current || (leadsLoadedRef.current && lastLoadedProjectRef.current === projectId))) {
            return;
        }

        loadingLeadsRef.current = true;
        lastLoadedProjectRef.current = projectId;
        leadsLoadedRef.current = false;

        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/leads/project/${projectId}?limit=100`);
            const data = await response.json();
            if (data.status === 'success') {
                setLeads(data.leads || []);
                leadsLoadedRef.current = true;
            }
        } catch (error) {
            showMessage('error', 'Failed to load leads');
        } finally {
            setLoading(false);
            loadingLeadsRef.current = false;
        }
    };

    const refreshLeads = async (projectId) => {
        /**
         * Force refresh leads, bypassing cache
         * Call this after upload/qualification to ensure UI updates
         */
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/leads/project/${projectId}?limit=100&t=${Date.now()}`);
            const data = await response.json();
            
            if (data.status === 'success') {
                console.log('Leads refreshed:', data.leads?.length);
                console.log('Sample lead:', data.leads?.[0]); // Debug: check structure
                
                // Transform leads to ensure _id is set for React keys
                const transformedLeads = (data.leads || []).map(lead => ({
                    ...lead,
                    _id: lead._id || lead.lead_id || `lead_${Math.random()}`
                }));
                
                setLeads(transformedLeads);
                leadsLoadedRef.current = true;
                lastLoadedProjectRef.current = projectId;
                console.log('Leads state updated with', transformedLeads.length, 'leads');
            } else {
                console.error('Failed to load leads:', data);
            }
        } catch (error) {
            console.error('Failed to refresh leads:', error);
            showMessage('error', 'Failed to refresh leads');
        } finally {
            setLoading(false);
        }
    };

    const loadEmailStats = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/email-accounts/stats`);
            const data = await response.json();
            if (data.status === 'success') {
                setEmailStats(data.stats || {});
            }
        } catch (error) {
            console.error('Failed to load email stats:', error);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/projects/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectForm)
            });

            const data = await response.json();
            
            if (data.status === 'success') {
                showMessage('success', 'Project created successfully!');
                setSelectedProject(data.project_id);
                await loadProjects();
                setCurrentView('project-details');
                await loadProjectDetails(data.project_id);
            } else {
                showMessage('error', data.detail || 'Failed to create project');
            }
        } catch (error) {
            showMessage('error', 'Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    const handleDocumentUpload = async () => {
        if (!uploadedFile || !projectForm.project_name) {
            showMessage('error', 'Please provide project name and upload a document');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('project_name', projectForm.project_name);

        try {
            const response = await fetch(`${API_BASE_URL}/projects/upload-document`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.status === 'success') {
                showMessage('success', 'Document analyzed and project created!');
                setSelectedProject(data.project_id);
                await loadProjects();
                setCurrentView('project-details');
                await loadProjectDetails(data.project_id);
                setUploadedFile(null);
                setCreateProjectMode('form');
            } else {
                showMessage('error', data.detail || 'Failed to upload document');
            }
        } catch (error) {
            console.error('Upload error:', error);
            showMessage('error', 'Failed to upload document');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateLeads = async () => {
        if (!selectedProject) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/leads/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_id: selectedProject,
                    lead_count: 50
                })
            });

            const data = await response.json();
            
            if (data.status === 'completed') {
                showMessage('success', `Generated ${data.generated_count} leads!`);
                await loadProjectLeads(selectedProject, true);
                setCurrentView('leads');
            } else {
                showMessage('error', 'Failed to generate leads');
            }
        } catch (error) {
            showMessage('error', 'Failed to generate leads');
        } finally {
            setLoading(false);
        }
    };

const handleGenerateOutreach = async () => {
    if (selectedLeads.length === 0) {
        showMessage('error', 'Please select leads first');
        return;
    }

    setLoading(true);
    try {
        const response = await fetch(`${API_BASE_URL}/outreach/generate-messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                project_id: selectedProject,
                lead_ids: selectedLeads  
            })
        });

        const data = await response.json();
        
        if (data.status === 'completed') {
            showMessage('success', `Generated ${data.messages_generated} messages!`);
            
            // CRITICAL FIX: Merge message_ids from save result back into messages
            const messagesWithIds = data.messages.map((msg, index) => ({
                ...msg,
                message_id: data.saved?.message_ids?.[index] || msg._id || msg.message_id,
                _id: data.saved?.message_ids?.[index] || msg._id
            }));
            
            console.log('Messages with IDs:', messagesWithIds);
            
            setOutreachMessages(messagesWithIds);
            setCurrentView('outreach-review');
        } else {
            showMessage('error', data.message || 'Failed to generate messages');
        }
    } catch (error) {
        console.error('Generate outreach error:', error);
        showMessage('error', 'Failed to generate messages');
    } finally {
        setLoading(false);
    }
};

    

    const handleStartCampaign = async (messageIds) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/outreach/start-campaign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_id: selectedProject,
                    message_ids: messageIds
                })
            });

            const data = await response.json();
            
            if (data.status === 'completed') {
                showMessage('success', `Campaign started! Sent: ${data.sent}, Failed: ${data.failed}`);
                setCurrentView('campaigns');
            } else {
                showMessage('error', data.error || 'Failed to start campaign');
            }
        } catch (error) {
            showMessage('error', 'Failed to start campaign');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateMessage = async (messageId) => {
        try {
            await fetch(`${API_BASE_URL}/outreach/update-message`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message_id: messageId,
                    updated_message: editedMessage.message,
                    updated_subject: editedMessage.subject
                })
            });

            showMessage('success', 'Message updated!');

            setOutreachMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.lead_id === messageId
                        ? { ...msg, message: editedMessage.message, subject: editedMessage.subject }
                        : msg
                )
            );

            setEditingMessageId(null);
        } catch (error) {
            showMessage('error', 'Failed to update message');
        }
    };

    // ==================== EFFECTS ====================

    useEffect(() => {
        loadProjects();
        loadStatistics();
        loadEmailStats();
    }, []);

    useEffect(() => {
        if ((currentView === 'leads' || currentView === 'qualification') && selectedProject) {
            if (lastLoadedProjectRef.current !== selectedProject) {
                leadsLoadedRef.current = false;
            }
            loadProjectLeads(selectedProject);
        }
    }, [currentView, selectedProject]);

    useEffect(() => {
        if (currentView === 'dashboard') {
            loadStatistics();
        }
    }, [currentView]);

    useEffect(() => {
        if (currentView === 'campaigns' && selectedProject) {
            const interval = setInterval(async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/outreach/campaign-status/${selectedProject}`);
                    const data = await response.json();
                    setCampaignStatus(data);
                } catch (error) {
                    console.error('Failed to fetch campaign status:', error);
                }
            }, 30000);

            return () => clearInterval(interval);
        }
    }, [currentView, selectedProject]);

    // ==================== RENDER ====================

    return (
        <div className="min-h-screen bg-gray-50 flex pt-20">
            <Sidebar 
                currentView={currentView} 
                setCurrentView={setCurrentView} 
                selectedProject={selectedProject} 
            />
            
            <div className="flex-1 p-8">
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

                {currentView === 'dashboard' && (
                    <Dashboard 
                        statistics={statistics} 
                        setCurrentView={setCurrentView} 
                        projects={projects}
                        setSelectedProject={setSelectedProject}
                        loadProjectDetails={loadProjectDetails}
                    />
                )}
                
                {currentView === 'create-project' && (
                    <CreateProject 
                        createProjectMode={createProjectMode}
                        setCreateProjectMode={setCreateProjectMode}
                        projectForm={projectForm}
                        setProjectForm={setProjectForm}
                        uploadedFile={uploadedFile}
                        setUploadedFile={setUploadedFile}
                        loading={loading}
                        handleCreateProject={handleCreateProject}
                        handleDocumentUpload={handleDocumentUpload}
                        handleArrayInput={handleArrayInput}
                        addArrayField={addArrayField}
                        removeArrayField={removeArrayField}
                    />
                )}
                
                {currentView === 'projects' && (
                    <AllProjects 
                        setCurrentView={setCurrentView}
                        setProjects={setProjects}
                        projects={projects}
                        setSelectedProject={setSelectedProject}
                        loadProjectDetails={loadProjectDetails}
                    />
                )}
                
                {currentView === 'project-details' && (
                    <ProjectDetails 
                        projectDetails={projectDetails}
                        selectedProject={selectedProject}
                        loading={loading}
                        handleGenerateLeads={handleGenerateLeads}
                        setCurrentView={setCurrentView}
                        loadProjectLeads={loadProjectLeads}
                        refreshLeads={refreshLeads}
                    />
                )}
                
                {currentView === 'leads' && (
                    <ManageLeads 
                        leads={leads}
                        selectedLeads={selectedLeads}
                        setSelectedLeads={setSelectedLeads}
                        leadFilter={leadFilter}
                        setLeadFilter={setLeadFilter}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        handleGenerateOutreach={handleGenerateOutreach}
                        toggleLeadSelection={toggleLeadSelection}
                        selectAllLeads={selectAllLeads}
                    />
                )}
                
                {currentView === 'outreach-review' && (
                    <OutreachReview 
                        outreachMessages={outreachMessages}
                        editingMessageId={editingMessageId}
                        setEditingMessageId={setEditingMessageId}
                        editedMessage={editedMessage}
                        setEditedMessage={setEditedMessage}
                        handleUpdateMessage={handleUpdateMessage}
                        handleStartCampaign={handleStartCampaign}
                    />
                )}
                
                {currentView === 'email-monitor' && (
                    <EmailMonitor 
                        emailMonitorStatus={emailMonitorStatus}
                        setEmailMonitorStatus={setEmailMonitorStatus}
                        emailStats={emailStats}
                    />
                )}
                
                {currentView === 'campaigns' && (
                    <Campaigns campaignStatus={campaignStatus} />
                )}
                
                {currentView === 'conversations' && (
                    <Conversations />
                )}
                
                {currentView === 'qualification' && (
                    <Qualification projects={projects} />
                )}
                
                {/* {currentView === 'salesforce' && (
                    <SalesforceSync selectedProject={selectedProject} />
                )} */}
            </div>
        </div>
    );
}