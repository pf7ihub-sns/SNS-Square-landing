import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContracts, setTotalContracts] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  
  // NEW: Store global stats separately
  const [stats, setStats] = useState({
    total: 0,
    expiring: 0,
    active: 0,
    expired: 0
  });
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const CONTRACTS_PER_PAGE = 10;

  // Calculate contract status based on expiry date
  const getContractStatus = (contract) => {
    const expiryDate = contract.expiryDate ? new Date(contract.expiryDate) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!expiryDate || isNaN(expiryDate.getTime())) {
      return { status: 'active', label: 'Active', color: 'green' };
    }
    
    const daysDiff = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) {
      return { status: 'expired', label: 'Expired', color: 'red' };
    } else if (daysDiff <= 30) {
      return { status: 'expiring', label: `Expiring in ${daysDiff} days`, color: 'yellow' };
    } else if (daysDiff <= 60) {
      return { status: 'upcoming', label: `${daysDiff} days left`, color: 'blue' };
    } else {
      return { status: 'active', label: 'Active', color: 'green' };
    }
  };

  // Filter and categorize contracts (for current page only)
  const categorizeContracts = (contractsList) => {
    const categorized = {
      expiring: [],
      expired: [],
      active: [],
      recentlyUploaded: []
    };
    
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    contractsList.forEach(contract => {
      const statusInfo = getContractStatus(contract);
      contract.statusInfo = statusInfo;
      
      if (statusInfo.status === 'expiring') {
        categorized.expiring.push(contract);
      } else if (statusInfo.status === 'expired') {
        categorized.expired.push(contract);
      } else {
        categorized.active.push(contract);
      }
      
      const createdDate = contract.createdDate ? new Date(contract.createdDate) : null;
      if (createdDate && createdDate >= sevenDaysAgo) {
        categorized.recentlyUploaded.push(contract);
      }
    });
    
    categorized.expiring.sort((a, b) => {
      const dateA = new Date(a.expiryDate);
      const dateB = new Date(b.expiryDate);
      return dateA - dateB;
    });
    
    return categorized;
  };

  // NEW: Fetch statistics from backend
  const fetchStatistics = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/contract-management-system/contracts/stats`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const data = await response.json();
      
      setStats({
        total: data.total_contracts || 0,
        expiring: data.expiring_soon || 0,
        active: data.active || 0,
        expired: data.expired || 0
      });
      
      console.log('✅ Statistics loaded:', data);
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
      // Don't show error toast for stats - non-critical
    }
  };

  // Fetch contracts for current page
  const fetchContracts = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(
        `${API_BASE_URL}/contract-management-system/contracts?page=${currentPage}&limit=${CONTRACTS_PER_PAGE}`
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch contracts');
      }

      const data = await response.json();
      console.log('📊 API Response:', data);
      
      const formattedContracts = data.contracts.map(contract => ({
        id: contract.contract_id,
        name: contract.contract_name || `Contract ${contract.contract_id}`,
        type: contract.contract_type || 'Unknown Type',
        status: contract.status || 'Active',
        party: contract.party_name || 'N/A',
        createdDate: contract.created_at ? new Date(contract.created_at).toISOString().split('T')[0] : null,
        expiryDate: contract.expiry_date || null
      }));

      console.log('✅ Formatted contracts:', formattedContracts);
      
      setContracts(formattedContracts);
      setTotalPages(data.pagination?.total_pages || Math.ceil((data.total || 1) / CONTRACTS_PER_PAGE));
      setTotalContracts(data.pagination?.total || data.total || 0);
    } catch (err) {
      console.error('❌ Failed to fetch contracts:', err);
      setError(err.message);
      toast.error(`Failed to load contracts: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load stats and contracts on mount and page change
  useEffect(() => {
    fetchStatistics();
    fetchContracts();
  }, [currentPage, API_BASE_URL]);

  const categorized = categorizeContracts(contracts);
  
  // Filter contracts based on selected filter
  const getFilteredContracts = () => {
    switch (filterStatus) {
      case 'expiring':
        return categorized.expiring;
      case 'expired':
        return categorized.expired;
      case 'active':
        return categorized.active;
      default:
        return contracts;
    }
  };

  const filteredContracts = getFilteredContracts();

  const getStatusColor = (statusInfo) => {
    switch (statusInfo?.color) {
      case 'green': return 'bg-green-100 text-green-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'red': return 'bg-red-100 text-red-800';
      case 'blue': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewContract = (contractId, e) => {
    if (e) {
      e.stopPropagation();
    }
    
    const contract = contracts.find(c => c.id === contractId);
    
    if (contract) {
      const validStatuses = ['analyzed', 'active', 'Active', 'Processed'];
      if (validStatuses.includes(contract.status) || import.meta.env.DEV) {
        navigate(`/agent-playground/agent/contract-management-system/report/${contractId}`);
      } else {
        toast.info(`Contract is still being processed (Status: ${contract.status})`);
      }
    } else {
      toast.error('Contract not found');
    }
  };

  const handleDeleteContract = async (contractId, e) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this contract?')) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/contract-management-system/contract/${contractId}`,
          { method: 'DELETE' }
        );
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || 'Failed to delete contract');
        }
        
        setContracts(contracts.filter(contract => contract.id !== contractId));
        setTotalContracts(prev => prev - 1);
        
        // Refresh statistics after deletion
        fetchStatistics();
        
        toast.success('Contract deleted successfully');
      } catch (err) {
        console.error('Failed to delete contract:', err);
        toast.error(`Error: ${err.message}`);
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  if (loading && contracts.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#155DFC] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contracts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 mt-25">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Contract Dashboard</h2>
            <p className="text-sm text-gray-500 mt-1">
              {stats.total} {stats.total === 1 ? 'contract' : 'contracts'} found
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/agent-playground/agent/contract-management-system/chatbot')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <FileText size={16} />
              Create New Contract
            </button>
            <button 
              onClick={() => navigate('/agent-playground/agent/contract-management-system/upload')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Upload size={16} />
              Upload Contract
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards - NOW USING GLOBAL STATS */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Contracts</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div 
            className="bg-white p-6 rounded-lg border-2 border-red-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setFilterStatus('expiring')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">⚠️ Expiring Soon</p>
                <p className="text-2xl font-semibold text-red-600">
                  {stats.expiring}
                </p>
                <p className="text-xs text-gray-500 mt-1">Within 30 days</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div 
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setFilterStatus('active')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Contracts</p>
                <p className="text-2xl font-semibold text-green-600">
                  {stats.active}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div 
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setFilterStatus('expired')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Expired</p>
                <p className="text-2xl font-semibold text-gray-600">
                  {stats.expired}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <XCircle className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Expiring Soon Alert */}
        {stats.expiring > 0 && filterStatus === 'all' && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
              <div>
                <h3 className="font-semibold text-red-800">
                  {stats.expiring} {stats.expiring === 1 ? 'contract' : 'contracts'} expiring soon!
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  Review contracts expiring within 30 days
                </p>
                <button
                  onClick={() => setFilterStatus('expiring')}
                  className="mt-3 text-sm font-medium text-red-700 hover:text-red-900 underline"
                >
                  View all expiring contracts →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              filterStatus === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Contracts ({contracts.length})
          </button>
          <button
            onClick={() => setFilterStatus('expiring')}
            className={`px-4 py-2 font-medium text-sm transition-colors flex items-center gap-1 ${
              filterStatus === 'expiring'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Clock size={16} />
            Expiring Soon ({categorized.expiring.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              filterStatus === 'active'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Active ({categorized.active.length})
          </button>
          <button
            onClick={() => setFilterStatus('expired')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              filterStatus === 'expired'
                ? 'text-gray-600 border-b-2 border-gray-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Expired ({categorized.expired.length})
          </button>
        </div>

        {/* Contracts Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900">
              {filterStatus === 'all' && 'All Contracts'}
              {filterStatus === 'expiring' && 'Expiring Soon (Next 30 Days)'}
              {filterStatus === 'active' && 'Active Contracts'}
              {filterStatus === 'expired' && 'Expired Contracts'}
            </h4>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Party
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContracts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center">
                        <FileText className="h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-gray-500">
                          {filterStatus === 'expiring' && 'No contracts expiring soon'}
                          {filterStatus === 'active' && 'No active contracts'}
                          {filterStatus === 'expired' && 'No expired contracts'}
                          {filterStatus === 'all' && 'No contracts found'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredContracts.map((contract) => (
                    <tr 
                      key={contract.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={(e) => {
                        if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                          handleViewContract(contract.id, e);
                        }
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{contract.name}</div>
                            <div className="text-sm text-gray-500">ID: {contract.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{contract.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          getStatusColor(contract.statusInfo)
                        }`}>
                          {contract.statusInfo?.label || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contract.party}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contract.createdDate || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className={contract.statusInfo?.status === 'expiring' || contract.statusInfo?.status === 'expired' 
                          ? 'text-red-600 font-medium' 
                          : 'text-gray-500'
                        }>
                          {contract.expiryDate || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => handleViewContract(contract.id, e)}
                          className="text-blue-600 hover:text-blue-900 mr-4 px-2 py-1 hover:bg-blue-50 rounded"
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => handleDeleteContract(contract.id, e)}
                          className="text-red-600 hover:text-red-900 px-2 py-1 hover:bg-red-50 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredContracts.length > 0 && totalPages > 1 && (
            <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;