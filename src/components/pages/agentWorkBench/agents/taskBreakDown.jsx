import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const TaskBreakDown = () => {
  const [task, setTask] = useState("");
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setTask(e.target.value);
    setError(null);
    setBreakdown(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim()) {
      setError('Please provide a task description.');
      return;
    }

    setLoading(true);
    setError(null);
    setBreakdown(null);

    const formData = new FormData();
    formData.append('user_input', task);

    try {
      const response = await axios.post(`${API_BASE}/task_breakdown/run`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = response.data.subtasks;
      if (data && typeof data === 'string') {
        // Parse the subtasks string
        const taskMatch = data.match(/To (.*?),(?: the tasks are:)?/);
        const taskDescription = taskMatch ? taskMatch[1].trim() : task;
        const subtaskMatches = data.match(/'(.*?)' \((.*?) priority, (.*?) days\)/g);
        const breakdownData = subtaskMatches ? subtaskMatches.map(match => {
          const [, subtask, priority, time] = match.match(/'(.*?)' \((.*?) priority, (.*?) days\)/);
          return { subtask, priority, time_estimate: `${time} days` };
        }) : [];

        setBreakdown({
          task: taskDescription,
          domain: "Technology", // Assuming Technology based on the example; adjust if dynamic
          breakdown: breakdownData,
        });
      } else {
        setBreakdown(null);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error processing task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="relative">
          <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            Task Breakdown Agent
          </h1>
          <button
            onClick={() => window.location.href = '/media-entertainment'}
            className="absolute top-4 right-4 flex items-center gap-2 text-white font-medium hover:text-blue-200 transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-md z-10"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="text-center mb-6 text-gray-700">
          <p className="mb-2">Break down a task into subtasks with priorities and time estimates.</p>
          <p className="text-sm">Enter a task description to generate a detailed breakdown.</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="task" className="block text-sm font-medium text-gray-700 mb-1">
                  Task Description
                </label>
                <textarea
                  id="task"
                  name="task"
                  value={task}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24 text-sm"
                  placeholder="e.g., Develop a new website for a client..."
                />
              </div>
              <button
                type="submit"
                disabled={loading || !task.trim()}
                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !task.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                style={{ backgroundColor: loading || !task.trim() ? '#9CA3AF' : '#1E3A8A' }}
              >
                {loading ? 'Processing...' : 'Generate Breakdown'}
              </button>
            </form>
            {loading && (
              <div className="mt-4 text-center">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out" style={{ width: '50%' }}></div>
                </div>
                <p className="text-xs text-gray-500">Processing...</p>
              </div>
            )}
            {error && (
              <div className="mt-4 p-2 bg-red-50 text-red-700 rounded-lg text-sm">
                {error} <button onClick={() => setError(null)} className="ml-2 text-red-600 underline text-xs">Try again</button>
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            {breakdown && breakdown.breakdown ? (
              <div className="w-full h-96 overflow-y-auto space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Task Breakdown
                </h2>
                {breakdown.task && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-blue-800 mb-2">Task</h3>
                    <p className="text-gray-700 text-sm">{breakdown.task}</p>
                  </div>
                )}
                {breakdown.domain && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-blue-800 mb-2">Domain</h3>
                    <p className="text-gray-700 text-sm">{breakdown.domain}</p>
                  </div>
                )}
                {breakdown.breakdown.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-blue-800 mb-2">Subtasks</h3>
                    <ol className="list-decimal list-inside text-gray-700 text-sm space-y-2">
                      {breakdown.breakdown.map((item, index) => (
                        <li key={index} className="ml-4">
                          <strong>{item.subtask}</strong> (Priority: {item.priority}, Time Estimate: {item.time_estimate})
                          <br />
                          <span className="text-gray-600 text-xs">{index === 0 ? "Define all features, user stories, and technical specifications for the website and login system." : index === 1 ? "Create wireframes, mockups, and database schema." : index === 2 ? "Develop the front-end and back-end, including the login system." : index === 3 ? "Conduct unit, integration, and user acceptance testing." : "Launch the website on a server."}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ) : !loading && !error ? (
              <div className="w-full h-96 flex items-center justify-center text-gray-500">
                Your task breakdown will appear here
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskBreakDown;