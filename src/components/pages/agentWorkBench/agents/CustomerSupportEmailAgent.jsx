
import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, Clock, AlertCircle, MessageSquare, RefreshCw, Inbox, Activity, Zap, Settings, TrendingUp } from 'lucide-react';

const CustomerSupportEmailAgent = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [agentStatus, setAgentStatus] = useState(null);
  const [showAgentSteps, setShowAgentSteps] = useState(false);

  const API_BASE_URL = 'http://localhost:8000';

  // Fetch agent status on mount
  useEffect(() => {
    fetchAgentStatus();
    // Poll for new emails every 10 seconds
    const interval = setInterval(fetchProcessedEmails, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAgentStatus = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/email-agent/agent-status`);
      if (res.ok) {
        const data = await res.json();
        setAgentStatus(data);
      }
    } catch (err) {
      console.error('Error fetching agent status:', err);
    }
  };

  const fetchProcessedEmails = async () => {
    // TODO: Implement endpoint to get processed emails from database
    // For now, this is a placeholder for when you add email storage
  };

  const testAgent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/email-agent/test-agent`, {
        method: 'POST'
      });
      const data = await res.json();
      
      if (data.test === 'passed') {
        alert('Agent test passed! Check console for details.');
        console.log('Agent Test Result:', data.result);
        
        // Add test email to display
        const testEmail = {
          id: 'test-' + Date.now(),
          sender: 'test@example.com',
          subject: 'Test Query',
          body: 'How long does delivery take? What is your refund policy?',
          status: data.result.status,
          response: data.result.output,
          timestamp: new Date().toISOString(),
          analysis: data.result.analysis,
          agent_steps: data.result.intermediate_steps || []
        };
        
        setEmails(prev => [testEmail, ...prev]);
        setSelectedEmail(testEmail);
      }
    } catch (err) {
      console.error('Error testing agent:', err);
      alert('Agent test failed. Check console.');
    } finally {
      setLoading(false);
    }
  };

  const processManualEmail = async (sender, subject, body) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/email-agent/process-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender, subject, body })
      });

      if (res.ok) {
        const result = await res.json();
        
        const newEmail = {
          id: 'manual-' + Date.now(),
          sender,
          subject,
          body,
          status: result.status,
          response: result.data?.output || '',
          timestamp: new Date().toISOString(),
          total_queries: result.data?.total_queries || 0,
          answered: result.data?.answered || 0,
          unanswered: result.data?.unanswered || 0,
          analysis: result.data,
          agent_steps: result.agent_steps || []
        };
        
        setEmails(prev => [newEmail, ...prev]);
        setSelectedEmail(newEmail);
        alert('Email processed successfully!');
      }
    } catch (err) {
      console.error('Error processing email:', err);
      alert('Failed to process email');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'answered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'partial':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'not_relevant':
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
      case 'no_queries_found':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'unanswered':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'processed':
        return <Activity className="w-5 h-5 text-blue-500" />;
      default:
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered':
        return 'bg-green-50 border-green-300';
      case 'partial':
        return 'bg-yellow-50 border-yellow-300';
      case 'not_relevant':
        return 'bg-gray-50 border-gray-300';
      case 'no_queries_found':
        return 'bg-orange-50 border-orange-300';
      case 'unanswered':
        return 'bg-red-50 border-red-300';
      default:
        return 'bg-blue-50 border-blue-300';
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      answered: 'bg-green-100 text-green-800',
      partial: 'bg-yellow-100 text-yellow-800',
      not_relevant: 'bg-gray-100 text-gray-800',
      unanswered: 'bg-red-100 text-red-800',
      processed: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-blue-100 text-blue-800';
  };

  const handleFeedback = async (emailId, feedbackText, ratingValue) => {
    if (!feedbackText.trim()) {
      alert('Please enter feedback before submitting');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/email-agent/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_id: emailId,
          feedback: feedbackText,
          rating: ratingValue
        })
      });

      if (res.ok) {
        alert('Feedback submitted successfully!');
        setFeedback('');
        setRating(0);
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert('Failed to submit feedback');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 px-4">
      <div className="max-w-7xl mx-auto mt-18">
        {/* Header with Agent Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Zap className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  LangChain Email Agent
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  AI-powered customer support with ReAct reasoning
                </p>
                {agentStatus && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`w-2 h-2 rounded-full ${agentStatus.status === 'ready' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="text-xs text-gray-600">
                      {agentStatus.agent_type} • {agentStatus.tools_available?.length || 0} tools
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={testAgent}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm disabled:bg-gray-400"
              >
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Test Agent</span>
              </button>
              <button
                onClick={fetchAgentStatus}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {agentStatus && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Status</p>
                  <p className="text-lg font-bold text-green-600 capitalize">{agentStatus.status}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Tools</p>
                  <p className="text-lg font-bold text-indigo-600">{agentStatus.tools_available?.length || 0}</p>
                </div>
                <Settings className="w-8 h-8 text-indigo-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Processed</p>
                  <p className="text-lg font-bold text-blue-600">{emails.length}</p>
                </div>
                <Mail className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Model</p>
                  <p className="text-xs font-semibold text-gray-700">Gemini Flash</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Email List - Left Panel */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4 max-h-[calc(100vh-350px)] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Inbox className="w-5 h-5 text-indigo-600" />
                Processed Emails
              </h2>
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-medium">
                {emails.length}
              </span>
            </div>

            {emails.length === 0 ? (
              <div className="text-center py-12">
                <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No emails processed yet</p>
                <p className="text-xs text-gray-400 mt-1 mb-4">
                  Test the agent or wait for emails
                </p>
                <button
                  onClick={testAgent}
                  className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Run Test Email
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {emails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      selectedEmail?.id === email.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 bg-white hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {email.subject}
                        </p>
                        <p className="text-xs text-gray-600 truncate mt-0.5">
                          {email.sender}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ml-2 ${getStatusBadge(email.status)}`}>
                        {email.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(email.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Email Detail - Right Panel */}
          <div className="lg:col-span-2">
            {!selectedEmail ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Email Selected
                </h3>
                <p className="text-sm text-gray-600">
                  Select an email to view agent reasoning and response
                </p>
              </div>
            ) : (
              <div className={`rounded-xl shadow-sm border-2 p-4 sm:p-6 ${getStatusColor(selectedEmail.status)}`}>
                {/* Email Header */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedEmail.status)}
                      <h2 className="text-xl font-bold text-gray-900 capitalize">
                        {selectedEmail.status.replace('_', ' ')}
                      </h2>
                    </div>
                    {selectedEmail.analysis && (
                      <div className="flex gap-2 text-xs">
                        <span className="bg-white px-3 py-1.5 rounded-full font-medium text-gray-700">
                          {selectedEmail.analysis.total_queries || 0} queries
                        </span>
                        <span className="bg-green-100 px-3 py-1.5 rounded-full font-medium text-green-700">
                          {selectedEmail.analysis.answered || 0} answered
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {selectedEmail.subject}
                  </h3>
                  <p className="text-sm text-gray-600">From: {selectedEmail.sender}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(selectedEmail.timestamp).toLocaleString()}
                  </p>
                </div>

                {/* Agent Steps */}
                {selectedEmail.agent_steps && selectedEmail.agent_steps.length > 0 && (
                  <div className="mb-4">
                    <button
                      onClick={() => setShowAgentSteps(!showAgentSteps)}
                      className="flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900 mb-2"
                    >
                      <Activity className="w-4 h-4" />
                      Agent Reasoning ({selectedEmail.agent_steps.length} steps)
                      <span className="text-xs">
                        {showAgentSteps ? '▼' : '▶'}
                      </span>
                    </button>
                    
                    {showAgentSteps && (
                      <div className="bg-white rounded-lg p-3 border border-indigo-200 space-y-2">
                        {selectedEmail.agent_steps.map((step, idx) => (
                          <div key={idx} className="text-xs border-l-2 border-indigo-300 pl-3 py-1">
                            <div className="font-semibold text-indigo-900">
                              {idx + 1}. {step.tool}
                            </div>
                            <div className="text-gray-600 mt-1">
                              Output: {step.output}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Original Email Body */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">
                    Original Email
                  </h3>
                  <div className="bg-white rounded-lg p-3 border border-gray-200 text-sm">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedEmail.body}</p>
                  </div>
                </div>

                {/* AI Response */}
                {selectedEmail.response && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-indigo-600" />
                      AI Generated Response
                    </h3>
                    <div className="bg-white rounded-lg p-3 border border-indigo-200 text-sm">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedEmail.response}</p>
                    </div>
                  </div>
                )}

                {/* Feedback Section */}
                {selectedEmail.status !== 'not_relevant' && (
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">
                      Rate Agent Performance
                    </h3>
                    <div className="flex gap-2 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none mb-2"
                      placeholder="Was the agent's reasoning correct? Any improvements needed?"
                    />
                    <button
                      onClick={() => handleFeedback(selectedEmail.id, feedback, rating)}
                      disabled={!feedback.trim()}
                      className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Submit Feedback
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            LangChain ReAct Agent Pipeline
          </h3>
          <p className="text-xs text-blue-800">
            The agent uses ReAct (Reasoning + Acting) pattern to think step-by-step: 
            Classify → Extract Queries → Search Knowledge Base → Generate Response → Send Email.
            Each decision is logged and can be reviewed above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupportEmailAgent;