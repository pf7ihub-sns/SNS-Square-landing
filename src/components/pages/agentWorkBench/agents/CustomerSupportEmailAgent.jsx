import { useState, useEffect, useRef } from 'react';
import {
  Mail,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  Send,
  Info,
  X,
  Calendar,
  User,
  Circle
} from 'lucide-react';

export default function EmailDashboard() {
  const [emails, setEmails] = useState([]);
  const [stats, setStats] = useState({ total: 0, success: 0, partial: 0, failed: 0 });
  const [currentFilter, setCurrentFilter] = useState('all');
  const [isConnected, setIsConnected] = useState(false);
  const [toasts, setToasts] = useState([]);
  const wsRef = useRef(null);
  const reconnectIntervalRef = useRef(null);

  const WS_URL = 'ws://localhost:8000/ws/email-notifications';
  const API_URL = 'http://localhost:8000';

  useEffect(() => {
    connectWebSocket();
    loadHistory();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectIntervalRef.current) clearInterval(reconnectIntervalRef.current);
    };
  }, []);

  const connectWebSocket = () => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      if (reconnectIntervalRef.current) clearInterval(reconnectIntervalRef.current);
      showToast('success', 'Connected', 'Real-time monitoring active');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleMessage(message);
    };

    ws.onclose = () => {
      setIsConnected(false);
      reconnectIntervalRef.current = setInterval(connectWebSocket, 5000);
    };
  };

  const handleMessage = (message) => {
    switch (message.type) {
      case 'history':
        setEmails(message.data);
        break;
      case 'email_received':
        showToast('info', 'New Email', `From: ${message.data.sender}`);
        addEmail(message.data, 'info');
        break;
      case 'email_processed':
        updateEmail(message.data);
        showToast('success', 'Email Responded', `Successfully processed`);
        break;
      case 'email_failed':
        updateEmail(message.data);
        showToast('error', 'Email Failed', `Processing failed`);
        break;
      case 'email_skipped':
        updateEmail(message.data);
        showToast('warning', 'Email Skipped', message.data.reason);
        break;
    }
  };

  const addEmail = (data, type) => {
    setEmails(prev => [{ ...data, type }, ...prev].slice(0, 100));
  };

  const updateEmail = (data) => {
    setEmails(prev => {
      const index = prev.findIndex(e => e.id === data.id);
      const type = getEmailType(data.status);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = { ...updated[index], ...data, type };
        return updated;
      }
      return [{ ...data, type }, ...prev].slice(0, 100);
    });
  };

  const getEmailType = (status) => {
    const typeMap = {
      'answered': 'success',
      'partial': 'warning',
      'error': 'error',
      'unanswered': 'error',
      'not_relevant': 'info',
      'processing': 'info'
    };
    return typeMap[status] || 'info';
  };

  const showToast = (type, title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const loadHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/email-history`);
      const data = await response.json();
      if (data.success) setEmails(data.emails);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  useEffect(() => {
    const total = emails.length;
    const success = emails.filter(e => e.status === 'answered').length;
    const partial = emails.filter(e => e.status === 'partial').length;
    const failed = emails.filter(e => ['error', 'unanswered'].includes(e.status)).length;
    setStats({ total, success, partial, failed });
  }, [emails]);

  const filteredEmails = currentFilter === 'all'
    ? emails
    : emails.filter(e => e.type === currentFilter);

  const getStatusConfig = (status) => {
    const configs = {
      'answered': { label: 'Answered', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', dot: 'bg-green-500' },
      'partial': { label: 'Partial', icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', dot: 'bg-yellow-500' },
      'error': { label: 'Failed', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500' },
      'unanswered': { label: 'Escalated', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50', dot: 'bg-orange-500' },
      'not_relevant': { label: 'Skipped', icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', dot: 'bg-blue-500' },
      'processing': { label: 'Processing', icon: Clock, color: 'text-gray-600', bg: 'bg-gray-50', dot: 'bg-gray-500' }
    };
    return configs[status] || configs['processing'];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
        {toasts.map(toast => {
          const iconMap = {
            'success': <CheckCircle className="w-5 h-5 text-green-600" />,
            'error': <XCircle className="w-5 h-5 text-red-600" />,
            'warning': <AlertTriangle className="w-5 h-5 text-yellow-600" />,
            'info': <Info className="w-5 h-5 text-blue-600" />
          };
          return (
            <div key={toast.id} className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-start gap-3">
              {iconMap[toast.type]}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm">{toast.title}</div>
                <div className="text-sm text-gray-600 truncate">{toast.message}</div>
              </div>
              <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}>
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Email Agent Dashboard</h1>
                <p className="text-sm text-gray-500 mt-0.5">Monitor and manage customer support emails</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${isConnected ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
              <Circle className={`w-2 h-2 ${isConnected ? 'fill-green-600' : 'fill-red-600'}`} />
              {isConnected ? 'Live' : 'Reconnecting'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4 space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Emails</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-3xl font-semibold text-green-600 mt-2">{stats.success}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Partial</p>
                <p className="text-3xl font-semibold text-yellow-600 mt-2">{stats.partial}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-3xl font-semibold text-red-600 mt-2">{stats.failed}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Email List */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Emails</h2>
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'success', label: 'Success' },
                  { value: 'warning', label: 'Partial' },
                  { value: 'error', label: 'Failed' }
                ].map(filter => (
                  <button
                    key={filter.value}
                    onClick={() => setCurrentFilter(filter.value)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${currentFilter === filter.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {filteredEmails.length === 0 ? (
              <div className="px-6 py-20 text-center">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No emails yet</h3>
                <p className="text-sm text-gray-500">Emails will appear here when they arrive</p>
              </div>
            ) : (
              filteredEmails.map((email, index) => {
                const statusConfig = getStatusConfig(email.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div key={email.id || index} className="px-6 py-5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{email.sender}</div>
                          <div className="text-sm text-gray-600 truncate mt-0.5">{email.subject}</div>
                        </div>
                      </div>
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} flex-shrink-0`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(email.received_at || email.timestamp).toLocaleString()}
                      </span>
                      {email.total_queries > 0 && (
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {email.total_queries} queries
                        </span>
                      )}
                      {email.answered > 0 && (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-3.5 h-3.5" />
                          {email.answered} answered
                        </span>
                      )}
                      {email.unanswered > 0 && (
                        <span className="flex items-center gap-1 text-red-600">
                          <XCircle className="w-3.5 h-3.5" />
                          {email.unanswered} unanswered
                        </span>
                      )}
                      {email.email_sent && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <Send className="w-3.5 h-3.5" />
                          Sent
                        </span>
                      )}
                    </div>

                    {email.response_preview && (
                      <div className="bg-blue-50 border border-blue-100 rounded-md p-3 text-sm text-gray-700 mb-2">
                        <div className="font-medium text-gray-900 mb-1">Response:</div>
                        {email.response_preview}
                      </div>
                    )}

                    {email.reason && (
                      <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3 text-sm">
                        <div className="font-medium text-gray-900 mb-1">Reason:</div>
                        <div className="text-gray-700">{email.reason}</div>
                      </div>
                    )}

                    {email.message && !email.reason && (
                      <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm text-gray-700">
                        {email.message}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}