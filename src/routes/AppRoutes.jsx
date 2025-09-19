import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import UseCase from "../pages/UseCase/UseCase";
import UseCaseDetail from "../pages/UseCase/useCaseDetail/UseCaseDetail";
import LifeAtSNSSquare from "../pages/lifeAtSnsSquare";
import HomePage from '../pages/Home';
import AboutUsPage from '../pages/aboutUs';
import Careers from '../pages/careers';
import ContactUs from '../pages/contactUs';
import AgentsDetails from "../pages/agentWorkbench/AgentsDetails";
import CategoriesAgents from "../pages/agentWorkbench/CategoriesAgents";
import Categories from "../pages/agentWorkbench/Categories";
import AgentWorkbenchIndex from "../pages/agentWorkbench/Index";
import AgentWorkbenchLayout from "../pages/agentWorkbench/AgentWorkbenchLayout";
import Sidebar from "../components/common/Sidebar";
import OrbitCircle from "../pages/agentWorkbench/orbitCircle";
import AgentPlayGround from "../components/pages/agentWorkBench/AgentPlayGround";
import AgentDisplay from "../components/pages/agentWorkBench/AgentDisplay";
import AgentRouter from "../components/pages/agentWorkBench/AgentRouter";
import MediaEntertainment from "../pages/mediaEntertainment";
import ProtectedRoute from "../components/common/ProtectedRoute";
import AgentTryPage from "../components/pages/agentWorkBench/AgentTryPage";
import AgentDetailsPage from "../components/pages/agentWorkBench/AgentDetailsPage";
export default function AppRoutes() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return (
    <Routes>
      <Route path="/" element={< HomePage />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/usecase" element={<UseCase />} />
      <Route path="/usecase/:category/:id" element={<UseCaseDetail />} />
      <Route path="/usecase/:id" element={<UseCaseDetail />} />
      <Route path="/life-at-sns" element={<LifeAtSNSSquare />} />
      
      {/* Protected Routes - Require Authentication */}
      <Route path="/media-entertainment" element={
        <ProtectedRoute>
          <MediaEntertainment />
        </ProtectedRoute>
      } />
      
      {/* Agent Workbench Protected Routes */}
      <Route path="/agent-workbench/try/:categoryId/:agentId" element={
        <ProtectedRoute>
          <AgentTryPage />
        </ProtectedRoute>
      } />
      
      <Route path="/agent-workbench/details/:categoryId/:agentId" element={
        <ProtectedRoute>
          <AgentDetailsPage />
        </ProtectedRoute>
      } />
      {/* Legacy Agent Workbench Routes - All Protected */}
      <Route path="/agent-workbench" element={
   
          <OrbitCircle />
  
      }>
        {/* Landing Page */}
        <Route index element={<AgentWorkbenchIndex />} />

        {/* Industry-specific agents - direct access without sidebar */}
        <Route path="industry-specific-agents/:categoryId/agents" element={<CategoriesAgents />} />
        {/* <Route path="industry-specific-agents/:categoryId/agents/:agentId" element={<AgentsDetails />} /> */}

        {/* Category selection pages */}
        <Route path=":category" >
          <Route index element={<AgentWorkbenchIndex />} />

          {/* Foundational agents - with sidebar for subcategories */}
          <Route path=":categoryId" element={<Sidebar />}>
            {/* Categories List */}
            <Route index element={<Categories />} />
            <Route path="agents" element={<CategoriesAgents />} />
            {/* Category Details */}
            <Route path=":subcategoryId/agents" element={<CategoriesAgents />} />
            {/* <Route path=":subcategoryId/agents/:agentId" element={<AgentsDetails />} /> */}
          </Route>

        </Route>

        {/* Agent Details */}
        {/* <Route path=":category/:categoryId/:subcategoryId/:agentId" element={<AgentsDetails />} /> */}
        {/* <Route path=":category/:categoryId/:agentId" element={<AgentsDetails />} /> */}
        
      </Route>
      
      {/* New Agent Playground Routes */}
      <Route path="/agent-playground" element={<AgentPlayGround />} />
      <Route path="/agent-playground/agent" element={<AgentDisplay />} />
      <Route path="/agent-playground/agent/:agentId" element={<AgentRouter />} />
      
      
      {/* Existing Agent Detail Routes */}
      
      {/* Legacy Agent Details Routes - Protected */}
      <Route path="/agent-workbench/:category/:categoryId/:subcategoryId/agents/:agentId" element={
        <ProtectedRoute>
          <AgentsDetails />
        </ProtectedRoute>
      } />
      <Route path="/agent-workbench/:category/:categoryId/agents/:agentId" element={
        <ProtectedRoute>
          <AgentsDetails />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
