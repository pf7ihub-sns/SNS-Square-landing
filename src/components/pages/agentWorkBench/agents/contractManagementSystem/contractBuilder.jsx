// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const ContractBuilder = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     contractType: '',
//     partyName: '',
//     partyAddress: '',
//     effectiveDate: '',
//     expirationDate: '',
//     terms: '',
//     paymentAmount: '',
//     paymentSchedule: '',
//     specialConditions: ''
//   });

//   const [isGenerating, setIsGenerating] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleGenerate = async (e) => {
//     e.preventDefault();
    
//     // Validate required fields
//     if (!formData.contractType || !formData.partyName || !formData.effectiveDate) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     setIsGenerating(true);

//     // Simulate generation
//     setTimeout(() => {
//       // Store contract data in sessionStorage for the export page
//       sessionStorage.setItem('generatedContract', JSON.stringify(formData));
//       navigate('/agent-playground/agent/contract-management-system/contract-preview');
//     }, 1500);
//   };

//   const handleExport = (format) => {
//     if (format === 'pdf') {
//       // Simulate PDF export
//       alert('Contract exported as PDF successfully!');
//     } else if (format === 'doc') {
//       // Simulate DOC export
//       alert('Contract exported as DOC successfully!');
//     }
//   };

//   const contractTypes = [
//     'Service Agreement',
//     'Employment Contract',
//     'Non-Disclosure Agreement (NDA)',
//     'Sales Agreement',
//     'Partnership Agreement',
//     'Lease Agreement',
//     'Consulting Agreement'
//   ];

//   const paymentSchedules = [
//     'One-time payment',
//     'Monthly',
//     'Quarterly',
//     'Annually',
//     'Upon completion',
//     'Milestone-based'
//   ];

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 px-8 py-4">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate('/agent-playground/agent/contract-management-system/')}
//             className="text-gray-600 hover:text-gray-900"
//           >
//             ← Back
//           </button>
//           <div>
//             <h1 className="text-xl font-semibold text-global-1">Contract Builder</h1>
//             <p className="text-sm text-global-2 mt-1">Fill in the details to generate a professional contract automatically</p>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-4xl mx-auto px-8 py-8">
//         <form onSubmit={handleGenerate} className="space-y-6">
//           {/* Contract Type */}
//           <div className="bg-white border border-gray-200 rounded-lg p-6">
//             <h2 className="text-lg font-semibold text-global-1 mb-4">Contract Information</h2>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-global-1 mb-2">
//                   Contract Type <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="contractType"
//                   value={formData.contractType}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155DFC] focus:border-transparent outline-none"
//                 >
//                   <option value="">Select contract type</option>
//                   {contractTypes.map(type => (
//                     <option key={type} value={type}>{type}</option>
//                   ))}
//                 </select>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-global-1 mb-2">
//                     Effective Date <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="date"
//                     name="effectiveDate"
//                     value={formData.effectiveDate}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155DFC] focus:border-transparent outline-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-global-1 mb-2">
//                     Expiration Date
//                   </label>
//                   <input
//                     type="date"
//                     name="expirationDate"
//                     value={formData.expirationDate}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155DFC] focus:border-transparent outline-none"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Party Information */}
//           <div className="bg-white border border-gray-200 rounded-lg p-6">
//             <h2 className="text-lg font-semibold text-global-1 mb-4">Party Information</h2>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-global-1 mb-2">
//                   Party Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="partyName"
//                   value={formData.partyName}
//                   onChange={handleChange}
//                   required
//                   placeholder="Enter party name"
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155DFC] focus:border-transparent outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-global-1 mb-2">
//                   Party Address
//                 </label>
//                 <textarea
//                   name="partyAddress"
//                   value={formData.partyAddress}
//                   onChange={handleChange}
//                   placeholder="Enter complete address"
//                   rows="3"
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155DFC] focus:border-transparent outline-none resize-none"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Terms & Conditions */}
//           <div className="bg-white border border-gray-200 rounded-lg p-6">
//             <h2 className="text-lg font-semibold text-global-1 mb-4">Terms & Conditions</h2>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-global-1 mb-2">
//                   Contract Terms
//                 </label>
//                 <textarea
//                   name="terms"
//                   value={formData.terms}
//                   onChange={handleChange}
//                   placeholder="Describe the main terms and conditions of the contract"
//                   rows="5"
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155DFC] focus:border-transparent outline-none resize-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-global-1 mb-2">
//                   Special Conditions
//                 </label>
//                 <textarea
//                   name="specialConditions"
//                   value={formData.specialConditions}
//                   onChange={handleChange}
//                   placeholder="Any special clauses or conditions"
//                   rows="3"
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155DFC] focus:border-transparent outline-none resize-none"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Payment Details */}
//           <div className="bg-white border border-gray-200 rounded-lg p-6">
//             <h2 className="text-lg font-semibold text-global-1 mb-4">Payment Details</h2>
            
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-global-1 mb-2">
//                     Payment Amount
//                   </label>
//                   <input
//                     type="text"
//                     name="paymentAmount"
//                     value={formData.paymentAmount}
//                     onChange={handleChange}
//                     placeholder="e.g., $10,000"
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155DFC] focus:border-transparent outline-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-global-1 mb-2">
//                     Payment Schedule
//                   </label>
//                   <select
//                     name="paymentSchedule"
//                     value={formData.paymentSchedule}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155DFC] focus:border-transparent outline-none"
//                   >
//                     <option value="">Select schedule</option>
//                     {paymentSchedules.map(schedule => (
//                       <option key={schedule} value={schedule}>{schedule}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end gap-4">
//             <button
//               type="button"
//               onClick={() => navigate('/agent-playground/agent/contract-management-system/')}
//               className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isGenerating}
//               className="px-6 py-2.5 bg-[#155DFC] text-white rounded-lg font-medium hover:bg-[#0d4ad4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isGenerating ? 'Generating...' : 'Generate Contract'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ContractBuilder;