import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import AgentWorkingPage from "./agents/deepResearch";
import MultiLanguageChat from "./agents/multiLanguageBot";
import IdeaRefinementUI from "./agents/ideaRefinement";
import AgentDisplay from "./AgentDisplay";

import ImageGenerator from "./agents/imageGeneration";
import EntityExtractor from "./agents/entityExtractor";
import AutomatedLinter from "./agents/automatedLinter";
import TestCaseGenerationAgent from "./agents/testCaseGeneration";
import DataGenerationPage from "./agents/dataGenerator";
import DocumentSummarizerAgent from "./agents/documentSummarizer";
import HealthcareAppointmentClassifier from "./agents/healthcareAppointmentClassifier";
import CsvExcelConverter from "./agents/csvExcelConverter"; 
import TripPlanningSystem from "./agents/tripPlanningAgent";
import EmailThreadSummariser from "./agents/emailthreadsummarizer";
import InputSourceCard from "./agents/faqagent";
import StorylineGenerator from "./agents/storytelling";
import HeadlineGenerator from "./agents/headlinegenerator";
import AgriculturalQueryAgent from "./agents/agriculturalQuery";
import DuplicateExpenseDetector from "./agents/duplicateExpenceDetector";
import LogicValidationAgent from "./agents/logicValidation";


const AgentRouter = () => {
  const { agentId } = useParams();
  const [searchParams] = useSearchParams();

  // If there's a category query parameter but no agentId, show the AgentDisplay
  if (searchParams.get('category') && !agentId) {
    return <AgentDisplay />;
  }

  // Map known agent ids to components - ALL FOUNDATION AGENTS from agents.json
  const agentIdToComponent = {
    // Foundation Agents (from agents.json foundationAgents array)
    "deep-research-agent": <AgentWorkingPage />,
    "multilanguage-chatbot": <MultiLanguageChat />,
    "email-thread-summarizer-agent": <EmailThreadSummariser />,
    "logic-validation-agent": <LogicValidationAgent />,
    "idea-refinement-agent": <IdeaRefinementUI />,
    "image-generation-agent": <ImageGenerator />,
    "entity-extraction-agent": <EntityExtractor />,
    "automated-linter-agent": <AutomatedLinter />,
    "testcase-generation-agent": <TestCaseGenerationAgent />,
    "data-query-agent": <AgentWorkingPage />, // Using placeholder since dataQuery.jsx is empty
    "document-summarizer-agent": <DocumentSummarizerAgent />,
    "healthcare-appoinment-classifier": <HealthcareAppointmentClassifier />,
    "csv-to-excel-agent": <CsvExcelConverter />,
    "trip-planning-agent": <TripPlanningSystem />,
    "agriculture-query-agent": <AgriculturalQueryAgent />,
    "duplicate-expense-detection-agent":<DuplicateExpenseDetector />,
    // Additional agents (keeping existing ones)
    "data-generation-agent": <DataGenerationPage />,
    "developer-support": <InputSourceCard />,
    "social-media": <StorylineGenerator />,
    "work-management": <HeadlineGenerator />,
  };

  return agentIdToComponent[agentId] || <AgentDisplay />;
};

export default AgentRouter;