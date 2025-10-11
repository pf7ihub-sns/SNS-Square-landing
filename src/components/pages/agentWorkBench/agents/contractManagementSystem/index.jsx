import React from 'react';
import { useLocation } from 'react-router-dom';
import Dashboard from './dashboard';
import ContractUpload from './contractUpload';
import CreateContract from './createContract';
import ContractChatbot from './contractChatbot';
import ContractPreview from './contractPreview';
import ReportPage from './reportPage';

const ContractManagementSystem = () => {
  const location = useLocation();
  const path = location.pathname.replace('/agent-playground/agent/contract-management-system', '') || '/';
  
  switch (path) {
    case '/':
    case '':
      return <Dashboard />;
    case '/upload':
      return <ContractUpload />;
    case '/create':
      return <CreateContract />;
    case '/chatbot':  
      return <ContractChatbot />;
    case '/contract-preview':
      return <ContractPreview />;
    default:
      if (path.startsWith('/report/')) {
        const reportId = path.split('/report/')[1];
        return <ReportPage reportId={reportId} />;
      }
      return <Dashboard />;
  }
};

export default ContractManagementSystem;