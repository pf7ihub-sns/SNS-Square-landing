import React from 'react';
import { useLocation } from 'react-router-dom';
import ContractManagementAiAgentWorkflow from './contractManagementAiAgentWorkflow';
import ContractManagementAiAgentWorkflowDashboard from './ContractManagementAiAgentWorkflowDashboard';
import ApprovalResult from './approvalResult';

const ContractManagementV1 = () => {
  const location = useLocation();
  
  // Extract the sub-path from the current location
  const path = location.pathname.replace('/agent-playground/agent/contract-management-v1', '') || '/';
  
  // Render different components based on the current path
  switch (path) {
    case '/':
    case '':
      return <ContractManagementAiAgentWorkflow />;
    case '/dashboard':
      return <ContractManagementAiAgentWorkflowDashboard />;
    case '/approval-result':
      return <ApprovalResult />;
    default:
      return <ContractManagementAiAgentWorkflow />;
  }
};

export default ContractManagementV1;