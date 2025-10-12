import { Send, Edit2, Save, X } from 'lucide-react';
import { useState } from 'react';

export default function OutreachReview({
    outreachMessages,
    editingMessageId,
    setEditingMessageId,
    editedMessage,
    setEditedMessage,
    handleUpdateMessage,
    handleStartCampaign
}) {
    const [isStartingCampaign, setIsStartingCampaign] = useState(false);

    // FIXED: Extract correct message IDs for campaign
    const getMessageIds = () => {
        return outreachMessages.map(msg => {
            const messageId = msg.message_id || msg._id || msg.lead_mongo_id;
            
            console.log('Extracting message ID:', {
                lead_name: msg.lead_name,
                message_id: msg.message_id,
                _id: msg._id,
                lead_id: msg.lead_id,
                selected: messageId
            });
            
            return messageId;
        }).filter(id => id); // Remove undefined/null
    };

    const startCampaignHandler = async () => {
        const messageIds = getMessageIds();
        console.log('Starting campaign with IDs:', messageIds);
        
        if (messageIds.length === 0) {
            alert('No valid message IDs found. Please regenerate messages.');
            return;
        }

        try {
            setIsStartingCampaign(true);
            await handleStartCampaign(messageIds);
        } catch (err) {
            console.error('Error starting campaign:', err);
        } finally {
            setIsStartingCampaign(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Review Outreach Messages</h2>
                    <p className="text-gray-500 text-sm mt-1">{outreachMessages.length} messages generated</p>
                </div>
                <button
                    onClick={startCampaignHandler}
                    disabled={isStartingCampaign}
                    className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 ${
                        isStartingCampaign
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                    {isStartingCampaign ? (
                        <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"></path>
                        </svg>
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                    {isStartingCampaign ? 'Starting...' : `Start Campaign (${outreachMessages.length})`}
                </button>
            </div>

            <div className="space-y-4">
                {outreachMessages.map((msg) => (
                    <div key={msg.lead_id} className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{msg.lead_name}</h3>
                                <p className="text-sm text-gray-600">{msg.lead_email} • {msg.lead_company}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    DB ID: {msg.message_id || msg._id || 'Not saved yet'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {msg.is_test_lead && (
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                        TEST
                                    </span>
                                )}
                                {msg.lead_source && (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                        {msg.lead_source.toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {editingMessageId === msg.lead_id ? (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Subject:</label>
                                    <input
                                        type="text"
                                        value={editedMessage.subject}
                                        onChange={(e) => setEditedMessage({...editedMessage, subject: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Message:</label>
                                    <textarea
                                        value={editedMessage.message}
                                        onChange={(e) => setEditedMessage({...editedMessage, message: e.target.value})}
                                        rows="6"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleUpdateMessage(msg.message_id || msg._id)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingMessageId(null)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center gap-2"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <p className="text-sm font-semibold text-gray-900">📧 {msg.subject}</p>
                                    <button
                                        onClick={() => {
                                            setEditingMessageId(msg.lead_id);
                                            setEditedMessage({ subject: msg.subject, message: msg.message });
                                        }}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                </div>
                                <p className="text-sm text-gray-700 whitespace-pre-line">{msg.message}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
