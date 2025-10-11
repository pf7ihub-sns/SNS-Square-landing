import { useState, useEffect } from 'react';

const AgriculturalQueryAgent = () => {
  const [activeTab, setActiveTab] = useState('queries');
  const [queries, setQueries] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [autoExtract, setAutoExtract] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClassifyQueries = async () => {
    if (activeTab === 'queries' && !queries.trim()) {
      alert('Please enter some queries to classify');
      return;
    }

    if (activeTab === 'file' && !selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      let response;

      if (activeTab === 'queries') {
        const queryList = queries.split('\n').filter(q => q.trim());
        response = await fetch('http://127.0.0.1:8000/agricultural_query_agent/classify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            queries: queryList,
          }),
        });
      } else {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('auto_extract', autoExtract.toString());

        response = await fetch('http://127.0.0.1:8000/agricultural_query_agent/classify_file', {
          method: 'POST',
          body: formData,
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Parse the classification JSON string if it exists
      const parsedData = data.map(item => {
        if (item.classification && typeof item.classification === 'string') {
          try {
            const parsedClassification = JSON.parse(item.classification);
            return {
              ...item,
              classification: parsedClassification
            };
          } catch (e) {
            console.error('Error parsing classification:', e);
            return item;
          }
        }
        return item;
      });
      
      setResult(parsedData);
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedExtensions = ['.txt', '.csv', '.json', '.xlsx', '.docx'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        alert(`Unsupported file type: ${fileExtension}. Please upload one of: ${allowedExtensions.join(', ')}`);
        return;
      }

      setSelectedFile(file);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Crop': 'bg-green-100 text-green-800 border-green-200',
      'Irrigation': 'bg-blue-100 text-blue-800 border-blue-200',
      'Market': 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-3">🌾</span>
          Agricultural Query Agent
        </h1>
        <p className="text-gray-600 text-lg">
          Classify agricultural queries into Crop, Irrigation, or Market categories with urgency assessment. 
          Get personalized recommendations and expert guidance for farming decisions.
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">🌱 Query Classification</h3>
          <p className="text-green-600 text-sm">Automatically categorizes agricultural queries into Crop, Irrigation, or Market</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">⚡ Urgency Assessment</h3>
          <p className="text-blue-600 text-sm">Evaluates the priority level of farming issues for timely responses</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-semibold text-purple-800 mb-2">🏷️ Keyword Extraction</h3>
          <p className="text-purple-600 text-sm">Identifies key terms and concepts for better understanding</p>
        </div>
      </div>

      {/* Input Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'queries'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('queries')}
          >
            Text Queries
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'file'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('file')}
          >
            File Upload
          </button>
        </div>
      </div>

      {/* Input Content */}
      <div className="mb-6">
        {activeTab === 'queries' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Agricultural Queries (one per line):
            </label>
            <textarea
              value={queries}
              onChange={(e) => setQueries(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={8}
              placeholder={`Example queries:
How to prevent my crops from fleas?
When is the best time to irrigate tomatoes?
What is the current market price for rice?
How to control pest attacks on cotton?
My wheat crop is turning yellow, what should I do?`}
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File:
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".txt,.csv,.json,.xlsx,.docx"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm text-gray-600">
                  {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  Supports: TXT, CSV, JSON, XLSX, DOCX
                </span>
              </label>
            </div>
            {activeTab === 'file' && (
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={autoExtract}
                    onChange={(e) => setAutoExtract(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Auto-extract text from file</span>
                </label>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="mb-6">
        <button
          onClick={handleClassifyQueries}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Classifying...
            </>
          ) : (
            <>
              <span className="mr-2">🔍</span>
              Classify Queries
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📊</span>
            Classification Results
          </h2>
          
          {result.error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">Error:</p>
              <p className="text-red-600">{result.error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Array.isArray(result) && result.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="mb-2">
                    <p className="text-gray-900 font-medium">Query:</p>
                    <p className="text-gray-700 mb-3">{item.query}</p>
                  </div>
                  
                  {item.classification && (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(item.classification.category)}`}>
                          {item.classification.category}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                          item.classification.urgency === 'High' ? 'bg-red-100 text-red-800 border-red-200' :
                          item.classification.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          'bg-green-100 text-green-800 border-green-200'
                        }`}>
                          {item.classification.urgency} Priority
                        </span>
                      </div>
                      
                      {/* Keywords Section */}
                      {item.classification.keywords && item.classification.keywords.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 font-medium mb-2">Keywords:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.classification.keywords.map((keyword, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md border"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {item.classification.reasoning && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 font-medium">Reasoning:</p>
                          <p className="text-sm text-gray-700">{item.classification.reasoning}</p>
                        </div>
                      )}
                      
                      {item.classification.recommendations && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 font-medium">Recommendations:</p>
                          <p className="text-sm text-gray-700">{item.classification.recommendations}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Use Cases */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Use Cases</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">🔍 Query Classification</h4>
            <p className="text-sm text-gray-600">Automatically categorize farming queries into relevant categories for faster resolution.</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">⚡ Priority Assessment</h4>
            <p className="text-sm text-gray-600">Evaluate the urgency of agricultural issues to prioritize critical problems.</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">🏷️ Keyword Analysis</h4>
            <p className="text-sm text-gray-600">Extract key terms from queries to better understand farming challenges and solutions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriculturalQueryAgent;