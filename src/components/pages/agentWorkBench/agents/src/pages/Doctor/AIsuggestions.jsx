import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!conversation || !patientName) {
      setError("No conversation data available.");
      setLoading(false);
      return;
    }

    const fetchRecommendations = async () => {
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
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 text-lg">
          Generating AI Recommendations...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
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
  <div className="min-h-screen bg-gray-50 p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-700 flex items-center font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Consultation
          </button>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg py-4 px-6 flex items-center justify-between shadow-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  AI Clinical Recommendations
                </h1>
                <p className="text-blue-100 text-sm mt-1">
                  For {patientName} - Visit ID: {visitId}
                </p>
              </div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-300" />
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clinical Suggestions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Clinical Suggestions
                </h3>
              </div>
            </div>
            <div className="p-6">
              {recommendations?.suggestions &&
              recommendations.suggestions.length > 0 ? (
                <ul className="space-y-3">
                  {recommendations.suggestions.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No suggestions available
                </p>
              )}
            </div>
          </div>

          {/* Prescription */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-green-50 px-6 py-4 border-b border-green-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                  <Pill className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Prescription Recommendations
                </h3>
              </div>
            </div>
            <div className="p-6">
              {recommendations?.prescription &&
              recommendations.prescription.length > 0 ? (
                <ul className="space-y-3">
                  {recommendations.prescription.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No prescription recommendations
                </p>
              )}
            </div>
          </div>

          {/* Diet Plan */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-orange-50 px-6 py-4 border-b border-orange-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                  <Utensils className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Diet Plan
                </h3>
              </div>
            </div>
            <div className="p-6">
              {recommendations?.diet_plan &&
              recommendations.diet_plan.length > 0 ? (
                <ul className="space-y-3">
                  {recommendations.diet_plan.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No diet recommendations
                </p>
              )}
            </div>
          </div>

          {/* Lab Test Recommendations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-purple-50 px-6 py-4 border-b border-purple-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <FlaskConical className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Lab Test Recommendations
                </h3>
              </div>
            </div>
            <div className="p-6">
              {recommendations?.lab_test_recommendation &&
              recommendations.lab_test_recommendation.length > 0 ? (
                <ul className="space-y-3">
                  {recommendations.lab_test_recommendation.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No lab test recommendations
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <AlertCircle className="w-5 h-5 mr-2" />
              <p className="text-sm">
                These recommendations are AI-generated and should be reviewed by
                the physician.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={async () => {
                  try {
                    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_DOCSENTRA || "http://localhost:8080";
                    // Example: update patient status to 'revising' (customize as needed)
                    const res = await fetch(
                      `${API_BASE_URL}/patients/${patientId}`,
                      {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "revising" }) // Add more fields as needed
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
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
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

                    // Navigate to dashboard after successful completion
                    navigate("../../../../dashboard", { relative: "path" });
                  } catch (err) {
                    console.error(err);
                    alert("Error completing appointment: " + err.message);
                  }
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Accept & Continue to next patient
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIsuggestion;
