import React from "react";
import { useParams, useLocation } from "react-router-dom";
import MultiLanguageChat from "./agents/multiLanguageBot";
import IdeaRefinementUI from "./agents/ideaRefinement";
import AgentDisplay from "./AgentDisplay";
import AgentWorkingPage from "./agents/deepResearch";
import LogicValidationAgent from "./agents/logicValidation";
import ImageGenerator from "./agents/imageGeneration";
import EntityExtractor from "./agents/entityExtractor";
import AutomatedLinter from "./agents/automatedLinter";
import TestCaseGenerationAgent from "./agents/testCaseGeneration";
import DocumentSummarizerAgent from "./agents/documentSummarizer";
import HealthcareAppointmentClassifier from "./agents/healthcareAppointmentClassifier";
import CsvExcelConverter from "./agents/csvExcelConverter"; 
import TripPlanningSystem from "./agents/tripPlanningAgent";
import DuplicateDetector from "./agents/duplicateDetector";
import EmailThreadSummariser from "./agents/emailthreadsummarizer";
import InputSourceCard from "./agents/faqagent";
import StorylineGenerator from "./agents/storytelling";
import HeadlineGenerator from "./agents/headlinegenerator";
import DataQuery from "./agents/dataQuery";
import ImgtoPdf from "./agents/imgtoPdf";
import Evaluation from "./agents/evaluation";
import DataCleaner from "./agents/dataCleaner";
import FeedbackAnalysis from "./agents/feedbackAnalysis";
import RealEstateClassfier from "./agents/realEstateServiceClassifier";
import RealEstateInquiryAgent from "./agents/realEstateInquiryAgent";
import RealEstateNewsBrief from "./agents/realEstateNewsBrief";
import RetailComplaint from "./agents/retailComplaint";
import RetailEntityExtractor from "./agents/retailEntityExtractor";
import DocumentParser from "./agents/documentParser";
import SecurityRiskAnalyzer from "./agents/securityRisk";
import PromptOptimizer from "./agents/promptOptimizer";
import ContentValidation from "./agents/ContentValidation";
import GeneralChat from "./agents/generalChat";
import LogicValidation from "./agents/logicValidation";
import DataGeneration from "./agents/dataGeneration";
import DataProfiling from "./agents/dataProfiling";
import SchemaGenerator from "./agents/schemaGenerator";
import OCR from "./agents/ocr";
import DateFormat from "./agents/dataFormat";
import PdfChat from "./agents/pdfChat";
import TechDoc from "./agents/techDoc";
import EmailDraft from"./agents/emailDraft";
import SocialMediaContent from "./agents/socialMediaContent";
import TaskBreakDown from "./agents/taskBreakDown";
import InvoiceAgent from "./agents/invoiceAgent";
import QuizGenerator from "./agents/quizGenerator";
import ReportGenerator from "./agents/reportGenerator";
import MomGenerator from"./agents/momGenerator";
import ResumeAnalyzer from "./agents/resumeAnalyzer";
import AesAgent from "./agents/aesAgent";
import EmergingTrends from "./agents/emergingTrend";
import OutLineGenerator from "./agents/outlineGenerator";
import GeneralUtility from "./agents/generalUtility";
import PolicySuggestion from "./agents/policySuggestion";
import LanguageGrammer from"./agents/languageGrammar";
import ProductClassifier from "./agents/productClassifier";
import VoiceToTxt from "./agents/voicetoTxt";
import TexttoVoice from "./agents/texttoVoice";
import AppointmentManagement from "./agents/appointmentManagement"
import InvoiceProcessing from "./agents/invoiceProcessing";
import ContractManagement from "./agents/contractManagement";
import EmailTriage from "./agents/emailTriage";
import LeadGeneration from "./agents/leadGeneration"; // New import
import LabResultsExtractor from "./agents/labResultsExtractor"; // New import
import RenewalAgent from "./agents/renewalAgent";
import ContractManagementSystem from "./agents/contractManagementSystem";
import KnowledgeBaseChat from "./agents/KnowledgeBaseChat.jsx";
import ChatPage from "./agents/AI_Docs/chatPage.jsx";
import AIChat from "./agents/aiChat";
import AIDocument from "./agents/aiDocument.jsx";
import EmailSupport from "./agents/CustomerSupportEmailAgent";
import LeadQualification from "./agents/leadQualification";
import LeadManagement from "./agents/leadManagement";


import SpeechtoTextMom from "./agents/speechtoTextMom.jsx";
import LiveSpeechtoTextAgent from "./agents/liveSpeechtoText.jsx";import DocSentra from "./agents/docSentra";
import AiSheets from "./agents/aiSheets";


const AgentRouter = () => {
  const { agentId } = useParams();
  const location = useLocation();

  // Map known agent ids to components
  const agentIdToComponent = {
    "multilanguage-chatbot": <MultiLanguageChat />,
    "idea-refinement-agent": <IdeaRefinementUI />,
    "deep-research-agent": <AgentWorkingPage />,
    "logic-validation-agent": <LogicValidationAgent />,
    "email-summarizer-agent": <EmailThreadSummariser />,
    "image-generation-agent": <ImageGenerator />,
    "entity-recognition": <EntityExtractor />,
    "automated-linter-agent": <AutomatedLinter />,
    "testcase-generation-agent": <TestCaseGenerationAgent/>,
    "healthcare-appoinment-classifier": <HealthcareAppointmentClassifier />,
    "document-summarizer-agent": <DocumentSummarizerAgent/>,
    "trip-planning-agent": <TripPlanningSystem />,
    "csv-to-excel-agent": <CsvExcelConverter />,
    "data-query-agent": <DataQuery/>,
    "faq-bot": <InputSourceCard />,
    "social-media": <StorylineGenerator />,
    "work-management": <HeadlineGenerator />,
    "duplicate-expense-detector": <DuplicateDetector />,
    "image-to-pdf": <ImgtoPdf />,
    "evaluation-agent": <Evaluation />,
    "data-cleaner-agent": <DataCleaner />,
    "feedback-analysis-agent": <FeedbackAnalysis />,
    "real-estate-service-classifier": <RealEstateClassfier />,
    "real-estate-inquiry-agent": <RealEstateInquiryAgent />,
    "real-estate-news-brief": <RealEstateNewsBrief />,
    "retail-complaint-agent": <RetailComplaint />,
    "retail-entity-extractor": <RetailEntityExtractor />,
    "document-parser-agent": <DocumentParser />,
    "security-risk-analyzer": <SecurityRiskAnalyzer />,
    "prompt-optimizer": <PromptOptimizer />,
    "content-validation-agent": <ContentValidation />,
    "general-chat": <GeneralChat />,
    "ai-chat": <AIChat />,
    "Doc-Sentra": <DocSentra />,

    "data-generation-agent": <DataGeneration />,
    "data-profiling-agent": <DataProfiling />,
    "schema-generator-agent": <SchemaGenerator />,
    "ocr-agent":<OCR/>,
    "date-format-agent":<DateFormat/>,
    "pdf-chat-agent":<PdfChat/>,
    "tech-documentation-agent":<TechDoc/>,
    "email-draft-agent":<EmailDraft/>,
    "social-media-content-agent":<SocialMediaContent/>,
    "task-breakdown-agent":<TaskBreakDown/>,
    "invoice-agent":<InvoiceAgent/>,
    "quiz-generator-agent":<QuizGenerator/>,
    "report-generator-agent":<ReportGenerator/>,
    "mom-generator-agent":<MomGenerator/>,
    "resume-analyzer-agent":<ResumeAnalyzer/>,
    "aes-agent":<AesAgent/>,
    "emerging-trends-agent":<EmergingTrends/>,
    "outline-generator-agent":<OutLineGenerator/>,
    "general-utility-agent":<GeneralUtility/>,
    "policy-suggest-agent":<PolicySuggestion/>,
    "language-agent":<LanguageGrammer/>,
    "product-classifier":<ProductClassifier/>,
    "voice-Txt-agent":<VoiceToTxt/>,
    "text-voice-agent":<TexttoVoice/>,
    "Appointment-management":<AppointmentManagement/>,
    "invoice-processing": <InvoiceProcessing />,
    "contract-management": <ContractManagement />,
    "email-triage": <EmailTriage />,
    "Lead-Genearation": <LeadGeneration />,
    "Lab-results-extractor": <LabResultsExtractor /> ,
    "email-support":<EmailSupport/>,
    "lead-qualification":<LeadQualification/>,
    "knowledge-base-agent": <KnowledgeBaseChat /> ,
    "ai-docs":<ChatPage/> ,
    "ai-document":<AIDocument/> ,
    "speech-to-text-mom":<SpeechtoTextMom/>,
    "live-speech-to-text-mom":<LiveSpeechtoTextAgent/>,
    "ai-sheets" : <AiSheets/>,
    "contract-management-system": <ContractManagementSystem />,
    "lead-management": <LeadManagement />,
  };

  // Lookup case-insensitive
  const normalized = Object.keys(agentIdToComponent).reduce((acc, k) => {
    acc[k.toLowerCase()] = agentIdToComponent[k];
    return acc;
  }, {});

  const key = (agentId || "").toString();
  const decoded = decodeURIComponent(key);

  // Special handling for DocSentra with nested routes
  if (decoded.toLowerCase() === 'doc-sentra' || key.toLowerCase() === 'doc-sentra') {
    return (
      <div className="agent-wrapper">
        <DocSentra />
      </div>
    );
  }

  const component = normalized[decoded.toLowerCase()] || normalized[key.toLowerCase()] || <AgentDisplay />;
  
  // Wrap all agents with reduced font size
  return (
    <div className="agent-wrapper">
      {component}
    </div>
  );
};

export default AgentRouter;

