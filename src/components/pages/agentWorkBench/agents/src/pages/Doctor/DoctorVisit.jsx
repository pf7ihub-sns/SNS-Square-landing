import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Phone,
  User,
  Shield,
  Calendar,
  Send,
  MessageCircle,
  X,
  ArrowLeft,
  Loader2,
  Sparkles,
  CheckCircle,
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
  
  // Ref for auto-focusing the input
  const inputRef = useRef(null);

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    } else {
      setError("Patient ID not provided");
      setLoading(false);
    }
  }, [patientId, visitId]);

  // Auto-focus input when entering answer mode
  useEffect(() => {
    if (isAnsweringQuestion && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAnsweringQuestion]);

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
          patient_id: patientData.patient_id, // ADD patient_id for patient-specific questions
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
            patient_id: patient.patient_id, // ADD patient_id for context-aware processing
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
          patient_id: patient.patient_id, // ADD patient_id for patient-specific responses
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
    const currentStatus = questionStates[index]?.status;
    
    // If this question is already active, do nothing
    if (activeQuestionIndex === index && isAnsweringQuestion) {
      return;
    }
    
    // If already answered, don't allow re-selection
    if (currentStatus === "answered") {
      return;
    }
    
    // If currently answering another question, reset that question to pending
    if (isAnsweringQuestion && activeQuestionIndex !== null) {
      setQuestionStates((prev) => ({
        ...prev,
        [activeQuestionIndex]: {
          ...prev[activeQuestionIndex],
          status: "pending",
        },
      }));
    }
    
    // If clicking on an "asked" question that's not active, deselect it
    if (currentStatus === "asked" && activeQuestionIndex !== index) {
      setQuestionStates((prev) => ({
        ...prev,
        [index]: { ...prev[index], status: "pending" },
      }));
      return;
    }
    
    // Mark as asked and set as active
    setQuestionStates((prev) => ({
      ...prev,
      [index]: { ...prev[index], status: "asked" },
    }));

    setActiveQuestionIndex(index);
    setIsAnsweringQuestion(true);
    setInputMessage(""); // Clear input for answer
    
    // Auto-focus the input box after a short delay to ensure state is updated
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
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
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Enhanced Patient Data Loader */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="w-32 h-32 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
          
          {/* Inner pulsing circle */}
          <div className="absolute inset-4 w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center animate-pulse shadow-lg">
            <User className="w-8 h-8 text-white animate-bounce" />
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
            Loading Patient Data
          </h3>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
          <p className="text-slate-600 text-lg font-medium mb-2">
            Preparing Consultation Interface
          </p>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            Fetching patient records, medical history, and setting up the consultation workspace
          </p>
        </div>
        
        {/* Progress steps */}
        <div className="mt-12 flex items-center space-x-8">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mb-2">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-slate-600 font-medium">Authentication</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mb-2 animate-pulse">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
            <span className="text-xs text-slate-600 font-medium">Patient Data</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center mb-2">
              <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Interface Ready</span>
          </div>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-white text-red-600">
        {error}
      </div>
    );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-manrope">
      {/* Back Button - Fixed at top */}
      <div className="absolute top-25 left-6 z-50">
        <button
          onClick={() => navigate("/agent-playground/agent/Doc-Sentra/doctor/dashboard")}
          className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="font-medium">Back to Dashboard</span>
        </button>
      </div>

      {/* Left Panel - Patient Info */}
      <div
        className={`bg-white transition-all duration-300 ease-in-out flex-shrink-0 ${
          leftPanelOpen ? "w-80" : "w-0"
        } overflow-hidden border-r border-slate-200`}
      >
        <div className="p-6 pt-33 overflow-y-auto h-full">
          <div className="bg-blue-100 rounded-lg py-3 px-4 mb-6">
            <h2 className="text-base font-bold text-blue-600">Personal Information</h2>
          </div>

          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mr-4 text-white font-bold text-xl">
              {patient.full_name?.charAt(0) || "H"}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{patient.full_name}</h2>
              <p className="text-slate-500 text-sm">ID: {patient.patient_id}</p>
              {currentVisit && (
                <p className="text-slate-500 text-sm">
                  Visit: {currentVisit.visit_number}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <p className="text-xs text-slate-500 mb-1">Age / DOB</p>
              <p className="font-medium text-slate-900 text-sm">{patient.age} years</p>
              <p className="text-xs text-slate-600">
                {new Date(patient.dob).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Gender</p>
              <p className="font-medium text-slate-900 text-sm">{patient.gender}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Marital Status</p>
              <p className="font-medium text-slate-900 text-sm">{patient.marital_status}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Blood Group</p>
              <p className="font-medium text-slate-900 text-sm">{patient.blood_group}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Occupation</p>
              <p className="font-medium text-slate-900 text-sm">{patient.occupation}</p>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b border-slate-200">
            <h3 className="font-semibold text-slate-700 mb-3 text-sm">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-slate-400 mr-2" />
                <p className="text-slate-900 text-sm">{patient.mobile_number}</p>
              </div>
              {patient.alternate_number && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-slate-400 mr-2" />
                  <p className="text-slate-900 text-sm">{patient.alternate_number}</p>
                </div>
              )}
              <div className="mt-2">
                <p className="text-xs text-slate-600">
                  {patient.address_line_1}, {patient.city}, {patient.district},{" "}
                  {patient.state} - {patient.pin_code}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b border-slate-200">
            <div className="space-y-2">
              <div>
                <p className="text-xs text-slate-500 mb-1">Aadhaar Number</p>
                <p className="font-medium text-slate-900 text-sm">{patient.aadhaar_number}</p>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center">
                  <span className="text-xs text-slate-500">ID Verified:</span>
                  <span className="ml-1 text-xs text-green-600 font-medium">{patient.id_verified ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-slate-500">Consent Taken:</span>
                  <span className="ml-1 text-xs text-green-600 font-medium">{patient.consent_taken ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs text-red-700 font-semibold flex items-center mb-2">
              <Shield className="w-4 h-4 mr-1" /> Emergency
            </p>
            <p className="font-medium text-slate-900 text-sm mb-1">
              {patient.emergency_name}
            </p>
            <p className="text-xs text-slate-600">({patient.emergency_relation})</p>
            <p className="text-sm text-slate-900 mt-1">{patient.emergency_phone}</p>
          </div>
        </div>
      </div>



      {/* Middle Panel - AI Chat & Questions */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden min-w-0 pt-32">
        {/* Chat Area */}
        <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col p-6 min-h-0 border-2 border-slate-100">
          {/* Header inside the box */}
          <div className="mb-4 pb-3 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              Docsentra AI Consulting
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "items-start"
                }`}
              >
                <div
                  className={`p-3 rounded-lg max-w-md text-sm ${
                    m.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-900"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Suggested Questions Panel - Above Input */}
          {suggestedQuestions.length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    AI Suggested Questions
                  </h3>
                </div>
                <button
                  onClick={finishConsultation}
                  className="text-sm bg-white hover:bg-blue-50 text-blue-600 border border-blue-600 px-4 py-1.5 rounded-md transition-colors font-medium"
                >
                  Finish Guidance
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {suggestedQuestions.map((question, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border transition-all text-sm ${
                      questionStates[index]?.status === "answered"
                        ? "bg-green-50 border-green-300 cursor-not-allowed"
                        : questionStates[index]?.status === "asked"
                        ? "bg-blue-50 border-blue-300 cursor-pointer hover:bg-blue-100"
                        : "bg-white border-slate-200 hover:border-blue-400 cursor-pointer"
                    }`}
                    onClick={() => {
                      // Allow clicking on pending or asked questions (but not answered ones)
                      if (questionStates[index]?.status !== "answered") {
                        handleQuestionClick(index);
                      }
                    }}
                  >
                    <div className="flex flex-col gap-2">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full flex-shrink-0 font-medium self-start ${
                          questionStates[index]?.priority === "HIGH"
                            ? "bg-red-100 text-red-600"
                            : questionStates[index]?.priority === "MEDIUM"
                            ? "bg-yellow-100 text-yellow-700"
                            : questionStates[index]?.priority === "LOW"
                            ? "bg-slate-200 text-slate-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {questionStates[index]?.priority || "LOW"}
                      </span>
                      <p className="text-slate-900">
                        {question}
                      </p>
                    </div>
                    {questionStates[index]?.status && (
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-600">
                          {questionStates[index]?.status === "answered" && "✓ Answered"}
                          {questionStates[index]?.status === "asked" && activeQuestionIndex === index && "⏳ Active - Awaiting answer"}
                          {questionStates[index]?.status === "asked" && activeQuestionIndex !== index && "📋 Selected"}
                        </span>
                        {questionStates[index]?.status === "asked" && activeQuestionIndex !== index && (
                          <span className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
                            Click to deselect
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Answer Mode Banner */}
          {isAnsweringQuestion && activeQuestionIndex !== null && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-300 rounded-lg flex items-center justify-between">
              <div className="flex items-center flex-1">
                <MessageCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                <span className="text-sm text-blue-800 font-medium">
                  Answering: {suggestedQuestions[activeQuestionIndex]}
                </span>
              </div>
              <button
                onClick={cancelAnswering}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-2"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="flex gap-3 pt-4">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                isAnsweringQuestion
                  ? "Type patient's answer..."
                  : "Message"
              }
              className="flex-1 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-900 placeholder-slate-400 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel Toggle */}


      {/* Right Panel - Visit Details */}
      <div
        className={`bg-white transition-all duration-300 ease-in-out flex-shrink-0 ${
          rightPanelOpen ? "w-96" : "w-0"
        } overflow-hidden border-l border-slate-200`}
      >
        <div className="p-6 pt-31 h-full overflow-y-auto">
          <div className="bg-blue-100 rounded-lg py-3 px-4 mb-6 flex items-center justify-center">
            <h2 className="text-base font-bold text-blue-600 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              All Visits
            </h2>
          </div>

          {patient?.total_visits?.length > 0 ? (
            patient.total_visits
              .sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date))
              .map((visit) => (
                <div
                  key={visit.visit_id}
                  className={`mb-4 p-4 border rounded-lg transition-all text-sm ${
                    visit.visit_id === currentVisit?.visit_id
                      ? "bg-blue-50 border-blue-300"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-semibold text-blue-600 text-sm">
                      {new Date(visit.visit_date).toLocaleDateString()}
                    </p>
                    {visit.visit_id === currentVisit?.visit_id && (
                      <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-0.5 rounded">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Reason:</p>
                      <p className="text-slate-900 text-sm">
                        {visit.reason_for_visit || "Not specified"}
                      </p>
                    </div>

                    {visit.chief_complaints && (
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">Chief Complaints:</p>
                        <p className="text-slate-900 text-sm">
                          {visit.chief_complaints}
                        </p>
                      </div>
                    )}

                    {visit.symptoms?.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">Symptoms:</p>
                        <p className="text-slate-900 text-sm">
                          {visit.symptoms.join(", ")}
                        </p>
                      </div>
                    )}

                    {visit.latest_vitals && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-md border border-slate-200">
                        <p className="text-xs text-slate-500 mb-2 font-medium">Vitals:</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-500">BP:</span>
                            <span className="ml-1 text-slate-900">{visit.latest_vitals.bloodPressure}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Pulse:</span>
                            <span className="ml-1 text-slate-900">{visit.latest_vitals.pulseRate}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Temp:</span>
                            <span className="ml-1 text-slate-900">{visit.latest_vitals.temperature}°F</span>
                          </div>
                          <div>
                            <span className="text-slate-500">SPO2:</span>
                            <span className="ml-1 text-slate-900">{visit.latest_vitals.spo2}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Weight:</span>
                            <span className="ml-1 text-slate-900">{visit.latest_vitals.weight} kg</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Height:</span>
                            <span className="ml-1 text-slate-900">{visit.latest_vitals.height} cm</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {visit.chronic_conditions_list?.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">Chronic Conditions:</p>
                        <p className="text-slate-900 text-sm">
                          {visit.chronic_conditions_list.join(", ")}
                        </p>
                      </div>
                    )}

                    {visit.doctor_notes && (
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">Doctor Notes:</p>
                        <p className="text-slate-900 text-sm">
                          {visit.doctor_notes}
                        </p>
                      </div>
                    )}

                    {visit.visit_summary && (
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">Summary:</p>
                        <p className="text-slate-900 text-sm">
                          {visit.visit_summary.replace(/\*\*/g, "")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center text-slate-500 mt-10 text-sm">
              No visits available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorVisit;
