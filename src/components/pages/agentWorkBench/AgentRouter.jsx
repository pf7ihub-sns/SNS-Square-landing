import React from "react";
import { useParams } from "react-router-dom";
import MultiLanguageChat from "./agents/multiLanguageBot";
import IdeaRefinementUI from "./agents/ideaRefinement";
import AgentDisplay from "./AgentDisplay";
import AgentWorkingPage from "./agents/deepResearch";
import EmailThreadSummariser from "./agents/emailthreadsummarizer";
import InputSourceCard from "./agents/faqagent";
import StorylineGenerator from "./agents/storytelling";
const AgentRouter = () => {
  const { agentId } = useParams();

  // Map known agent ids to components
  const agentIdToComponent = {
    "multilanguage-chatbot": <MultiLanguageChat />,
    "idea-refinement-agent": <IdeaRefinementUI />,
    // If there is a deep research agent id, map it here
    "deep-research-agent": <AgentWorkingPage />,
    "logic-validation-agent": <AgentWorkingPage />,
    "document-summarizer-agent": <EmailThreadSummariser />,
    "general-query-agent": <AgentWorkingPage />,
    "data-management": <AgentWorkingPage />,
    "developer-support": <InputSourceCard />,
    "social-media": <StorylineGenerator />,
  };

  return agentIdToComponent[agentId] || <AgentDisplay />;
};

export default AgentRouter;


