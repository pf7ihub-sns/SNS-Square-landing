import React, { useEffect, useState, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  FileText,
  Pill,
  Utensils,
  FlaskConical,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Sparkles,
} from "lucide-react";

const AIsuggestion = () => {
  const { patientId, visitId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { conversation, patientName } = location.state || {};
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    console.log('AIsuggestion useEffect triggered:', { 
      hasConversation: !!conversation, 
      hasPatientName: !!patientName, 
      hasFetchedBefore: hasFetched.current 
    });

    if (!conversation || !patientName) {
      setError("No conversation data available.");
      setLoading(false);
      return;
    }

    // Prevent multiple API calls
    if (hasFetched.current) {
      console.log('Skipping API call - already fetched');
      return;
    }

    const fetchRecommendations = async () => {
      hasFetched.current = true;
      console.log('Making API call for AI suggestions...');
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_DOCSENTRA || "http://localhost:8080";
        const res = await fetch(`${API_BASE_URL}/chatbot/suggestions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patient_name: patientName,
            conversation: conversation.map((msg) => ({
              sender: msg.sender,
              text: msg.text,
            })),
          }),
        });
        const data = await res.json();
        setRecommendations(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch AI recommendations.");
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [conversation, patientName]);

  const handleBack = () => {
    navigate("../", { relative: "path" });
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Enhanced AI Loader */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="w-32 h-32 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
          
          {/* Inner pulsing circle */}
          <div className="absolute inset-4 w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center animate-pulse shadow-lg">
            <Sparkles className="w-8 h-8 text-white animate-bounce" />
          </div>
          
          {/* Floating particles */}
          <div className="absolute -top-2 -left-2 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping delay-75"></div>
          <div className="absolute -bottom-3 -left-1 w-1 h-1 bg-blue-300 rounded-full animate-ping delay-150"></div>
          <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-blue-600 rounded-full animate-ping delay-300"></div>
        </div>
        
        {/* Professional loading text */}
        <div className="mt-8 text-center">
          <h3 className="text-2xl font-semibold text-slate-800 mb-2 animate-pulse">
            AI Analysis in Progress
          </h3>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
          <p className="text-slate-600 text-lg font-medium mb-2">
            Generating Clinical Recommendations
          </p>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            Our advanced AI is analyzing patient data and conversation history to provide personalized medical insights
          </p>
        </div>
        
        {/* Progress steps */}
        <div className="mt-12 flex items-center space-x-8">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mb-2">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-slate-600 font-medium">Data Processing</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mb-2 animate-pulse">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
            <span className="text-xs text-slate-600 font-medium">AI Analysis</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center mb-2">
              <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Generating Report</span>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-red-600 text-lg font-medium">{error}</p>
        <button
          onClick={handleBack}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Consultation
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-6 pt-30 font-manrope">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-4 flex items-center text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="font-medium">Back to Consultation</span>
        </button>

        {/* Main Container - AI Clinical Recommendations */}
        <div className="bg-white rounded-lg border-2 border-slate-300 shadow-sm">
          {/* Header inside main box */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  AI Clinical Recommendations
                </h1>
                <p className="text-slate-600 text-sm mt-1">
                  {patientName}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={async () => {
                    try {
                      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_DOCSENTRA || "http://localhost:8080";
                      const res = await fetch(
                        `${API_BASE_URL}/patients/${patientId}`,
                        {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: "revising" })
                        }
                      );
                      if (!res.ok) {
                        const errData = await res.json();
                        throw new Error(errData.detail || "Failed to update patient");
                      }
                      handleBack();
                    } catch (err) {
                      alert("Error updating patient: " + err.message);
                    }
                  }}
                  className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium border border-blue-600"
                >
                  Revise
                </button>
                <button
                  onClick={async () => {
                    try {
                      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_DOCSENTRA || "http://localhost:8080";
                      const res = await fetch(
                        `${API_BASE_URL}/chatbot/complete`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            patient_id: patientId,
                            visit_id: visitId,
                          }),
                        }
                      );

                      if (!res.ok) {
                        const errData = await res.json();
                        throw new Error(
                          errData.detail || "Failed to complete appointment"
                        );
                      }

                      navigate("../../../../dashboard", { relative: "path" });
                    } catch (err) {
                      console.error(err);
                      alert("Error completing appointment: " + err.message);
                    }
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Accept & Continue to next patients
                </button>
              </div>
            </div>
          </div>

          {/* Content Grid inside main box */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clinical Suggestions - Left Column */}
          <div className="bg-blue-50 rounded-lg border border-slate-200">
            <div className="px-6 py-4 flex items-center">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center mr-2">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Clinical Suggestions
              </h3>
            </div>
            <div className="px-6 pb-6">
              {recommendations?.suggestions &&
              recommendations.suggestions.length > 0 ? (
                <ul className="space-y-2">
                  {recommendations.suggestions.map((item, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <span className="text-slate-900 leading-relaxed">
                        <span className="font-semibold">• </span>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 text-center py-8 text-sm">
                  No suggestions available
                </p>
              )}
            </div>
          </div>

          {/* Prescription Recommendations - Right Column */}
          <div className="bg-blue-50 rounded-lg border border-slate-200">
            <div className="px-6 py-4 flex items-center">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center mr-2">
                <Pill className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Prescription Recommendations
              </h3>
            </div>
            <div className="px-6 pb-6">
              {recommendations?.prescription &&
              recommendations.prescription.length > 0 ? (
                <ul className="space-y-2">
                  {recommendations.prescription.map((item, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <span className="text-slate-900 leading-relaxed">
                        <span className="font-semibold">• </span>
                        {typeof item === 'string' ? item : `${item.medicine_name || item.name || ''} ${item.dosage || ''} ${item.frequency || item.instructions || ''} ${item.purpose ? '- ' + item.purpose : ''}`}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 text-center py-8 text-sm">
                  No prescription recommendations
                </p>
              )}
            </div>
          </div>

          {/* Diet Plan - Left Column */}
          <div className="bg-blue-50 rounded-lg border border-slate-200">
            <div className="px-6 py-4 flex items-center">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center mr-2">
                <Utensils className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Diet Plan
              </h3>
            </div>
            <div className="px-6 pb-6">
              {recommendations?.diet_plan &&
              recommendations.diet_plan.length > 0 ? (
                <ul className="space-y-2">
                  {recommendations.diet_plan.map((item, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <span className="text-slate-900 leading-relaxed">
                        <span className="font-semibold">• </span>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 text-center py-8 text-sm">
                  No diet recommendations
                </p>
              )}
            </div>
          </div>

          {/* Lab Test Recommendations - Right Column */}
          <div className="bg-blue-50 rounded-lg border border-slate-200">
            <div className="px-6 py-4 flex items-center">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center mr-2">
                <FlaskConical className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Lab Test Recommendation
              </h3>
            </div>
            <div className="px-6 pb-6">
              {recommendations?.lab_test_recommendation &&
              recommendations.lab_test_recommendation.length > 0 ? (
                <ul className="space-y-2">
                  {recommendations.lab_test_recommendation.map((item, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <span className="text-slate-900 leading-relaxed">
                        <span className="font-semibold">• </span>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 text-center py-8 text-sm">
                  No lab test recommendations
                </p>
              )}
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIsuggestion;