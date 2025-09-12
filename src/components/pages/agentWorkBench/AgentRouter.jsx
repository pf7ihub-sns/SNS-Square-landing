import React from "react";
import { useParams } from "react-router-dom";
import MultiLanguageChat from "./agents/multiLanguageBot";
import IdeaRefinementUI from "./agents/ideaRefinement";
import AgentDisplay from "./AgentDisplay";
import AgentWorkingPage from "./agents/deepResearch";
import LogicValidationAgent from "./agents/logicValidation";

const AgentRouter = () => {
  const { agentId } = useParams();

  // Map known agent ids to components
  const agentIdToComponent = {
    "multilanguage-chatbot": <MultiLanguageChat />,
    "idea-refinement-agent": <IdeaRefinementUI />,
    // If there is a deep research agent id, map it here
    "deep-research-agent": <AgentWorkingPage />,
    "logic-validation-agent": <LogicValidationAgent />,
    "document-summarizer-agent": <AgentWorkingPage />,
    "general-query-agent": <AgentWorkingPage />,
    "data-management": <AgentWorkingPage />,
  };

  return agentIdToComponent[agentId] || <AgentDisplay />;
};

export default AgentRouter;


