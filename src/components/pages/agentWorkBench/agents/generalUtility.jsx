import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, AlertCircle } from 'lucide-react';

// Error Boundary Component
class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 text-center text-red-600">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold">Something Went Wrong</h2>
                    <p className="text-sm">{this.state.error.message}</p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

const API_BASE = "http://127.0.0.1:8000";

// Predefined options
const TIME_ZONES = [
    "UTC", "Asia/Kolkata", "America/New_York", "Europe/London", "Australia/Sydney",
    "Asia/Tokyo", "Europe/Paris", "America/Los_Angeles"
];
const UNITS = [
    { from: "kilometers", to: ["miles", "meters"] },
    { from: "meters", to: ["kilometers", "miles"] },
    { from: "liters", to: ["gallons", "milliliters"] },
    { from: "grams", to: ["kilograms", "pounds"] }
];
const CURRENCIES = ["USD", "INR", "EUR", "GBP", "JPY", "AUD"];

const GeneralUtility = () => {
    const [mode, setMode] = useState('nl');
    const [nlQuery, setNlQuery] = useState('');
    const [datetimeStr, setDatetimeStr] = useState('');
    const [fromTz, setFromTz] = useState('Asia/Kolkata');
    const [toTz, setToTz] = useState('America/New_York');
    const [value, setValue] = useState('');
    const [fromUnit, setFromUnit] = useState('kilometers');
    const [toUnit, setToUnit] = useState('miles');
    const [amount, setAmount] = useState('');
    const [fromCur, setFromCur] = useState('USD');
    const [toCur, setToCur] = useState('INR');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setResult(null);
        setError(null);
    }, [mode]);

    const isFormValid = () => {
        switch (mode) {
            case 'nl':
                return nlQuery.trim().length > 0;
            case 'time':
                return datetimeStr.trim().length > 0 && fromTz.length > 0 && toTz.length > 0;
            case 'unit':
                return value.trim().length > 0 && fromUnit.length > 0 && toUnit.length > 0;
            case 'currency':
                return amount.trim().length > 0 && fromCur.length > 0 && toCur.length > 0;
            default:
                return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid()) {
            setError('Please fill in all required fields for the selected mode.');
            return;
        }

        let query;
        if (mode === 'nl') {
            query = nlQuery.trim();
        } else if (mode === 'time') {
            query = { datetime_str: datetimeStr, from_tz: fromTz, to_tz: toTz };
        } else if (mode === 'unit') {
            query = { value: parseFloat(value), from_unit: fromUnit, to_unit: toUnit };
        } else if (mode === 'currency') {
            query = { amount: parseFloat(amount), from_cur: fromCur, to_cur: toCur };
        } else {
            setError('Invalid mode selected.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post(`${API_BASE}/general-utility-conversion/general-utility`, {
                query,
            }, {
                headers: { 'Content-Type': 'application/json' },
            });
            setResult(response.data.result);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error processing conversion. Please try again.');
            console.error('API Error:', err.response?.data); // Debug log
        } finally {
            setLoading(false);
        }
    };

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="w-full max-w-5xl mt-22">
                    {/* Header */}
                    <div className="relative">
                        <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                            General Utility Conversion
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
                        <p className="mb-2">Convert time zones, units, or currencies using natural language or structured input.</p>
                        <p className="text-sm">Select a mode and provide the required details to perform the conversion.</p>
                    </div>

                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mode
                                </label>
                                <select
                                    id="mode"
                                    value={mode}
                                    onChange={(e) => setMode(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="nl">Natural Language</option>
                                    <option value="time">Structured - Time Zone</option>
                                    <option value="unit">Structured - Unit</option>
                                    <option value="currency">Structured - Currency</option>
                                </select>
                            </div>

                            {mode === 'nl' && (
                                <div>
                                    <label htmlFor="nlQuery" className="block text-sm font-medium text-gray-700 mb-1">
                                        Natural Language Query
                                    </label>
                                    <textarea
                                        id="nlQuery"
                                        value={nlQuery}
                                        onChange={(e) => setNlQuery(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-24 resize-none"
                                        placeholder='e.g., "Convert 2025-09-18 14:30 from Asia/Kolkata to America/New_York"'
                                    />
                                </div>
                            )}

                            {mode === 'time' && (
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="datetimeStr" className="block text-sm font-medium text-gray-700 mb-1">
                                            Datetime (YYYY-MM-DD HH:MM)
                                        </label>
                                        <input
                                            id="datetimeStr"
                                            type="text"
                                            value={datetimeStr}
                                            onChange={(e) => setDatetimeStr(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            placeholder="e.g., 2025-09-18 14:30"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="fromTz" className="block text-sm font-medium text-gray-700 mb-1">
                                            From Timezone
                                        </label>
                                        <select
                                            id="fromTz"
                                            value={fromTz}
                                            onChange={(e) => setFromTz(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        >
                                            {TIME_ZONES.map((tz) => (
                                                <option key={tz} value={tz}>{tz}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="toTz" className="block text-sm font-medium text-gray-700 mb-1">
                                            To Timezone
                                        </label>
                                        <select
                                            id="toTz"
                                            value={toTz}
                                            onChange={(e) => setToTz(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        >
                                            {TIME_ZONES.map((tz) => (
                                                <option key={tz} value={tz}>{tz}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {mode === 'unit' && (
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                                            Value
                                        </label>
                                        <input
                                            id="value"
                                            type="number"
                                            value={value}
                                            onChange={(e) => setValue(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            placeholder="e.g., 10"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="fromUnit" className="block text-sm font-medium text-gray-700 mb-1">
                                            From Unit
                                        </label>
                                        <select
                                            id="fromUnit"
                                            value={fromUnit}
                                            onChange={(e) => setFromUnit(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        >
                                            {UNITS.map((unit, index) => (
                                                <option key={index} value={unit.from}>{unit.from}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="toUnit" className="block text-sm font-medium text-gray-700 mb-1">
                                            To Unit
                                        </label>
                                        <select
                                            id="toUnit"
                                            value={toUnit}
                                            onChange={(e) => setToUnit(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        >
                                            {UNITS.find((u) => u.from === fromUnit)?.to.map((unit, index) => (
                                                <option key={index} value={unit}>{unit}</option>
                                            )) || []}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {mode === 'currency' && (
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                                            Amount
                                        </label>
                                        <input
                                            id="amount"
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            placeholder="e.g., 100"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="fromCur" className="block text-sm font-medium text-gray-700 mb-1">
                                            From Currency
                                        </label>
                                        <select
                                            id="fromCur"
                                            value={fromCur}
                                            onChange={(e) => setFromCur(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        >
                                            {CURRENCIES.map((cur) => (
                                                <option key={cur} value={cur}>{cur}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="toCur" className="block text-sm font-medium text-gray-700 mb-1">
                                            To Currency
                                        </label>
                                        <select
                                            id="toCur"
                                            value={toCur}
                                            onChange={(e) => setToCur(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        >
                                            {CURRENCIES.map((cur) => (
                                                <option key={cur} value={cur}>{cur}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !isFormValid()}
                                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !isFormValid() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                                style={{ backgroundColor: loading || !isFormValid() ? '#9CA3AF' : '#1E3A8A' }}
                            >
                                {loading ? 'Converting...' : 'Convert'}
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
                        {result ? (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-4">Conversion Result</h2>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700 text-base leading-relaxed">{result}</p>
                                </div>
                            </div>
                        ) : !loading && !error ? (
                            <div className="w-full h-96 flex items-center justify-center text-gray-500 text-lg">
                                Your conversion result will appear here
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default GeneralUtility;