import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, Send, Download, FileText, CheckCircle, Loader2, 
  Info, Sparkles, Clock, CheckSquare, Square 
} from 'lucide-react';

// FIXED: Use window.location to auto-detect backend URL or fallback to localhost:8000
const getApiBaseUrl = () => {
  // Check environment variable first
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // If in development on localhost:3000 or localhost:5173 (Vite default), point to :8000
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  
  // For production, use same origin
  return window.location.origin;
};

const API_BASE_URL = getApiBaseUrl();

const ContractChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [isComplete, setIsComplete] = useState(false);
  const [contractId, setContractId] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    console.log('🔌 API Base URL:', API_BASE_URL);
    initializeChatbot();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus input when current question changes
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentQuestion]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChatbot = async () => {
    const welcomeMessage = {
      role: 'assistant',
      content: "Hello! I'm your **Contract Builder** assistant.\n\n" +
               "I can help you create professional contracts for Real Estate. Just tell me what you need!\n\n" +
               "**Examples:**\n" +
               "• \"Create a lease agreement for my office at 123 Main St, Mumbai\"\n" +
               "• \"I need a rental agreement\"\n" +
               "• \"Lease for commercial property, lessor John Doe, tenant ABC Corp, rent 50000\"\n\n" +
               "What would you like to create today?"
    };
    setMessages([welcomeMessage]);
  };

  const fetchProgress = async () => {
    try {
      const url = `${API_BASE_URL}/contract-management-system/chatbot/enhanced/session/${sessionId}`;
      console.log('📊 Fetching progress from:', url);
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProgress(data.progress);
      } else if (response.status === 404) {
        // Session doesn't exist yet, ignore
        console.log('ℹ️ Session not found yet (expected on first load)');
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    }
  };

  const handleSendMessage = async (messageText = null) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

    const userMessage = {
      role: 'user',
      content: textToSend
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setSelectedOptions([]);
    setIsLoading(true);
    setCurrentQuestion(null);

    try {
      const endpoint = `${API_BASE_URL}/contract-management-system/chatbot/enhanced/message`;
      console.log('📤 Sending message to:', endpoint);
      console.log('📦 Payload:', { session_id: sessionId, message: textToSend });
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: textToSend,
          conversation_history: messages
        })
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Response data:', data);

      const assistantMessage = {
        role: 'assistant',
        content: data.response || 'No response content',
        ui_type: data.ui_type,
        options: data.options,
        placeholder: data.placeholder,
        question_id: data.question_id,
        required: data.required
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setCurrentQuestion(data);
      
      if (data.is_complete && data.ready_to_generate) {
        setIsComplete(true);
      }

      // Fetch progress
      await fetchProgress();
    } catch (error) {
      console.error('❌ Error sending message:', error);
      
      // More detailed error message
      let errorMessage = 'Failed to send message';
      if (error.message.includes('Failed to fetch')) {
        errorMessage = `Cannot connect to backend server at ${API_BASE_URL}. Please ensure:\n` +
                      `1. Backend server is running (uvicorn main:app --reload)\n` +
                      `2. Server is accessible at ${API_BASE_URL}\n` +
                      `3. CORS is properly configured`;
      } else {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      
      // Add error message to chat
      const errorChatMessage = {
        role: 'assistant',
        content: `❌ **Error**: ${errorMessage}\n\nPlease check the console for more details.`
      };
      setMessages(prev => [...prev, errorChatMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionClick = (option) => {
    if (currentQuestion?.ui_type === 'checkbox') {
      // Multi-select
      setSelectedOptions(prev => {
        if (prev.includes(option)) {
          return prev.filter(o => o !== option);
        } else {
          return [...prev, option];
        }
      });
    } else if (currentQuestion?.ui_type === 'radio') {
      // Single select - send immediately
      handleSendMessage(option);
    }
  };

  const handleCheckboxSubmit = () => {
    if (selectedOptions.length === 0) {
      toast.warning('Please select at least one option');
      return;
    }
    const message = selectedOptions.join(', ');
    handleSendMessage(message);
  };

  const handleGenerateContract = async () => {
    setIsLoading(true);
    
    try {
      const url = `${API_BASE_URL}/contract-management-system/chatbot/enhanced/generate`;
      console.log('📄 Generating contract at:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ session_id: sessionId })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate contract: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Contract generated:', data);
      
      if (data.contract_id) {
        setContractId(data.contract_id);
        toast.success('Contract generated successfully!');
        
        const downloadMessage = {
          role: 'assistant',
          content: `✅ **Contract generated successfully!**\n\n` +
                   `Contract ID: **${data.contract_id}**\n` +
                   `Status: **${data.status}**\n\n` +
                   `You can now download your contract as DOCX.`
        };
        setMessages(prev => [...prev, downloadMessage]);
      }
    } catch (error) {
      console.error('❌ Generation error:', error);
      toast.error(`Failed to generate contract: ${error.message}`);
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
      
      const url = `${API_BASE_URL}/contract-management-system/contract/${contractId}/export/docx`;
      console.log('📥 Downloading DOCX from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate DOCX: ${errorText}`);
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `Contract_${contractId}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      
      toast.success('Contract downloaded successfully!');
    } catch (error) {
      console.error('❌ Download error:', error);
      toast.error(`Failed to download contract: ${error.message}`);
    }
  };

  const renderMessageContent = (message) => {
    // Parse markdown-style bold text
    const parts = message.content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-semibold">{part.slice(2, -2)}</strong>;
      }
      return <span key={idx}>{part}</span>;
    });
  };

  const renderQuestionUI = (message) => {
    if (!message.ui_type || message.role !== 'assistant') return null;

    const { ui_type, options, placeholder, required } = message;

    switch (ui_type) {
      case 'radio':
        return (
          <div className="mt-4 space-y-2">
            {options?.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(option)}
                className="w-full px-4 py-3 text-left rounded-lg border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex items-center gap-3 group"
              >
                <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-blue-500 flex items-center justify-center">
                  <div className="w-0 h-0 rounded-full bg-blue-600 group-hover:w-3 group-hover:h-3 transition-all duration-200"></div>
                </div>
                <span className="text-slate-700 group-hover:text-slate-900 font-medium">
                  {option}
                </span>
              </button>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="mt-4 space-y-2">
            {options?.map((option, idx) => {
              const isSelected = selectedOptions.includes(option);
              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(option)}
                  className={`w-full px-4 py-3 text-left rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  {isSelected ? (
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400" />
                  )}
                  <span className={`${isSelected ? 'text-slate-900 font-medium' : 'text-slate-700'}`}>
                    {option}
                  </span>
                </button>
              );
            })}
            {selectedOptions.length > 0 && (
              <button
                onClick={handleCheckboxSubmit}
                className="mt-3 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Submit Selection ({selectedOptions.length} selected)
              </button>
            )}
          </div>
        );

      case 'number':
      case 'text':
        return (
          <div className="mt-4">
            <input
              type={ui_type}
              ref={inputRef}
              placeholder={placeholder || 'Type your answer...'}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleSendMessage(e.target.value);
                  e.target.value = '';
                }
              }}
            />
          </div>
        );

      case 'textarea':
        return (
          <div className="mt-4">
            <textarea
              ref={inputRef}
              placeholder={placeholder || 'Type your answer...'}
              rows={3}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey && e.target.value.trim()) {
                  e.preventDefault();
                  handleSendMessage(e.target.value);
                  e.target.value = '';
                }
              }}
            />
            <p className="text-xs text-slate-500 mt-1">Press Ctrl+Enter to submit</p>
          </div>
        );

      case 'date':
        return (
          <div className="mt-4">
            <input
              type="date"
              ref={inputRef}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              onChange={(e) => {
                if (e.target.value) {
                  // Convert to DD/MM/YYYY format
                  const date = new Date(e.target.value);
                  const formatted = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                  handleSendMessage(formatted);
                }
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (

    <div className="pt-15 flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden font-manrope">
      {/* Debug Info */}
      <div className="absolute top-2 right-2 z-50 text-xs bg-white px-2 py-1 rounded shadow">
        API: {API_BASE_URL}
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-slate-600 hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden min-w-0 pt-20">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-lg mb-4 p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">AI Contract Builder</h2>
                <p className="text-sm text-slate-600">Intelligent Real Estate Contract Generation</p>
              </div>
            </div>
            
            {/* Progress Indicator */}
            {progress && (
              <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <Clock className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-xs text-slate-600">Progress</p>
                  <p className="text-sm font-bold text-blue-700">{progress.percentage}%</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              {isComplete && !contractId && (
                <button
                  onClick={handleGenerateContract}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      Generate Contract
                    </>
                  )}
                </button>
              )}

              {contractId && (
                <div className="flex items-center gap-2">
                  <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Generated</span>
                  </div>
                  <button
                    onClick={handleDownloadDocx}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download DOCX
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-xl shadow-lg flex-1 flex flex-col min-h-0 border border-slate-200">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-3xl rounded-2xl px-5 py-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-900 shadow-sm'
                  }`}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  <div className="text-sm leading-relaxed">
                    {renderMessageContent(message)}
                  </div>
                  
                  {/* Render interactive UI elements */}
                  {renderQuestionUI(message)}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start">
                <div className="bg-slate-100 px-5 py-4 rounded-2xl shadow-sm">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Only show for text/textarea inputs or when no specific UI */}
          {(!currentQuestion?.ui_type || ['text', 'textarea', 'number'].includes(currentQuestion?.ui_type) || currentQuestion?.ui_type === 'date') && (
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                  placeholder={currentQuestion?.placeholder || "Type your message or answer here..."}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-sm"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !inputMessage.trim()}
                  className="px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl flex items-center justify-center transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              
              {currentQuestion?.ui_type === 'textarea' && (
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Press Enter to send, or use the text area above for longer answers
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractChatbot;