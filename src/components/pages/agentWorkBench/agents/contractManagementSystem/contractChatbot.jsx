import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { ArrowLeft, Send, Download, FileText, CheckCircle, Loader2 } from 'lucide-react';

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
      const endpoint = `/contract-management-system/chatbot/message`;
      console.log('Sending request to:', `${API_BASE_URL}${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: inputMessage,
          conversation_history: messages
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      const assistantMessage = {
        role: 'assistant',
        content: data.response || data.message || 'No response content'
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      if (data.is_complete && data.ready_to_generate) {
        setIsComplete(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(`Failed to send message: ${error.message}`);
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
    <div className="flex h-screen bg-slate-50 overflow-hidden font-manrope">
      {/* Back Button - Fixed at top */}
      <div className="absolute top-6 left-6 z-50">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden min-w-0 pt-20">
        {/* Chat Container */}
        <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col p-6 min-h-0 border-2 border-slate-100">
          {/* Header */}
          <div className="mb-4 pb-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Contract Builder Assistant</h2>
                <p className="text-xs text-slate-500">AI-Powered Contract Generation</p>
              </div>
            </div>
            
            {isComplete && !contractId && (
              <button
                onClick={handleGenerateContract}
                disabled={isLoading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Generate Contract
                  </>
                )}
              </button>
            )}

            {contractId && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Contract Generated</span>
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-lg max-w-2xl text-sm ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-900'
                  }`}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start">
                <div className="bg-slate-100 px-4 py-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Download Section */}
          {contractId && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Contract Ready for Download</p>
                    <p className="text-xs text-slate-600">Contract ID: {contractId}</p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadDocx}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download DOCX
                </button>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              placeholder="Type your message here..."
              disabled={isLoading}
              className="flex-1 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-900 placeholder-slate-400 text-sm disabled:bg-slate-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractChatbot;