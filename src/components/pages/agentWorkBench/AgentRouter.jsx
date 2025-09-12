import React from "react";
import { useParams } from "react-router-dom";
import MultiLanguageChat from "./agents/multiLanguageBot";
import IdeaRefinementUI from "./agents/ideaRefinement";
import AgentDisplay from "./AgentDisplay";
import AgentWorkingPage from "./agents/deepResearch";
import ImageGenerator from "./agents/imageGeneration";
import EntityExtractor from "./agents/entityExtractor";

const AgentRouter = () => {
  const { agentId } = useParams();

  // Map known agent ids to components
  const agentIdToComponent = {
    "multilanguage-chatbot": <MultiLanguageChat />,
    "idea-refinement-agent": <IdeaRefinementUI />,
    // If there is a deep research agent id, map it here
    "deep-research-agent": <AgentWorkingPage />,
    "logic-validation-agent": <AgentWorkingPage />,
    "document-summarizer-agent": <AgentWorkingPage />,
    "general-query-agent": <AgentWorkingPage />,
    "data-management": <AgentWorkingPage />,
    "image-generation-agent": <ImageGenerator />,
    "entity-extraction-agent": <EntityExtractor />,
    
  };

  return agentIdToComponent[agentId] || <AgentDisplay />;
};

export default AgentRouter;


