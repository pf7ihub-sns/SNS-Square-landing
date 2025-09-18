import React from "react";
import { useParams } from "react-router-dom";
import MultiLanguageChat from "./agents/multiLanguageBot";
import IdeaRefinementUI from "./agents/ideaRefinement";
import AgentDisplay from "./AgentDisplay";
import AgentWorkingPage from "./agents/deepResearch";
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

const AgentRouter = () => {
  const { agentId } = useParams();

  // Map known agent ids to components
  const agentIdToComponent = {
    "multilanguage-chatbot": <MultiLanguageChat />,
    "idea-refinement-agent": <IdeaRefinementUI />,
    "deep-research-agent": <AgentWorkingPage />,
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
    "logic-validation-agent": <LogicValidation />,
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
    "text-voice-agent":<TexttoVoice/>
  };

  return agentIdToComponent[agentId] || <AgentDisplay />;
};

export default AgentRouter;


