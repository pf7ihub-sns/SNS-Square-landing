// src/components/pages/agentWorkBench/agents/utils/resolveAgentComponent.js

import DocSentra from "../docSentra";
import AgentDisplay from "../AgentDisplay";

// All agent imports should be passed in as a map for flexibility
export function resolveAgentComponent(agentId, agentIdToComponent) {
  // Lookup case-insensitive
  const normalized = Object.keys(agentIdToComponent).reduce((acc, k) => {
    acc[k.toLowerCase()] = agentIdToComponent[k];
    return acc;
  }, {});

  const key = (agentId || "").toString();
  const decoded = decodeURIComponent(key);

  // Special handling for DocSentra with nested routes
  if (decoded.toLowerCase() === 'doc-sentra' || key.toLowerCase() === 'doc-sentra') {
    return <DocSentra />;
  }

  return normalized[decoded.toLowerCase()] || normalized[key.toLowerCase()] || <AgentDisplay />;
}
