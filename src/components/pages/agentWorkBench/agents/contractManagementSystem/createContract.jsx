import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateContract = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'Service Agreement',
    partyName: '',
    startDate: '',
    endDate: '',
    terms: '',
    clauses: [''],
    specialConditions: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const contractTypes = [
    'Service Agreement',
    'Employment Contract',
    'Non-Disclosure Agreement',
    'Partnership Agreement',
    'Lease Agreement',
    'Sales Agreement',
    'Consulting Agreement'
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleClauseChange = (index, value) => {
    const newClauses = [...formData.clauses];
    newClauses[index] = value;
    setFormData(prev => ({
      ...prev,
      clauses: newClauses
    }));
  };
  
  const addClause = () => {
    setFormData(prev => ({
      ...prev,
      clauses: [...prev.clauses, '']
    }));
  };
  
  const removeClause = (index) => {
    if (formData.clauses.length > 1) {
      const newClauses = formData.clauses.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        clauses: newClauses
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/contract-management-system/contracts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          type: formData.type,
          party_name: formData.partyName,
          start_date: formData.startDate,
          end_date: formData.endDate,
          terms: formData.terms,
          clauses: formData.clauses.filter(clause => clause.trim() !== ''),
          special_conditions: formData.specialConditions,
          status: 'Draft'
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create contract');
      }
      
      const result = await response.json();
      toast.success('Contract created successfully!');
      navigate(`/agent-playground/agent/contract-management-system/report/${result.contract_id}`);
    } catch (error) {
      console.error('Error creating contract:', error);
      toast.error(`Error: ${error.message || 'Failed to create contract'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto pt-24">
        <div className="bg-white shadow rounded-lg p-6 ">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create New Contract</h1>
            <p className="mt-1 text-sm text-gray-500">Fill in the details below to create a new contract</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Contract Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="e.g., Service Agreement with ABC Corp"
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Contract Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                >
                  {contractTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="partyName" className="block text-sm font-medium text-gray-700">
                  Counterparty Name *
                </label>
                <input
                  type="text"
                  id="partyName"
                  name="partyName"
                  value={formData.partyName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="e.g., ABC Corporation"
                />
              </div>
              
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="terms" className="block text-sm font-medium text-gray-700">
                Terms and Conditions *
              </label>
              <textarea
                id="terms"
                name="terms"
                rows={4}
                value={formData.terms}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                placeholder="Enter the main terms and conditions of the contract"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Contract Clauses
                </label>
                <button
                  type="button"
                  onClick={addClause}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  + Add Clause
                </button>
              </div>
              
              <div className="mt-2 space-y-2">
                {formData.clauses.map((clause, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={clause}
                        onChange={(e) => handleClauseChange(index, e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        placeholder={`Clause ${index + 1}`}
                      />
                    </div>
                    {formData.clauses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeClause(index)}
                        className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="specialConditions" className="block text-sm font-medium text-gray-700">
                Special Conditions (Optional)
              </label>
              <textarea
                id="specialConditions"
                name="specialConditions"
                rows={3}
                value={formData.specialConditions}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                placeholder="Any special conditions or additional notes"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {isSubmitting ? 'Creating...' : 'Create Contract'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateContract;
