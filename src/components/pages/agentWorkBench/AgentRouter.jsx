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
    "security-risk-analyzer": <SecurityRiskAnalyzer />
  };

  return agentIdToComponent[agentId] || <AgentDisplay />;
};

export default AgentRouter;


