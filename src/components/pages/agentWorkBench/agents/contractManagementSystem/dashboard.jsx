import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContracts, setTotalContracts] = useState(0);
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const CONTRACTS_PER_PAGE = 10;

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        
        // Direct API call to fetch contracts with pagination
        const response = await fetch(
          `${API_BASE_URL}/contract-management-system/contracts?page=${currentPage}&limit=${CONTRACTS_PER_PAGE}`
        );
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || 'Failed to fetch contracts');
        }

        const data = await response.json();
        
        // Transform the data to match the frontend format
        const formattedContracts = data.contracts.map(contract => ({
          id: contract.contract_id,
          name: contract.contract_name || `Contract ${contract.contract_id}`,
          type: contract.contract_type || 'Unknown Type',
          status: contract.status || 'Active',
          party: contract.party_name || 'N/A',
          createdDate: contract.created_at ? new Date(contract.created_at).toISOString().split('T')[0] : 'N/A',
          expiryDate: contract.expiry_date || 'N/A'
        }));

        setContracts(formattedContracts);
        setTotalPages(Math.ceil((data.total_count || 1) / CONTRACTS_PER_PAGE));
        setTotalContracts(data.total_count || 0);
      } catch (err) {
        console.error('Failed to fetch contracts:', err);
        setError(err.message);
        toast.error(`Failed to load contracts: ${err.message}`);
        
        // Fallback to sample data in case of error
        const sampleContracts = [
          { id: 1, name: 'Service Agreement - TechCorp Solutions', type: 'Service Agreement', status: 'Active', party: 'TechCorp Solutions Inc.', createdDate: '2024-01-15', expiryDate: '2025-01-15' },
          { id: 2, name: 'Employment Contract - John Smith', type: 'Employment Contract', status: 'Active', party: 'John Smith', createdDate: '2024-02-10', expiryDate: '2026-02-10' },
          { id: 3, name: 'NDA - Confidential Project', type: 'Non-Disclosure Agreement', status: 'Active', party: 'Confidential Client', createdDate: '2024-03-05', expiryDate: '2025-03-05' },
          { id: 4, name: 'Sales Agreement - Product License', type: 'Sales Agreement', status: 'Pending', party: 'License Buyer', createdDate: '2024-03-20', expiryDate: '2025-03-20' },
          { id: 5, name: 'Partnership Agreement - Joint Venture', type: 'Partnership Agreement', status: 'Active', party: 'Joint Venture Partner', createdDate: '2024-01-30', expiryDate: '2027-01-30' },
          { id: 6, name: 'Lease Agreement - Office Space', type: 'Lease Agreement', status: 'Active', party: 'Property Owner', createdDate: '2024-02-15', expiryDate: '2025-02-15' },
          { id: 7, name: 'Consulting Agreement - Project Alpha', type: 'Consulting Agreement', status: 'Completed', party: 'Project Alpha Client', createdDate: '2024-01-10', expiryDate: '2024-06-10' },
          { id: 8, name: 'Service Agreement - Maintenance', type: 'Service Agreement', status: 'Active', party: 'Maintenance Client', createdDate: '2024-03-01', expiryDate: '2025-03-01' },
          { id: 9, name: 'Employment Contract - Sarah Johnson', type: 'Employment Contract', status: 'Active', party: 'Sarah Johnson', createdDate: '2024-02-25', expiryDate: '2026-02-25' },
          { id: 10, name: 'NDA - Research Collaboration', type: 'Non-Disclosure Agreement', status: 'Active', party: 'Research Partner', createdDate: '2024-03-10', expiryDate: '2025-03-10' }
        ];
        
        setContracts(sampleContracts);
        setTotalPages(1);
        setTotalContracts(sampleContracts.length);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [currentPage, API_BASE_URL]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': 
      case 'Expired':
        return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewContract = (contractId, e) => {
    // Prevent the row click handler from firing when clicking the view button
    if (e) {
      e.stopPropagation();
    }
    
    // First check if the contract exists and is processed
    const contract = contracts.find(c => c.id === contractId);
    console.log('Viewing contract:', contractId, contract);
    
    if (contract) {
      // Allow viewing if status is Processed, Active, Analyzed, or if we're in development
      const validStatuses = ['Processed', 'Active', 'analyzed'];
      if (validStatuses.includes(contract.status) || import.meta.env.DEV) {
        console.log('Navigating to report page for contract:', contractId);
        navigate(`/agent-playground/agent/contract-management-system/report/${contractId}`);
      } else {
        console.log('Contract not ready for viewing. Status:', contract.status);
        toast.info(`This contract is still being processed (Status: ${contract.status}). Please check back later.`);
      }
    } else {
      console.error('Contract not found:', contractId);
      toast.error('Contract not found. Please refresh the page and try again.');
    }
  };

  const handleDeleteContract = async (contractId, e) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this contract? This action cannot be undone.')) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/contract-management-system/contract/${contractId}`,
          { method: 'DELETE' }
        );
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || 'Failed to delete contract');
        }
        
        // Refresh the contracts list
        setContracts(contracts.filter(contract => contract.id !== contractId));
        setTotalContracts(prev => prev - 1);
        toast.success('Contract deleted successfully');
      } catch (err) {
        console.error('Failed to delete contract:', err);
        toast.error(`Error: ${err.message || 'Failed to delete contract'}`);
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

  if (error && contracts.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <p className="text-gray-600 mb-4">Showing sample data instead.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#155DFC] text-white rounded-lg font-medium hover:bg-[#0d4ad4]"
          >
            Retry
          </button>
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
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              {totalContracts} {totalContracts === 1 ? 'contract' : 'contracts'} found
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/agent-playground/agent/contract-management-system/create')}
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

      {/* Main Content */}
      <div className="px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Contracts</p>
                <p className="text-2xl font-semibold text-gray-900">{totalContracts}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Contracts</p>
                <p className="text-2xl font-semibold text-green-600">
                  {contracts.filter(c => c.status === 'Active').length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Review</p>
                <p className="text-2xl font-semibold text-yellow-600">
                  {contracts.filter(c => c.status === 'Pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Expiring Soon</p>
                <p className="text-2xl font-semibold text-red-600">
                  {contracts.filter(c => {
                    const expiryDate = new Date(c.expiryDate);
                    const today = new Date();
                    const thirtyDaysFromNow = new Date();
                    thirtyDaysFromNow.setDate(today.getDate() + 30);
                    return expiryDate > today && expiryDate <= thirtyDaysFromNow;
                  }).length}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Contracts Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Contracts</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contracts.map((contract) => {
                  // Add debug logging
                  console.log('Rendering contract row:', contract.id, contract.status);
                  return (
                  <tr 
                    key={contract.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={(e) => {
                      // Only navigate if the click wasn't on a button or link
                      if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A' && !e.target.closest('button') && !e.target.closest('a')) {
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
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contract.party}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contract.createdDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contract.expiryDate}
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
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )})
                }
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
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
                  Showing <span className="font-medium">{(currentPage - 1) * CONTRACTS_PER_PAGE + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * CONTRACTS_PER_PAGE, totalContracts)}
                  </span>{' '}
                  of <span className="font-medium">{totalContracts}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Calculate page numbers to show (current page in the middle if possible)
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    if (pageNum > 0 && pageNum <= totalPages) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
