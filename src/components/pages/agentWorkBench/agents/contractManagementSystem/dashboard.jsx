import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Sample contract data
  const contracts = [
    { id: 1, name: 'Service Agreement - TechCorp Solutions', type: 'Service Agreement', status: 'Active', createdDate: '2024-01-15', expiryDate: '2025-01-15', party: 'TechCorp Solutions Inc.' },
    { id: 2, name: 'Employment Contract - John Smith', type: 'Employment Contract', status: 'Active', createdDate: '2024-02-10', expiryDate: '2026-02-10', party: 'John Smith' },
    { id: 3, name: 'NDA - Confidential Project', type: 'Non-Disclosure Agreement', status: 'Active', createdDate: '2024-03-05', expiryDate: '2025-03-05', party: 'Confidential Client' },
    { id: 4, name: 'Sales Agreement - Product License', type: 'Sales Agreement', status: 'Pending', createdDate: '2024-03-20', expiryDate: '2025-03-20', party: 'License Buyer' },
    { id: 5, name: 'Partnership Agreement - Joint Venture', type: 'Partnership Agreement', status: 'Active', createdDate: '2024-01-30', expiryDate: '2027-01-30', party: 'Joint Venture Partner' },
    { id: 6, name: 'Lease Agreement - Office Space', type: 'Lease Agreement', status: 'Active', createdDate: '2024-02-15', expiryDate: '2025-02-15', party: 'Property Owner' },
    { id: 7, name: 'Consulting Agreement - Project Alpha', type: 'Consulting Agreement', status: 'Completed', createdDate: '2024-01-10', expiryDate: '2024-06-10', party: 'Project Alpha Client' },
    { id: 8, name: 'Service Agreement - Maintenance', type: 'Service Agreement', status: 'Active', createdDate: '2024-03-01', expiryDate: '2025-03-01', party: 'Maintenance Client' },
    { id: 9, name: 'Employment Contract - Sarah Johnson', type: 'Employment Contract', status: 'Active', createdDate: '2024-02-25', expiryDate: '2026-02-25', party: 'Sarah Johnson' },
    { id: 10, name: 'NDA - Research Collaboration', type: 'Non-Disclosure Agreement', status: 'Active', createdDate: '2024-03-10', expiryDate: '2025-03-10', party: 'Research Partner' },
  ];

  const handleViewContract = (contractId) => {
    navigate(`/agent-playground/agent/contract-management-system/report/${contractId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-global-1">Dashboard</h1>
            <p className="text-sm text-global-2 mt-1">Contract Management System</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/agent-playground/agent/contract-management-system/build')}
              className="px-6 py-2.5 bg-[#155DFC] text-white rounded-lg font-medium hover:bg-[#0d4ad4] transition-colors flex items-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Build Contract
            </button>
            <button
              onClick={() => navigate('/agent-playground/agent/contract-management-system/upload')}
              className="px-6 py-2.5 bg-[#155DFC] text-white rounded-lg font-medium hover:bg-[#0d4ad4] transition-colors flex items-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5M5.83333 8.33333L10 12.5M10 12.5L14.1667 8.33333M10 12.5V2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Upload Contract
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="bg-white px-8 py-6">
        <div className="flex justify-center gap-6">
          <button
            onClick={() => navigate('/agent-playground/agent/contract-management-system/build')}
            className="px-8 py-4 bg-[#155DFC] text-white rounded-lg font-medium hover:bg-[#0d4ad4] transition-colors text-lg min-w-[200px]"
          >
            Build Contract
          </button>
          <button
            onClick={() => navigate('/agent-playground/agent/contract-management-system/upload')}
            className="px-8 py-4 bg-[#155DFC] text-white rounded-lg font-medium hover:bg-[#0d4ad4] transition-colors text-lg min-w-[200px]"
          >
            Upload Contract
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="px-8 py-6">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-global-1">
              Your Contracts <span className="text-[#155DFC] ml-2">Total: {contracts.length}</span>
            </h2>
            <p className="text-sm text-global-2 mt-1">View and manage all your contracts in one place</p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-global-3 uppercase tracking-wider">S.no</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-global-3 uppercase tracking-wider">Contract Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-global-3 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-global-3 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-global-3 uppercase tracking-wider">Party</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-global-3 uppercase tracking-wider">Created Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-global-3 uppercase tracking-wider">Expiry Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-global-3 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contracts.map((contract, index) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-global-1">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-global-1">{contract.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-global-1">{contract.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        contract.status === 'Active' ? 'bg-green-100 text-green-800' :
                        contract.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-global-1">{contract.party}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-global-1">{contract.createdDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-global-1">{contract.expiryDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewContract(contract.id)}
                        className="text-[#155DFC] hover:text-[#0d4ad4] font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-center border-t border-gray-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="px-3 py-1 text-sm text-global-1 hover:bg-gray-100 rounded"
              >
                ‹ Back
              </button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === page
                      ? 'bg-[#155DFC] text-white'
                      : 'text-global-1 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 text-sm text-global-1 hover:bg-gray-100 rounded"
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