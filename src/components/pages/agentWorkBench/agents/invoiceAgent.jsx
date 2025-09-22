import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const InvoiceAgent = () => {
    const [inputMode, setInputMode] = useState('text');
    const [formData, setFormData] = useState({ invoice_text: '', file: null });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
        setResult(null);
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
        setError(null);
        setResult(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.invoice_text.trim() && !formData.file) {
            setError('Please enter text or upload a PDF invoice.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            let response;
            if (inputMode === 'text' && formData.invoice_text.trim()) {
                response = await axios.post(`${API_BASE}/invoice_agent/analyze-invoice`, formData, {
                    headers: { 'Content-Type': 'application/json' },
                });
                setResult(response.data);
            } else if (inputMode === 'file' && formData.file) {
                const formDataToSend = new FormData();
                formDataToSend.append('file', formData.file);
                response = await axios.post(`${API_BASE}/invoice_agent/analyze-invoice-file`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setResult(response.data);
            }
        } catch (err) {
            console.error('Error details:', err.response);
            setError(
                err.response?.data?.detail || err.message || 'Error analyzing invoice. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined || amount === 0) return 'N/A';
        return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // Format date
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Get the invoice data (handling both single and multiple invoice structures)
    const getInvoiceData = () => {
        if (!result) return null;
        
        let output = result.output || result;
        
        // Handle error case
        if (output.error) {
            return { error: output.error };
        }
        
        // Handle the new structure with invoices array
        if (output.invoices && Array.isArray(output.invoices)) {
            return {
                invoices: output.invoices,
                summary: output.summary || ''
            };
        }
        
        // Fallback for old structure (single invoice)
        if (output.invoice_number) {
            return {
                invoices: [output],
                summary: output.summary || ''
            };
        }
        
        return { error: 'Invalid response structure' };
    };

    const invoiceData = getInvoiceData();

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="w-full max-w-5xl mt-18">
                {/* Header */}
                <div className="relative">
                    <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        Invoice Agent
                    </h1>
                    <button
                        onClick={() => window.location.href = '/media-entertainment'}
                        className="absolute top-4 right-4 flex items-center gap-2 text-white font-medium hover:text-blue-200 transition-colors p-2 hover:bg-white-50 hover:bg-opacity-10 rounded-md z-10"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>
                </div>

                {/* Instructions */}
                <div className="text-center mb-4 text-gray-700">
                    <p className="mb-2">Extract key fields from an invoice and get a summary analysis.</p>
                    <p className="text-sm">Enter text or upload a PDF to get detailed extraction.</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Input Mode
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="inputMode"
                                        value="text"
                                        checked={inputMode === 'text'}
                                        onChange={() => setInputMode('text')}
                                        className="mr-2"
                                    />
                                    Text
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="inputMode"
                                        value="file"
                                        checked={inputMode === 'file'}
                                        onChange={() => setInputMode('file')}
                                        className="mr-2"
                                    />
                                    File (PDF)
                                </label>
                            </div>
                        </div>
                        {inputMode === 'text' ? (
                            <div>
                                <label htmlFor="invoice_text" className="block text-sm font-medium text-gray-700 mb-3">
                                    Invoice Text
                                </label>
                                <textarea
                                    id="invoice_text"
                                    name="invoice_text"
                                    value={formData.invoice_text}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y h-32 text-sm"
                                    placeholder="Enter invoice text here (e.g., Invoice #123, Date: 2025-09-18, Vendor: ABC Corp, Total: $500)..."
                                />
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-3">
                                    Upload PDF Invoice
                                </label>
                                <input
                                    id="file"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading || (!formData.invoice_text.trim() && !formData.file)}
                            className={`w-full py-2 px-4 mt-5 rounded-md text-white font-medium transition-colors  ${loading || (!formData.invoice_text.trim() && !formData.file) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                            style={{ backgroundColor: loading || (!formData.invoice_text.trim() && !formData.file) ? '#9CA3AF' : '#1E3A8A' }}
                        >
                            {loading ? 'Analyzing...' : 'Analyze Invoice'}
                        </button>
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
                        {result && (
                            <div className="w-full h-96 overflow-y-auto space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                                    Analysis Results
                                </h2>
                                
                                {/* Show text preview for file uploads */}
                                {result.extracted_text_preview && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Extracted Text Preview</h3>
                                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{result.extracted_text_preview}</p>
                                    </div>
                                )}
                                
                                {/* Error display */}
                                {invoiceData && invoiceData.error ? (
                                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                        <h3 className="text-md font-medium text-red-800 mb-2">Processing Error</h3>
                                        <p className="text-red-700 text-sm">{invoiceData.error}</p>
                                        {result.parsing_method && (
                                            <p className="text-xs text-red-600 mt-1">Method: {result.parsing_method}</p>
                                        )}
                                    </div>
                                ) : invoiceData && invoiceData.invoices && invoiceData.invoices.length > 0 ? (
                                    <div className="space-y-4">
                                        {/* Multiple invoices header */}
                                        {invoiceData.invoices.length > 1 && (
                                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                                <h3 className="text-md font-medium text-yellow-800 mb-2">
                                                    Found {invoiceData.invoices.length} Invoices
                                                </h3>
                                                <p className="text-yellow-700 text-sm">Multiple invoices detected in the document</p>
                                            </div>
                                        )}

                                        {/* Render each invoice */}
                                        {invoiceData.invoices.map((invoice, index) => (
                                            <div key={index} className={`p-4 rounded-lg border ${index === 0 ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                                                {index > 0 && (
                                                    <div className="mb-3 p-2 bg-gray-100 rounded text-center text-sm font-medium">
                                                        Invoice {index + 1} of {invoiceData.invoices.length}
                                                    </div>
                                                )}
                                                
                                                {/* Invoice Header */}
                                                <div className="mb-4">
                                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                                        {invoice.invoice_number || `Invoice ${index + 1}`}
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                        <p><strong>Vendor:</strong> {invoice.vendor_details || 'N/A'}</p>
                                                        <p><strong>Date:</strong> {formatDate(invoice.date)}</p>
                                                        <p><strong>Due Date:</strong> {formatDate(invoice.due_date)}</p>
                                                        <p><strong>Total:</strong> <span className="font-semibold text-lg text-blue-600">{formatCurrency(invoice.total)}</span></p>
                                                    </div>
                                                </div>

                                                {/* Line Items */}
                                                {invoice.line_items && invoice.line_items.length > 0 && (
                                                    <div className="mb-4">
                                                        <h5 className="text-md font-medium text-blue-800 mb-2">Line Items ({invoice.line_items.length})</h5>
                                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                                            {invoice.line_items.map((item, itemIndex) => (
                                                                <div key={itemIndex} className="border border-gray-200 rounded-md p-3 bg-white">
                                                                    <div className="flex justify-between items-start">
                                                                        <div className="flex-1">
                                                                            <p className="font-medium text-gray-900 text-sm" title={item.description}>
                                                                                {item.description.length > 50 ? item.description.substring(0, 50) + '...' : item.description}
                                                                            </p>
                                                                            <p className="text-sm text-gray-600">Qty: {item.quantity || 'N/A'} × {formatCurrency(item.price)}</p>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <p className="font-semibold text-gray-900">{formatCurrency(item.total)}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Tax */}
                                                {invoice.tax !== null && invoice.tax !== undefined && invoice.tax !== 0 && (
                                                    <div className="mb-2 p-2 bg-gray-100 rounded text-sm">
                                                        <p><strong>Tax:</strong> {formatCurrency(invoice.tax)}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Summary */}
                                        {invoiceData.summary && (
                                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                <h3 className="text-md font-medium text-green-800 mb-2">Summary</h3>
                                                <p className="text-gray-700 text-sm whitespace-pre-wrap">{invoiceData.summary}</p>
                                                {result.parsing_method && (
                                                    <p className="text-xs text-green-600 mt-2">Parsed with: {result.parsing_method}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl">📋</span>
                                        </div>
                                        <p className="text-lg font-medium mb-2">No invoices detected</p>
                                        <p className="text-sm">The document might not contain recognizable invoice data</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {!loading && !error && !result && (
                            <div className="w-full h-96 flex items-center justify-center text-gray-500">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">📄</span>
                                    </div>
                                    <h3 className="text-lg font-medium mb-2">Invoice Analysis Ready</h3>
                                    <p>Your extracted invoice details will appear here</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceAgent;