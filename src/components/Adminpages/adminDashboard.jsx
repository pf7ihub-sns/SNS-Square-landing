import React from 'react'
import { Link } from 'react-router-dom'
import { 
  FileText, 
  Briefcase, 
  TrendingUp, 
  Plus, 
  Calendar,
  Activity,
  UserPlus,
  Target,
  ArrowUpRight,
  PenTool,
  Edit3
} from 'lucide-react'
import { useBlogContext } from '../../contexts/BlogContext'

const AdminDashboard = () => {
  // Get real blog stats from context
  const { getStats } = useBlogContext()
  const blogStats = getStats()

  // Mock data for other sections - replace with actual data from your context/API
  const dashboardStats = {
    jobs: {
      total: 8,
      active: 6,
      applications: 156,
      newApplications: 23,
      growth: 8.3
    },
    useCases: {
      total: 12,
      published: 10,
      views: 8930,
      growth: 15.2
    }
  }

  const quickActions = [
    {
      title: 'Create New Blog',
      description: 'Write and publish a new blog post',
      icon: <PenTool className="w-5 h-5" />,
      link: '/admin/blog/new',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      textColor: 'text-blue-700'
    },
    {
      title: 'Manage All Blogs',
      description: 'View and edit existing blog posts',
      icon: <FileText className="w-5 h-5" />,
      link: '/admin/blogs',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      textColor: 'text-green-700'
    },
    {
      title: 'Job Openings',
      description: 'Manage job postings and applications',
      icon: <Briefcase className="w-5 h-5" />,
      link: '/admin/jobs',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      textColor: 'text-purple-700'
    },
    {
      title: 'Use Cases',
      description: 'Update use cases content',
      icon: <Target className="w-5 h-5" />,
      link: '/admin/usecases',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      textColor: 'text-orange-700'
    }
  ]

  const recentActivities = [
    {
      action: 'New blog published',
      title: 'AI in Supply Chain Management',
      time: '2 hours ago',
      icon: <FileText className="w-4 h-4 text-blue-500" />,
      status: 'published'
    },
    {
      action: 'Job application received',
      title: 'Senior Developer Position',
      time: '4 hours ago',
      icon: <UserPlus className="w-4 h-4 text-green-500" />,
      status: 'new'
    },
    {
      action: 'Blog updated',
      title: 'Machine Learning Trends',
      time: '1 day ago',
      icon: <Edit3 className="w-4 h-4 text-yellow-500" />,
      status: 'updated'
    },
    {
      action: 'Use case published',
      title: 'Healthcare AI Solutions',
      time: '2 days ago',
      icon: <Target className="w-4 h-4 text-purple-500" />,
      status: 'published'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back! Here's an overview of your content management system.</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Stats Overview - 3 Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Blog Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Blog Content</p>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{blogStats.total}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>{blogStats.recent} this week</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Published</p>
                <p className="text-lg font-bold text-green-600">{blogStats.published}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Drafts</p>
                <p className="text-lg font-bold text-yellow-600">{blogStats.draft}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Unpublished</p>
                <p className="text-lg font-bold text-red-600">{blogStats.unpublished}</p>
              </div>
            </div>
          </div>

          {/* Job Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Job Openings</p>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{dashboardStats.jobs.total}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>+{dashboardStats.jobs.growth}% growth</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Active Jobs</p>
                <p className="text-lg font-bold text-green-600">{dashboardStats.jobs.active}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Applications</p>
                <p className="text-lg font-bold text-blue-600">{dashboardStats.jobs.applications}</p>
              </div>
            </div>
          </div>

          {/* Use Cases Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Use Cases</p>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{dashboardStats.useCases.total}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>+{dashboardStats.useCases.growth}% views</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Published</p>
                <p className="text-lg font-bold text-purple-600">{dashboardStats.useCases.published}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Views</p>
                <p className="text-lg font-bold text-orange-600">{dashboardStats.useCases.views.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="group relative p-5 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${action.color} ${action.hoverColor} rounded-xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110`}>
                        {action.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-base font-semibold ${action.textColor} group-hover:text-gray-900 transition-colors`}>
                          {action.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{action.description}</p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600 truncate mt-1">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${
                      activity.status === 'published' ? 'bg-green-400' :
                      activity.status === 'new' ? 'bg-blue-400' :
                      activity.status === 'updated' ? 'bg-yellow-400' : 'bg-gray-400'
                    }`}></div>
                  </div>
                ))}
              </div>
              <Link
                to="/admin/activity"
                className="block w-full mt-6 text-center py-3 px-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                View all activities
              </Link>
            </div>
          </div>
        </div>

        {/* Content Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Blog Management */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Blog Management</h3>
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Published</span>
                <span className="text-sm font-bold text-green-600">{blogStats.published}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Drafts</span>
                <span className="text-sm font-bold text-yellow-600">{blogStats.draft}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-600">Unpublished</span>
                <span className="text-sm font-bold text-red-600">{blogStats.unpublished}</span>
              </div>
            </div>
            <Link
              to="/admin/blogs"
              className="block w-full mt-6 text-center py-3 px-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-semibold"
            >
              Manage All Blogs
            </Link>
          </div>

          {/* Job Management */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Job Openings</h3>
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Active Jobs</span>
                <span className="text-sm font-bold text-green-600">{dashboardStats.jobs.active}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Total Applications</span>
                <span className="text-sm font-bold text-blue-600">{dashboardStats.jobs.applications}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-600">New Today</span>
                <span className="text-sm font-bold text-purple-600">{dashboardStats.jobs.newApplications}</span>
              </div>
            </div>
            <Link
              to="/admin/jobs"
              className="block w-full mt-6 text-center py-3 px-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-semibold"
            >
              Manage Job Openings
            </Link>
          </div>

          {/* Use Cases Management */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Use Cases</h3>
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Total Cases</span>
                <span className="text-sm font-bold text-purple-600">{dashboardStats.useCases.total}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Published</span>
                <span className="text-sm font-bold text-green-600">{dashboardStats.useCases.published}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-600">Total Views</span>
                <span className="text-sm font-bold text-orange-600">{dashboardStats.useCases.views.toLocaleString()}</span>
              </div>
            </div>
            <Link
              to="/admin/usecases"
              className="block w-full mt-6 text-center py-3 px-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm font-semibold"
            >
              Manage Use Cases
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
