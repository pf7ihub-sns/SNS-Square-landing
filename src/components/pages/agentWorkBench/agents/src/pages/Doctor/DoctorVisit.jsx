import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Phone,
  User,
  Shield,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Send,
  MessageCircle,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DoctorVisit = () => {
  const { patientId, visitId } = useParams();
  const [patient, setPatient] = useState(null);
  const [currentVisit, setCurrentVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  // New state for questions
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [questionStates, setQuestionStates] = useState({});
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(null);
  const [isAnsweringQuestion, setIsAnsweringQuestion] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    } else {
      setError("Patient ID not provided");
      setLoading(false);
    }
  }, [patientId, visitId]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_DOCSENTRA || "http://localhost:8080";
      console.log("Fetching patient data:", patientId, "Visit ID:", visitId);

      const response = await fetch(
        `${API_BASE_URL}/patients/${patientId}`
      );
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Patient not found");
      }
      const data = await response.json();

      const visitResponse = await fetch(
        `${API_BASE_URL}/visits/${patientId}`
      );
      if (!visitResponse.ok) {
        const visitErr = await visitResponse.json();
        throw new Error(visitErr.detail || "Visits not found");
      }
      const visitsData = await visitResponse.json();

      data.total_visits = visitsData.total_visits || [];

      const current = visitId
        ? data.total_visits.find((v) => v.visit_id === visitId)
        : null;
      setCurrentVisit(current);
      setPatient(data);

      // Initial AI greeting with suggested questions
      generateInitialSuggestions(data);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  const parseQuestionsFromResponse = (data) => {
    let parsedQuestions = [];

    if (Array.isArray(data.questions)) {
      // Parse the response line by line
      const questionObjects = [];
      let currentQuestion = {};
      let inObject = false;

      data.questions.forEach((line) => {
        const trimmedLine = line.trim();

        // Skip introductory or closing text
        if (
          trimmedLine.toLowerCase().includes("based on") ||
          trimmedLine.toLowerCase().includes("these questions are designed") ||
          trimmedLine.toLowerCase().includes("i can suggest")
        ) {
          return;
        }

        // Detect start of object
        if (trimmedLine.match(/^\d+\.\s*\{/) || trimmedLine === "{") {
          inObject = true;
          currentQuestion = {};
          return;
        }

        // Parse question field
        if (inObject && trimmedLine.includes('"question"')) {
          const match = trimmedLine.match(/"question"\s*:\s*"([^"]+)"/);
          if (match) {
            currentQuestion.question = match[1];
          }
        }

        // Parse priority field
        if (inObject && trimmedLine.includes('"priority"')) {
          const match = trimmedLine.match(/"priority"\s*:\s*"([^"]+)"/i);
          if (match) {
            currentQuestion.priority = match[1].toUpperCase();
          }
        }

        // Detect end of object
        if (inObject && (trimmedLine.endsWith("}") || trimmedLine === "}")) {
          if (currentQuestion.question && currentQuestion.priority) {
            questionObjects.push({ ...currentQuestion });
          }
          inObject = false;
          currentQuestion = {};
        }
      });

      parsedQuestions = questionObjects;
    }

    // Fallback: if parsing failed, try alternative parsing
    if (parsedQuestions.length === 0 && Array.isArray(data.questions)) {
      const questions = data.questions.filter(
        (q) =>
          q.trim() &&
          !q.toLowerCase().includes("based on") &&
          !q.toLowerCase().includes("these questions are designed") &&
          !q.toLowerCase().includes("i can suggest") &&
          q.match(/^\d+\./)
      );

      // Clean up questions (remove numbering)
      parsedQuestions = questions.map((q, idx) => ({
        question: q.replace(/^\d+\.\s*/, "").trim(),
        priority: idx < 2 ? "HIGH" : "MEDIUM",
      }));
    }

    return parsedQuestions;
  };

  const generateInitialSuggestions = async (patientData) => {
    setMessages([
      {
        sender: "ai",
        text: `Hello Doctor! Reviewing ${patientData.full_name}'s profile. Analyzing patient data to suggest relevant questions...`,
      },
    ]);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_DOCSENTRA || "http://localhost:8080";
      const response = await fetch(`${API_BASE_URL}/chatbot/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_name: patientData.full_name,
          doctor_input:
            "Generate initial consultation questions based on patient history",
        }),
      });

      const data = await response.json();

      // Parse the AI response format
      const parsedQuestions = parseQuestionsFromResponse(data);

      if (parsedQuestions.length > 0) {
        setSuggestedQuestions(parsedQuestions.map((q) => q.question));

        // Initialize question states with priorities, all set to 'pending'
        const initialStates = {};
        parsedQuestions.forEach((q, index) => {
          initialStates[index] = { status: "pending", priority: q.priority };
        });
        setQuestionStates(initialStates);

        // Update AI message with questions ready
        setMessages([
          {
            sender: "ai",
            text: `Hello Doctor! I've reviewed ${patientData.full_name}'s profile and prepared ${parsedQuestions.length} suggested questions to guide your consultation. Click on any question below to ask the patient.`,
          },
        ]);
      } else {
        setMessages([
          {
            sender: "ai",
            text: `Hello Doctor! Reviewing ${patientData.full_name}'s profile. How can I assist today?`,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages([
        {
          sender: "ai",
          text: `Hello Doctor! Reviewing ${patientData.full_name}'s profile. How can I assist today?`,
        },
      ]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // If answering a question
    if (isAnsweringQuestion && activeQuestionIndex !== null) {
      const question = suggestedQuestions[activeQuestionIndex];

      // Mark as answered
      setQuestionStates((prev) => ({
        ...prev,
        [activeQuestionIndex]: {
          ...prev[activeQuestionIndex],
          status: "answered",
        },
      }));

      // Add to chat
      setMessages((prev) => [
        ...prev,
        { text: `Q: ${question}`, sender: "ai" },
        { text: `A: ${inputMessage}`, sender: "user" },
      ]);

      const answerText = inputMessage;
      setInputMessage("");
      setIsAnsweringQuestion(false);
      setActiveQuestionIndex(null);

      // Send to backend
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_DOCSENTRA || "http://localhost:8080";
        await fetch(`${API_BASE_URL}/chatbot/questions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patient_name: patient.full_name,
            doctor_input: `Question: ${question}\nAnswer: ${answerText}`,
          }),
        });
      } catch (err) {
        console.error("Error sending answer:", err);
      }

      return;
    }

    // Regular message flow
    setMessages((prev) => [...prev, { text: inputMessage, sender: "user" }]);
    const doctorInput = inputMessage;
    setInputMessage("");

    setMessages((prev) => [
      ...prev,
      { text: "Analyzing patient data...", sender: "ai" },
    ]);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_DOCSENTRA || "http://localhost:8080";
      const response = await fetch(`${API_BASE_URL}/chatbot/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_name: patient.full_name,
          doctor_input: doctorInput,
        }),
      });

      const data = await response.json();

      // Remove the temporary message
      setMessages((prev) => prev.slice(0, prev.length - 1));

      // Check if response contains new questions
      const newQuestions = parseQuestionsFromResponse(data);

      if (newQuestions.length > 0) {
        // Replace old questions with new ones
        setSuggestedQuestions(newQuestions.map((q) => q.question));

        // Reset question states with new priorities
        const newStates = {};
        newQuestions.forEach((q, index) => {
          newStates[index] = { status: "pending", priority: q.priority };
        });
        setQuestionStates(newStates);

        // Add AI response about new questions
        setMessages((prev) => [
          ...prev,
          {
            text: `I've updated the suggested questions based on our conversation. ${newQuestions.length} new questions are now available to guide your consultation.`,
            sender: "ai",
          },
        ]);
      } else {
        // Add regular AI response
        setMessages((prev) => [
          ...prev,
          { text: data.response || "Analysis complete.", sender: "ai" },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev.slice(0, prev.length - 1),
        { text: "Error processing your message.", sender: "ai" },
      ]);
    }
  };

  const handleQuestionClick = (index) => {
    const question = suggestedQuestions[index];

    // Mark as asked
    setQuestionStates((prev) => ({
      ...prev,
      [index]: { ...prev[index], status: "asked" },
    }));

    setActiveQuestionIndex(index);
    setIsAnsweringQuestion(true);
    setInputMessage(""); // Clear input for answer
  };

  const cancelAnswering = () => {
    if (activeQuestionIndex !== null) {
      // Reset question state back to pending
      setQuestionStates((prev) => ({
        ...prev,
        [activeQuestionIndex]: {
          ...prev[activeQuestionIndex],
          status: "pending",
        },
      }));
    }
    setIsAnsweringQuestion(false);
    setActiveQuestionIndex(null);
    setInputMessage("");
  };

  const finishConsultation = () => {
    if (!patient || !visitId) return;

    // Navigate to AI suggestion page and pass current conversation
    navigate(`suggestion`, {
      state: { conversation: messages, patientName: patient.full_name },
    });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        {error}
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left Panel - Patient Info */}
      <div
        className={`bg-white transition-all duration-300 ease-in-out flex-shrink-0 ${
          leftPanelOpen ? "w-80" : "w-0"
        } overflow-hidden border-r border-gray-200`}
      >
  <div className="p-6 pt-27 overflow-y-auto h-full">
          <div className="bg-blue-50 rounded-lg py-2 px-4 mb-4 flex items-center justify-center">
            <h2 className="text-xl font-bold text-blue-700">General Details</h2>
          </div>

          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{patient.full_name}</h2>
              <p className="text-gray-600 text-sm">ID: {patient.patient_id}</p>
              {currentVisit && (
                <p className="text-gray-600 text-sm">
                  Visit: {currentVisit.visit_number}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Age / DOB</p>
              <p className="font-medium">{patient.age} years</p>
              <p className="text-sm text-gray-600">
                {new Date(patient.dob).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium">{patient.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Marital Status</p>
              <p className="font-medium">{patient.marital_status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Blood Group</p>
              <p className="font-medium">{patient.blood_group}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Occupation</p>
              <p className="font-medium">{patient.occupation}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-3">Contact Details</h3>
            <div className="flex items-center mb-2">
              <Phone className="w-4 h-4 text-gray-400 mr-2" />
              <p className="font-medium">{patient.mobile_number}</p>
            </div>
            {patient.alternate_number && (
              <div className="flex items-center mb-2">
                <Phone className="w-4 h-4 text-gray-400 mr-2" />
                <p className="font-medium">{patient.alternate_number}</p>
              </div>
            )}
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {patient.address_line_1}, {patient.city}, {patient.district},{" "}
                {patient.state} - {patient.pin_code}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500">Aadhaar Number</p>
            <p className="font-medium">{patient.aadhaar_number}</p>
            <p className="text-sm text-gray-500 mt-1">
              ID Verified: {patient.id_verified ? "Yes" : "No"}
            </p>
            <p className="text-sm text-gray-500">
              Consent Taken: {patient.consent_taken ? "Yes" : "No"}
            </p>
          </div>

          <div className="mb-6 p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600 font-medium flex items-center">
              <Shield className="w-4 h-4 mr-1" /> EMERGENCY
            </p>
            <p className="font-medium mt-1">
              {patient.emergency_name} ({patient.emergency_relation})
            </p>
            <p className="text-sm">{patient.emergency_phone}</p>
          </div>
        </div>
      </div>

      {/* Left Panel Toggle */}
      <button
        onClick={() => setLeftPanelOpen(!leftPanelOpen)}
        className="fixed top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-r-lg shadow-lg hover:bg-gray-50 transition-all duration-200 z-20 p-2"
        style={{ left: leftPanelOpen ? "20rem" : "0" }}
      >
        {leftPanelOpen ? (
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Middle Panel - AI Chat & Questions */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden min-w-0">
        <div className="bg-blue-50 rounded-lg py-2 px-4 mb-4 flex items-center justify-center">
          <h2 className="text-2xl font-bold text-blue-700">
            Docsentra AI Consulting
          </h2>
        </div>

        {/* Chat Area */}
  <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col p-4 pt-22 min-h-0">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "items-start"
                }`}
              >
                {m.sender === "ai" && (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    🤖
                  </div>
                )}
                <div
                  className={`p-3 rounded-lg max-w-md ${
                    m.sender === "user"
                      ? "bg-gray-100"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Suggested Questions Panel - Above Input */}
          {suggestedQuestions.length > 0 && (
            <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <MessageCircle className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-sm font-semibold text-gray-800">
                    AI Suggested Questions
                  </h3>
                </div>
                <button
                  onClick={finishConsultation}
                  className="text-xs bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-colors"
                >
                  Finish Guidance
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {suggestedQuestions.map((question, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border transition-all ${
                      questionStates[index]?.status === "answered"
                        ? "bg-green-100 border-green-400"
                        : questionStates[index]?.status === "asked"
                        ? "bg-blue-100 border-blue-400"
                        : "bg-white border-gray-200 hover:border-blue-300 cursor-pointer"
                    }`}
                    onClick={() => {
                      if (questionStates[index]?.status === "pending") {
                        handleQuestionClick(index);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-gray-800 flex-1 pr-2">
                        {question}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded flex-shrink-0 ${
                          questionStates[index]?.priority === "HIGH"
                            ? "bg-red-500 text-white"
                            : questionStates[index]?.priority === "MEDIUM"
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-400 text-white"
                        }`}
                      >
                        {questionStates[index]?.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-600">
                        {questionStates[index]?.status === "answered" &&
                          "✓ Answered"}
                        {questionStates[index]?.status === "asked" &&
                          "⏳ Awaiting answer"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Answer Mode Banner */}
          {isAnsweringQuestion && activeQuestionIndex !== null && (
            <div className="mb-2 p-2 bg-blue-100 border border-blue-300 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm text-blue-800 font-medium">
                  Answering: {suggestedQuestions[activeQuestionIndex]}
                </span>
              </div>
              <button
                onClick={cancelAnswering}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="flex space-x-2 border-t pt-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                isAnsweringQuestion
                  ? "Type patient's answer..."
                  : "Type a message..."
              }
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel Toggle */}
      <button
        onClick={() => setRightPanelOpen(!rightPanelOpen)}
        className="fixed top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-l-lg shadow-lg hover:bg-gray-50 transition-all duration-200 z-20 p-2"
        style={{ right: rightPanelOpen ? "24rem" : "0" }}
      >
        {rightPanelOpen ? (
          <ChevronRight className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Right Panel - Visit Details */}
      <div
        className={`bg-white transition-all duration-300 ease-in-out flex-shrink-0 ${
          rightPanelOpen ? "w-96" : "w-0"
        } overflow-hidden border-l border-gray-200`}
      >
  <div className="p-6 pt-27 h-full overflow-y-auto">
          <div className="bg-blue-50 rounded-lg py-2 px-4 mb-4 flex items-center justify-center">
            <h2 className="text-xl font-bold text-blue-700 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              All Visits
            </h2>
          </div>

          {patient?.total_visits?.length > 0 ? (
            patient.total_visits
              .sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date))
              .map((visit) => (
                <div
                  key={visit.visit_id}
                  className={`mb-4 p-4 border rounded-xl shadow-sm transition-all ${
                    visit.visit_id === currentVisit?.visit_id
                      ? "bg-blue-100 border-blue-500"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-gray-700">
                      {new Date(visit.visit_date).toLocaleDateString()}
                    </p>
                    {visit.visit_id === currentVisit?.visit_id && (
                      <span className="text-sm text-blue-600 font-medium">
                        Current Visit
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Reason:</span>{" "}
                    {visit.reason_for_visit || "Not specified"}
                  </p>
                  {visit.chief_complaints && (
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Chief Complaints:</span>{" "}
                      {visit.chief_complaints}
                    </p>
                  )}

                  {visit.symptoms?.length > 0 && (
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Symptoms:</span>{" "}
                      {visit.symptoms.join(", ")}
                    </p>
                  )}

                  {visit.latest_vitals && (
                    <div className="text-gray-700 text-sm mt-2 bg-gray-100 p-2 rounded-lg">
                      <p>
                        <span className="font-medium">BP:</span>{" "}
                        {visit.latest_vitals.bloodPressure}
                      </p>
                      <p>
                        <span className="font-medium">Pulse:</span>{" "}
                        {visit.latest_vitals.pulseRate}
                      </p>
                      <p>
                        <span className="font-medium">Temp:</span>{" "}
                        {visit.latest_vitals.temperature}°F
                      </p>
                      <p>
                        <span className="font-medium">SPO2:</span>{" "}
                        {visit.latest_vitals.spo2}
                      </p>
                      <p>
                        <span className="font-medium">Weight:</span>{" "}
                        {visit.latest_vitals.weight} kg
                      </p>
                      <p>
                        <span className="font-medium">Height:</span>{" "}
                        {visit.latest_vitals.height} cm
                      </p>
                    </div>
                  )}

                  {visit.chronic_conditions_list?.length > 0 && (
                    <p className="text-gray-600 mt-2 text-sm">
                      <span className="font-medium">Chronic Conditions:</span>{" "}
                      {visit.chronic_conditions_list.join(", ")}
                    </p>
                  )}

                  {visit.doctor_notes && (
                    <p className="text-gray-600 mt-2 text-sm">
                      <span className="font-medium">Doctor Notes:</span>{" "}
                      {visit.doctor_notes}
                    </p>
                  )}

                  {visit.visit_summary && (
                    <p className="text-gray-600 mt-2 text-sm">
                      <span className="font-medium">Summary:</span>{" "}
                      {visit.visit_summary.replace(/\*\*/g, "")}
                    </p>
                  )}
                </div>
              ))
          ) : (
            <div className="text-center text-gray-500 mt-10">
              No visits available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorVisit;
