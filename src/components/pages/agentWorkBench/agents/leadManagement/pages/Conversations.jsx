import { useState, useEffect } from 'react';
import { MessageSquare, Loader, User } from 'lucide-react';

export default function Conversations() {
    const [leadReply, setLeadReply] = useState('');
    const [selectedLeadId, setSelectedLeadId] = useState(null);
    const [conversationLeads, setConversationLeads] = useState([]);
    const [loadingConversations, setLoadingConversations] = useState(false);
    const [localConversationHistory, setLocalConversationHistory] = useState([]);

    const API_BASE_URL = 'http://localhost:8000/lead-generation';

    const loadConversationLeads = async () => {
        setLoadingConversations(true);
        try {
            const projectsResponse = await fetch(`${API_BASE_URL}/projects/list`);
            const projectsData = await projectsResponse.json();
            
            if (projectsData.status === 'success') {
                const allConversationLeads = [];
                
                for (const project of projectsData.projects || []) {
                    try {
                        const response = await fetch(`${API_BASE_URL}/leads/project/${project.project_id}?limit=1000`);
                        const data = await response.json();
                        if (data.status === 'success' && data.leads) {
                            const leadsWithProject = data.leads.map(lead => ({
                                ...lead,
                                project_name: project.project_name,
                                project_id: project.project_id
                            }));
                            allConversationLeads.push(...leadsWithProject);
                        }
                    } catch (error) {
                        console.error(`Failed to load leads for project ${project.project_id}:`, error);
                    }
                }
                
                setConversationLeads(allConversationLeads);
            }
        } catch (error) {
            console.error('Failed to load conversation leads:', error);
        } finally {
            setLoadingConversations(false);
        }
    };

    const loadConversation = async (leadId) => {
        setLocalConversationHistory([]);
        setSelectedLeadId(leadId);
        
        try {
            const response = await fetch(`${API_BASE_URL}/conversation/history/${leadId}`);
            const data = await response.json();
            
            if (data.status === 'success') {
                setLocalConversationHistory(data.conversation_history || []);
            }
        } catch (error) {
            console.error('Failed to load conversation:', error);
        }
    };

    useEffect(() => {
        loadConversationLeads();
    }, []);

    const selectedLead = conversationLeads.find(lead => lead._id === selectedLeadId);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Conversations</h2>
                <p className="text-gray-500 text-sm mt-1">Manage lead conversations</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-1 bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="font-bold text-gray-900 mb-4">Active Conversations</h3>
                    {loadingConversations ? (
                        <div className="text-center py-8">
                            <Loader className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Loading conversations...</p>
                        </div>
                    ) : conversationLeads.filter(l => l.conversation_history?.length > 0).length === 0 ? (
                        <div className="text-center py-8">
                            <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">No active conversations</p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {conversationLeads
                                .filter(l => l.conversation_history?.length > 0)
                                .sort((a, b) => {
                                    const aLatest = a.conversation_history?.[a.conversation_history.length - 1]?.timestamp;
                                    const bLatest = b.conversation_history?.[b.conversation_history.length - 1]?.timestamp;
                                    return new Date(bLatest || 0) - new Date(aLatest || 0);
                                })
                                .map(lead => (
                                    <div
                                        key={lead._id}
                                        onClick={() => loadConversation(lead._id)}
                                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                            selectedLeadId === lead._id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                                        }`}
                                    >
                                        <p className="font-medium text-gray-900 text-sm truncate">{lead.name || 'Unknown Lead'}</p>
                                        <p className="text-xs text-gray-500 truncate">{lead.company || 'No Company'}</p>
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-xs text-gray-400">
                                                {lead.conversation_history?.length || 0} messages
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-6">
                    {selectedLeadId ? (
                        <>
                            <div className="border-b pb-4 mb-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{selectedLead?.name || 'Unknown Lead'}</h3>
                                        <p className="text-sm text-gray-600">{selectedLead?.company || 'No Company'}</p>
                                    </div>
                                </div>
                            </div>

                            <h3 className="font-bold text-gray-900 mb-4">
                                Conversation History 
                                <span className="text-sm font-normal text-gray-500 ml-2">
                                    ({localConversationHistory.length} messages)
                                </span>
                            </h3>
                            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                                {localConversationHistory.length === 0 ? (
                                    <div className="text-center py-8">
                                        <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">No messages in this conversation yet</p>
                                    </div>
                                ) : (
                                    localConversationHistory.map((msg, idx) => {
                                        const isFromLead = msg.from === 'lead' || msg.type === 'incoming';
                                        const isOutreach = msg.type === 'outreach';
                                        const isOutgoing = msg.type === 'outgoing' || msg.from === 'system';
                                        
                                        return (
                                            <div
                                                key={idx}
                                                className={`p-4 rounded-lg ${
                                                    isFromLead ? 'bg-gray-100 ml-8' : 
                                                    isOutreach ? 'bg-purple-50 mr-8 border-l-4 border-purple-400' :
                                                    'bg-blue-50 mr-8'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-sm text-gray-900">
                                                            {isFromLead ? (selectedLead?.name || 'Lead') : 
                                                             isOutreach ? '📧 Outreach Email' : 
                                                             '🤖 AI Assistant'}
                                                        </span>
                                                        {isOutreach && (
                                                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                                                EMAIL
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : 
                                                         msg.sent_at ? new Date(msg.sent_at).toLocaleString() : 
                                                         'Unknown time'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.message || 'No message content'}</p>
                                                <div className="flex gap-2 mt-2">
                                                    {msg.sentiment && (
                                                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                                            msg.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                                                            msg.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                                                            msg.sentiment === 'interested' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                            Sentiment: {msg.sentiment}
                                                        </span>
                                                    )}
                                                    {msg.intent && (
                                                        <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                                                            Intent: {msg.intent.replace('_', ' ')}
                                                        </span>
                                                    )}
                                                    {msg.via_email && (
                                                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                                            Via: {msg.via_email}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Select a conversation to view</p>
                            <p className="text-sm text-gray-400 mt-2">Choose a lead from the sidebar to see their conversation history</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}