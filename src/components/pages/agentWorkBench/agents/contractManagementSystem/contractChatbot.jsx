import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const ContractChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [isComplete, setIsComplete] = useState(false);
  const [contractId, setContractId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize chatbot
    initializeChatbot();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChatbot = async () => {
    const welcomeMessage = {
      role: 'assistant',
      content: "Hello! I'm your Contract Builder assistant. What type of contract do you need?\n\n• Rental Agreement\n• Lease Agreement\n• Property Sale Agreement"
    };
    setMessages([welcomeMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputMessage
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/contract-management-system/chatbot/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: inputMessage,
          conversation_history: messages
        })
      });

      const data = await response.json();

      const assistantMessage = {
        role: 'assistant',
        content: data.response
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      if (data.is_complete && data.ready_to_generate) {
        setIsComplete(true);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateContract = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/contract-management-system/chatbot/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      });

      const data = await response.json();
      
      if (data.contract_id) {
        setContractId(data.contract_id);
        toast.success('Contract generated successfully!');
        
        // Show download option
        const downloadMessage = {
          role: 'assistant',
          content: `✅ Contract generated successfully!\n\nContract ID: ${data.contract_id}\n\nYou can now download your contract as DOCX.`
        };
        setMessages(prev => [...prev, downloadMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate contract');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadDocx = async () => {
    if (!contractId) {
      toast.error('No contract to download');
      return;
    }

    try {
      toast.info('Generating DOCX file...');
      
      const response = await fetch(
        `${API_BASE_URL}/contract-management-system/contract/${contractId}/export/docx`
      );
      
      if (!response.ok) {
        throw new Error('Failed to generate DOCX');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Contract_${contractId}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Contract downloaded successfully!');
    } catch (error) {
      console.error('Failed to download DOCX:', error);
      toast.error('Failed to download contract');
    }
  };

  return (
    <div className="pt-25 flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.history.back()}
            className="text-blue-600 hover:text-blue-800"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-semibold">Contract Builder</h1>
        </div>
        
        {isComplete && (
          <button
            onClick={handleGenerateContract}
            disabled={isLoading || contractId}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              contractId 
                ? 'bg-green-600 text-white cursor-default'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {contractId ? '✓ Generated' : 'Generate Contract'}
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-2xl px-4 py-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {message.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-3 rounded-2xl">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Download Button */}
      {contractId && (
        <div className="px-6 py-3 bg-green-50 border-t border-green-200">
          <button
            onClick={handleDownloadDocx}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5M5.83333 8.33333L10 12.5M10 12.5L14.1667 8.33333M10 12.5V2.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download Contract (DOCX)
          </button>
        </div>
      )}

      {/* Input */}
      <div className="px-6 py-4 border-t">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message here..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractChatbot;