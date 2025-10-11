import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  Mail, 
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Download,
  Plus,
  Search,
  Filter
} from 'lucide-react';

const RenewalAgent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Simulated API calls - replace with actual endpoints
  const API_BASE = 'http://localhost:8000/subscription-renewal';

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    } else if (activeTab === 'subscriptions') {
      fetchSubscriptions();
    } else if (activeTab === 'history') {
      fetchNotifications();
    }
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/dashboard`);
      const data = await response.json();
      setDashboardStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch(`${API_BASE}/subscriptions?limit=50`);
      const data = await response.json();
      setSubscriptions(data.subscriptions || []);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE}/notifications?limit=100`);
      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const runAgent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/run`, { method: 'POST' });
      const data = await response.json();
      setAgentStatus(data);
      alert(`Agent run completed!\nProcessed: ${data.subscriptions_processed}\nSent: ${data.notifications_sent}`);
      fetchDashboardStats();
    } catch (error) {
      alert('Failed to run agent: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getDaysColor = (days) => {
    if (days <= 7) return 'text-red-600 bg-red-50';
    if (days <= 15) return 'text-orange-600 bg-orange-50';
    return 'text-blue-600 bg-blue-50';
  };

  const getStatusBadge = (status) => {
    const colors = {
      sent: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Subscription Renewal Agent</h1>
              <p className="text-sm text-gray-600 mt-1">Automate subscription renewal notifications and manage subscriptions</p>
            </div>
            <button
              onClick={runAgent}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Run Agent Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['dashboard', 'subscriptions', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={<Users className="w-6 h-6" />}
                title="Total Subscriptions"
                value={dashboardStats?.total_subscriptions || 0}
                color="blue"
              />
              <StatCard
                icon={<AlertTriangle className="w-6 h-6" />}
                title="Expiring Soon"
                value={dashboardStats?.expiring_soon || 0}
                color="orange"
                badge="Next 30 Days"
              />
              <StatCard
                icon={<Mail className="w-6 h-6" />}
                title="Notifications (7d)"
                value={dashboardStats?.notifications_last_7_days || 0}
                color="purple"
              />
              <StatCard
                icon={<TrendingUp className="w-6 h-6" />}
                title="Success Rate"
                value={`${dashboardStats?.success_rate || 0}%`}
                color="green"
              />
            </div>

            {/* Latest Run Info */}
            {dashboardStats?.latest_run && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  Latest Agent Run
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Run ID</p>
                    <p className="font-mono text-sm mt-1">{dashboardStats.latest_run.run_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      dashboardStats.latest_run.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {dashboardStats.latest_run.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Started At</p>
                    <p className="text-sm mt-1">{dashboardStats.latest_run.started_at ? new Date(dashboardStats.latest_run.started_at).toLocaleString() : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Notifications Sent</p>
                    <p className="text-lg font-semibold mt-1">{dashboardStats.latest_run.notifications_sent}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow p-4 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search subscriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                <Filter className="w-5 h-5" />
                Filter
              </button>
            </div>

            {/* Subscriptions Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renewal Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Left</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscriptions
                    .filter(sub => 
                      sub.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      sub.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .slice(0, 20)
                    .map((sub, idx) => {
                      const renewalDate = new Date(sub.renewal_date);
                      const today = new Date();
                      const daysLeft = Math.ceil((renewalDate - today) / (1000 * 60 * 60 * 24));
                      
                      return (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{sub.customer_name}</div>
                              <div className="text-sm text-gray-500">{sub.customer_email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{sub.subscription_type}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{renewalDate.toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDaysColor(daysLeft)}`}>
                              {daysLeft} days
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">${sub.price.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {sub.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Notification History
              </h3>
            </div>
            <div className="divide-y">
              {notifications.slice(0, 50).map((notif, idx) => (
                <div key={idx} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {notif.status === 'sent' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                        )}
                        <span className="font-medium text-gray-900">{notif.customer_email}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(notif.status)}`}>
                          {notif.status}
                        </span>
                      </div>
                      <div className="ml-8 space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Type:</span> {notif.notification_type.replace(/_/g, ' ')}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Sent:</span> {new Date(notif.sent_at).toLocaleString()}
                        </p>
                        {notif.error_message && (
                          <p className="text-sm text-red-600">
                            <span className="font-medium">Error:</span> {notif.error_message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color, badge }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {badge && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{badge}</span>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
};

export default RenewalAgent;