import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  
  const contracts = [
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

  const totalPages = 5;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewContract = (contractId) => {
    navigate(`/agent-playground/agent/contract-management-system/report/${contractId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 mt-25">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Contract Management System</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/agent-playground/agent/contract-management-system/build')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <FileText size={18} />
              Build Contract
            </button>
            <button 
              onClick={() => navigate('/agent-playground/agent/contract-management-system/upload')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Upload size={18} />
              Upload Contract
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Contracts <span className="text-blue-500 text-sm font-medium ml-2">Total: 10</span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">View and manage all your contracts in one place</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">S.NO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">CONTRACT NAME</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">TYPE</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">STATUS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">PARTY</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">CREATED DATE</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">EXPIRY DATE</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ACTION</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contracts.map((contract, index) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contract.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{contract.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{contract.party}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{contract.createdDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{contract.expiryDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button 
                        onClick={() => handleViewContract(contract.id)}
                        className="text-blue-500 hover:text-blue-700 font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2">
              <button 
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                ‹ Back
              </button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button 
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;