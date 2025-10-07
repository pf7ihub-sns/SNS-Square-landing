import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ContractManagementAiAgentWorkflow from './contractManagementAiAgentWorkflow';
import ContractManagementAiAgentWorkflowDashboard from './ContractManagementAiAgentWorkflowDashboard';
import ApprovalResult from './approvalResult';

const ContractManagementV1 = () => {
  return (
    <Routes>
      <Route index element={<ContractManagementAiAgentWorkflow />} />
      <Route path="dashboard" element={<ContractManagementAiAgentWorkflowDashboard />} />
      <Route path="approval-result" element={<ApprovalResult />} />
    </Routes>
  );
};

export default ContractManagementV1;