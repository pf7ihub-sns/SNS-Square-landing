import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import agentsData from '../../../../data/agents.json';

const AgentWorkingPage = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Find the agent by ID
    const allAgents = [
      ...agentsData.foundationAgents,
      ...agentsData.industrySolutions,
      ...agentsData.customerSolutions
    ];
    
    const foundAgent = allAgents.find(a => a.id === agentId);
    if (foundAgent) {
      setAgent(foundAgent);
    }
  }, [agentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    
    // Add to history
    const newEntry = {
      id: Date.now(),
      input: input.trim(),
      output: '',
      timestamp: new Date().toLocaleTimeString()
    };
    
    setHistory(prev => [newEntry, ...prev]);
    
    try {
      // Simulate API call - replace with actual agent API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response based on agent type
      let mockResponse = '';
      switch (agentId) {
        case 'deep-research-agent':
          mockResponse = `🔍 **Deep Research Analysis Complete**\n\n**Key Findings:**\n• Comprehensive analysis of "${input}"\n• 15 relevant sources identified\n• Cross-referenced data from multiple databases\n• Confidence level: 94%\n\n**Summary:** Based on extensive research, here are the main insights and findings related to your query...`;
          break;
        case 'data-management':
          mockResponse = `📊 **Data Management Analysis**\n\nProcessed your data query: "${input}"\n\n• Data integrity: ✅ Verified\n• Storage optimization: 87% efficient\n• Recommended actions: Implement indexing for better performance`;
          break;
        case 'document-knowledge':
          mockResponse = `📄 **Document Analysis Complete**\n\nAnalyzed request: "${input}"\n\n• Documents processed: 23\n• Key insights extracted\n• Knowledge base updated\n• Similarity score: 92%`;
          break;
        default:
          mockResponse = `✨ **${agent?.title} Response**\n\nProcessed your request: "${input}"\n\nThis is a simulated response from the ${agent?.title} agent. In a real implementation, this would connect to the specific agent's API endpoint.`;
      }
      
      setOutput(mockResponse);
      
      // Update history with response
      setHistory(prev => 
        prev.map(entry => 
          entry.id === newEntry.id 
            ? { ...entry, output: mockResponse }
            : entry
        )
      );
      
    } catch (err) {
      console.error('Agent processing error:', err);
      const errorMessage = `❌ Error: Unable to process request. Please try again.`;
      setOutput(errorMessage);
      setHistory(prev => 
        prev.map(entry => 
          entry.id === newEntry.id 
            ? { ...entry, output: errorMessage }
            : entry
        )
      );
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setOutput('');
  };

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agent Not Found</h2>
          <p className="text-gray-600 mb-4">The requested agent could not be found.</p>
          <button
            onClick={() => navigate('/agent-workbench')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Playground
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/agent-workbench')}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back to Playground
              </button>
              <div className="flex items-center space-x-3">
                <img src={agent.icon} alt={agent.title} className="w-8 h-8" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{agent.title}</h1>
                  <p className="text-sm text-gray-600">{agent.category}</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={clearHistory}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Agent Input
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {agent.description}
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Request
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Enter your request for ${agent.title}...`}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                    disabled={isLoading}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? 'Processing...' : `Run ${agent.title}`}
                </button>
              </form>
            </div>
          </div>

          {/* Output Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Agent Output
              </h2>
              
              {output ? (
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {output}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">💭</div>
                  <p>Agent output will appear here after processing your request.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Interaction History
              </h2>
              
              <div className="space-y-6">
                {history.map((entry) => (
                  <div key={entry.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="text-xs text-gray-500 mb-2">
                      {entry.timestamp}
                    </div>
                    <div className="mb-2">
                      <div className="text-sm font-medium text-gray-700 mb-1">Input:</div>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                        {entry.input}
                      </div>
                    </div>
                    {entry.output && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Output:</div>
                        <div className="text-sm text-gray-900 bg-blue-50 p-2 rounded whitespace-pre-wrap">
                          {entry.output}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentWorkingPage;