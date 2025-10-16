import { desc } from "framer-motion/client";

export default {
  foundational: [
    {
      id: "doc-knowledge",
      name: "Document & Knowledge Management",
      description: "Manage documents and knowledge with processing, retrieval, and maintenance.",
      image: "images/document_know.jpg",
      subCategories: [
        {
          id: "document-processing",
          name: "Document Processing",
          description: "Classify, OCR, parse, and extract entities from documents.",
          image: "/undraw_add-document_oqbr.png",
          agents: [
            // {
            //   id: "deep-research-agent",
            //   name: "Deep Research Agent",
            //   summary: "Classify and route documents to specialized processing pipelines.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Multi-label classification",
            //     "Confidence thresholds & fallback",
            //   ],
            //   useCases: [
            //     "Legal vs. financial vs. medical sorting",
            //     "Mailbox triage",
            //     "Back-office intake automation",
            //   ],
            //   description: ["DeepResearchAgent helps users perform detailed research on a topic by generating structured reports with clear content, sources, and references, allowing quick insights, in-depth analysis, or comprehensive investigation."],
            //   heading: "Deep Research Agent for Comprehensive Insights",
            //   status: "available"
            // },
            // {
            //   id: "document-parser-agent",
            //   name: "Document Parser Agent",
            //   summary: "Extract structured information from documents.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Layout analysis", "Table extraction", "Schema validation"],
            //   useCases: ["Invoices", "Contracts", "Receipts"],
            //   description: ["DocumentParser allows users to upload PDF or Excel files and extract structured information such as document ID, title, author, keywords, and summary. It displays a summarized view with the option to expand for full details, handles errors, and provides a loading indicator during processing. Supported formats include PDF, XLS, and XLSX."],
            //   heading: "Document Parser Agent Transform unstructured files into Structured insights",
            //   status: "available"
            // },
            // {
            //   id: "ocr-agent",
            //   name: "OCR (Optical Character Recognition) Agent",
            //   summary: "High fidelity OCR with layout awareness and language support.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Printed & handwritten OCR", "Layout blocks", "Language detection"],
            //   useCases: ["Scan ingestion", "Forms digitization", "Archival search"],
            //   description: ["This project is an OCR tool that allows users to upload image files (PNG/JPG) and extract text instantly. It displays the extracted content along with a concise summary and keywords. The interface is clean, easy to use, and provides smooth feedback during processing."],
            //   status: "available"
            // },
            // {
            //   id: "date-format-agent",
            //   name: "Date Format Agent",
            //   summary: "Normalize and convert date formats across documents.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Date parsing", "Format conversion", "Validation"],
            //   useCases: ["Legal documents", "Financial reports", "Event logs"],
            //   description: ["Date Format Converter is a tool that processes CSV files containing date fields and converts them into a user-selected format. It provides clear file details, shows original vs. converted dates, highlights invalid entries, and allows downloading the corrected CSV for easy use."],
            //   status: "available"
            // },
            // {
            //   id: "pdf-chat-agent",
            //   name: "PDF Chat Agent",
            //   summary: "Engage in conversations about PDF documents.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Document Q&A", "Summarization", "Content extraction"],
            //   useCases: ["Legal briefs", "Research papers", "User manuals"],
            //   description: ["PDF Chat allows users to upload a PDF, process its content, and interact with it by asking questions. It extracts file details, supports natural language queries, and provides clear answers based on the document, making PDF exploration faster and more interactive."],
            //   status: "available"
            // },
            // {
            //   id: "tech-documentation-agent",
            //   name: "Tech Documentation Agent",
            //   summary: "Assist in creating and managing technical documentation.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Document generation", "Version control", "Collaboration tools"],
            //   useCases: ["API documentation", "User manuals", "Knowledge bases"],
            //   description: ["Technical Document Summarizer enables users to upload PDF or DOCX files and automatically generates a structured summary. It highlights the executive summary, key points, and a findings table, making complex technical content easier to understand and review quickly."],
            //   status: "available"
            // },
            // {
            //   id: "entity-recognition",
            //   name: "Entity Extraction Tool",
            //   summary: "Detect and normalize entities like people, orgs, and amounts.",
            //   image: "/placeholder.jpg",
            //   solutions: ["NER + normalization", "Deduplication", "Linking to KB"],
            //   useCases: ["KYC", "Document analytics", "Content tagging"],
            //   description: ["Entity Extraction Tool processes text or uploaded documents to automatically identify and extract key entities such as people, dates, organizations, locations, and money values. It provides summaries, confidence scores, filtering options, and supports exporting results to CSV, Excel, or JSON for easy analysis and integration."],
            //   status: "available"
            // },
            {
              id:"ai-document",
              name:"AI Document Agent", 
              summary:"Interact with and extract information from documents using AI.",
              image:"/images/agents/document 1.png",
              solutions:["Document Q&A", "Information extraction", "Content summarization"],
              useCases:["Legal documents", "Research papers", "Business reports"],
              description:["AI Document Agent allows users to upload various document types (PDF, DOCX, TXT) and interact with them using natural language queries. It extracts key information, generates summaries, and provides insights based on the document content. The agent supports multiple formats and ensures accurate processing for effective document management."],
              status:"available"
            }
          ]
        },
        {
          id: "contract-review",
          name: "Contract/Document Review",
          description: "Automated review of legal and business documents for risks, clauses, and obligations.",
          image: "images/summarization.jpg",
          agents: [

          ]
        },
        {
          id: "policy-validation",
          name: "Policy Checking & Validation",
          description: "Validate compliance with internal or external policies.",
          image: "/placeholder.jpg",
          agents: [

          ]
        },
        {
          id: "knowledge-retrieval",
          name: "Knowledge Retrieval & Search",
          description: "Efficient retrieval of knowledge from structured and unstructured sources.",
          image: "/placeholder.jpg",
          agents: [
          ]
        },
        {
          id: "knowledge-maintenance",
          name: "Knowledge Base Maintenance",
          description: "Keep organizational knowledge bases clean, updated, and structured.",
          image: "/placeholder.jpg",
          agents: [

          ]
        },
        {
          id: "note-summarization",
          name: "Note-Taking & Summarization",
          description: "Generate summaries, notes, and highlights from long content.",
          image: "/placeholder.jpg",
          agents: [

          ]
        },
        {
          id: "knowledge-graph",
          name: "Knowledge Graph / Entity Linking",
          description: "Build and maintain knowledge graphs with linked entities and relationships.",
          image: "/placeholder.jpg",
          agents: [

          ],
        },
      ],
    },

    {
      id: "summarization",
      name: "Summarization & Content Handling",
      description: "Turn long content into concise, actionable briefs.",
      image: "images/summarization.jpg",
      subCategories: [
        {
          id: "content-summarization",
          name: "Content Summarization",
          description: "Extract key insights and create concise summaries from various content types.",
          image: "/placeholder.jpg",
          agents: [

            // {
            //   id: "resume-analyzer-agent",
            //   name: "Resume Analyzer Agent",
            //   summary: "Analyze and extract key information from resumes.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Resume parsing", "Skill extraction", "Experience matching"],
            //   useCases: ["Recruitment", "Talent acquisition", "HR analytics"],
            //   description: ["Resume Analyzer processes PDF resumes and evaluates them against general quality standards or a specific job role. It extracts key sections (skills, education, experience, certifications, achievements), assigns clarity and relevance scores, and provides targeted feedback along with job match insights to help candidates improve their resumes."],
            //   status: "available"
            // },
            // {
            //   id: "document-summarizer-agent",
            //   name: "Document Summarizer Agent",
            //   summary: "Summarize long documents while preserving key information.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Extractive summarization", "Abstractive summarization", "Keyphrase extraction"],
            //   useCases: ["Meeting notes", "Research papers", "Legal briefs"],
            //   description: ["Document Summarizer Agent allows users to upload PDF, DOCX, or TXT files and generate AI-powered summaries in different formats such as executive overviews, abstracts, or key takeaways. It makes large documents easier to review by providing concise, structured insights with word counts and processing details."],
            //   status: "available"
            // },
          ]
        },
        {
          id: "meeting-minutes-generator",
          name: "Meeting Minutes Generator",
          description: "Automatically generate structured meeting notes and action items.",
          image: "/placeholder.jpg",
          agents: [

          ]
        },
        {
          id: "feedback-categorization",
          name: "Feedback Categorization",
          description: "Organize and analyze feedback from various sources for actionable insights.",
          image: "/placeholder.jpg",
          agents: [
          ]
        },
        {
          id: "content-generation-text",
          name: "Content Generation (Text)",
          description: "Generate high-quality text content for various purposes and audiences.",
          image: "/placeholder.jpg",
          agents: [

          ]
        },
        {
          id: "creative-writing-ideation",
          name: "Creative Writing & Ideation",
          description: "Generate creative content and develop innovative ideas.",
          image: "/placeholder.jpg",
          agents: [
          ]
        },
        {
          id: "brainstorming-assistant",
          name: "Brainstorming Assistant",
          description: "Facilitate creative thinking and collaborative idea generation.",
          image: "/placeholder.jpg",
          agents: [
          ]
        }
      ]
    },
    {
      id: "communication-assistance",
      name: "Communication & Assistance",
      description: "Conversational assistance and automation.",
      image: "images/communication.jpg",
      subCategories: [
        {
          id: "live-chat-assistance",
          name: "Live Chat Assistance",
          description: "Real-time conversational support and customer service automation.",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "multilanguage-chatbot",
            //   name: "Multilanguage Chat Support Agent",
            //   summary: "Provide instant customer support with context-aware responses.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Real-time messaging", "Context preservation", "Escalation routing"],
            //   useCases: ["E-commerce support", "Technical assistance", "Product inquiries"],
            //   description: ["Multi-Language AI Chat Assistant enables real-time, multilingual conversations with an AI assistant. Users can send messages in any supported language, receive instant AI responses, and customize their name and preferred language. The chat supports quick replies, conversation history, and export functionality for seamless communication."],
            //   status: "available"
            // },
            // {
            //   id: "logic-validation-agent",
            //   name: "Logic Validation Agent",
            //   summary: "Validate the logical consistency of user inputs.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Logic analysis", "Error detection", "Contextual validation"],
            //   useCases: ["Content moderation", "Interactive storytelling", "User input validation"],
            //   description: ["Logic Validation Tool allows users to check the logical consistency of any text through AI-powered analysis. It supports multiple analysis types, highlights detected issues, provides confidence scores, and offers actionable recommendations. The interface is interactive, user-friendly, and designed for quick validation and review of text content."],
            //   status: "available"
            // },
            // {
            //   id: "general-chat",
            //   name: "General Chat Support Agent",
            //   summary: "Provide instant customer support with context-aware responses.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Real-time messaging", "Context preservation", "Escalation routing"],
            //   useCases: ["E-commerce support", "Technical assistance", "Product inquiries"],
            //   description: ["General Chat Application lets users interact with an AI virtual assistant in real-time. It maintains a persistent chat history, visually differentiates user and AI messages, and provides a smooth, scrollable chat interface. Users can send messages, view AI responses instantly, and clear the conversation when needed."],
            //   status: "available"
            // },
            {
              id: "ai-chat",
              name: "AI Chat Support Agent",
              summary: "Provide instant customer support with context-aware responses.",
              image: "/placeholder.jpg",
              solutions: ["Real-time messaging", "Context preservation", "Escalation routing"],
              useCases: ["E-commerce support", "Technical assistance", "Product inquiries"],
              description: ["General Chat Application lets users interact with an AI virtual assistant in real-time. It maintains a persistent chat history, visually differentiates user and AI messages, and provides a smooth, scrollable chat interface. Users can send messages, view AI responses instantly, and clear the conversation when needed."],
              status: "available"
            },
            // {
            //   id: "content-validation-agent",
            //   name: "Content Validation Agent",
            //   summary: "Ensure content meets quality and compliance standards.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Content analysis", "Quality assurance", "Compliance checking"],
            //   useCases: ["Content moderation", "Publishing workflows", "Regulatory compliance"],
            //   description: ["Content Validation Tool helps users check their text or uploaded documents for completeness, formatting, accuracy, metadata, and readability. It supports TXT, DOCX, and RTF files while providing a clear compliance score and detailed issue analysis. Users also receive suggested fixes to improve the quality and consistency of their content."],
            //   status: "available"
            // },
            // {
            //   id: "language-agent",
            //   name: "Language Grammer support Agent",
            //   summary: "Provide instant customer support with context-aware responses.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Real-time messaging", "Context preservation", "Escalation routing"],
            //   useCases: ["E-commerce support", "Technical assistance", "Product inquiries"],
            //   description: ["Language & Grammar Analyzer allows users to correct grammar, explain text, or adjust tone for English content. It supports multiple modes correction, explanation, and tone adjustment with real-time analysis and feedback. The tool provides clear, actionable results to improve writing clarity, style, and readability."],
            //   status: "available"
            // },
            // {
            //   id: "prompt-optimizer",
            //   name: "Prompt Optimizer Agent",
            //   summary: "Enhance user prompts for better AI responses.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Prompt refinement", "Contextual suggestions", "User intent analysis"],
            //   useCases: ["Content creation", "Customer support", "Interactive storytelling"],
            //   description: ["Prompt Optimizer helps users refine and enhance their text prompts for clarity, effectiveness, and engagement. It generates multiple optimized versions along with actionable suggestions for improvement. The tool ensures better AI interaction and improved output quality from generated prompts."],
            //   status: "available"
            // },
            // {
            //   id: "trip-planning-agent",
            //   name: "Trip Planning Agent",
            //   summary: "Assist users in planning their trips with personalized recommendations.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Real-time messaging", "Context preservation", "Escalation routing"],
            //   useCases: ["E-commerce support", "Technical assistance", "Product inquiries"],
            //   description: ["Trip Planning Assistant helps users plan and optimize their trips effortlessly. It generates personalized itineraries and travel recommendations based on user preferences, budget, and travel style. The tool ensures a seamless planning experience, helping travelers discover the best destinations, accommodations, and activities tailored to their needs."],
            //   status: "available"
            // },
            // {
            //   id: "voice-Txt-agent",
            //   name: "Voice to Text Agent",
            //   summary: "Voice to Text Conversation Agent.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Real-time messaging", "Context preservation", "Escalation routing"],
            //   useCases: ["E-commerce support", "Technical assistance", "Product inquiries"],
            //   description: ["Voice-to-Text Assistant helps users convert audio recordings into accurate, readable text effortlessly. It supports multiple audio formats and delivers fast, reliable transcriptions. The tool ensures a seamless experience, helping users capture spoken content, notes, or conversations efficiently and accurately."],
            //   status: "available"
            // },
            // {
            //   id: "text-voice-agent",
            //   name: "Text to Voice Agent",
            //   summary: "Text to Voice Conversation Agent.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Real-time messaging", "Context preservation", "Escalation routing"],
            //   useCases: ["E-commerce support", "Technical assistance", "Product inquiries"],
            //   description: ["Text-to-Voice Assistant helps users effortlessly convert written text into natural, clear speech. It generates audio in real-time, allowing users to listen, play, or download the generated voice. The tool ensures a seamless experience, making text content accessible, engaging, and easy to consume."],
            //   status: "available"
            // },
          ]
        },
        {
          id: "customer-support-faq",
          name: "Customer Support (FAQ Bots)",
          description: "Automated FAQ handling and knowledge-based customer support.",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "faq-bot",
            //   name: "FAQ Generator Agent",
            //   summary: "Generates instant, relevant answers to user questions by creating FAQ content from your knowledge base.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Knowledge base integration", "Semantic matching", "Confidence scoring"],
            //   useCases: ["Product support", "Policy questions", "Service information"],
            //   description: ["FAQ Generator Assistant helps users create accurate and organized FAQs from text or uploaded documents. It processes content intelligently, clusters related information, and generates questions and answers with confidence scores. The tool ensures efficient knowledge extraction, making content easier to understand, share, and reference."],
            //   status: "available"
            // },
          ]
        },
        {
          id: "conversation-routing",
          name: "Conversation Routing",
          description: "Intelligent routing of conversations to appropriate agents or systems.",
          image: "/placeholder.jpg",
          agents: [

          ]
        },
        {
          id: "email-management",
          name: "Email Management",
          description: "Automated email processing, categorization, and response generation.",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "email-summarizer-agent",
            //   name: "Email Thread Summariser",
            //   summary: "Categorize and prioritize incoming emails automatically.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Email categorization", "Priority scoring", "Spam detection"],
            //   useCases: ["Customer service", "Sales inquiries", "Support tickets"],
            //   description: ["Email Thread Summariser helps users quickly understand lengthy email conversations by generating concise summaries. It extracts key points, participants, timelines, and action items, providing an organized overview of any email thread. The tool ensures efficient email management and saves time, making communication clearer and more actionable."],
            //   status: "available"

            // },
          ]
        },
        {
          id: "notification-alerting",
          name: "Notification & Alerting",
          description: "Intelligent notification systems with personalized delivery.",
          image: "/placeholder.jpg",
          agents: [
          ]
        },
        {
          id: "voice-text-transcription",
          name: "Voice-to-Text Transcription",
          description: "Convert speech to text with high accuracy and context awareness.",
          image: "/placeholder.jpg",
          agents: [

          ]
        },
        {
          id: "text-speech-conversion",
          name: "Text-to-Speech Conversion",
          description: "Convert text to natural-sounding speech with emotion and context.",
          image: "/placeholder.jpg",
          agents: [
          ]
        },
        {
          id: "translation-localization",
          name: "Translation & Localization",
          description: "Translate content and adapt it for different cultures and regions.",
          image: "/placeholder.jpg",
          agents: [

          ]
        }
      ]
    },
    {
      id: "business-intelligence",
      name: "Business Intelligence & Analysis",
      description: "Insights, analytics, and forecasting.",
      image: "images/business_intel.jpg",
      subCategories: [
        {
          id: "market-trends-analysis",
          name: "Market Trends Analysis",
          description: "Analyze market dynamics, trends, and competitive landscape for strategic insights.",
          image: "images/business_intel.jpg",
          agents: [
            // {
            //   id: "emerging-trends-agent",
            //   name: "Market Trend Analyzer Agent",
            //   summary: "Identify and analyze emerging market trends and patterns.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Pattern recognition", "Time series analysis", "Trend forecasting"],
            //   useCases: ["Product strategy", "Market entry decisions", "Investment planning"],
            //   description: ["Emerging Tech Trends analyzes the latest technologies and sectors, providing insights and trend scores. Users can enter a technology or domain to get a summary, key insights, and actionable feedback. The tool helps stay ahead by identifying emerging trends for strategic decisions in 2025."],
            //   status: "available"
            // },
            // {
            //   id: "invoice-agent",
            //   name: "Invoice Agent",
            //   summary: "Automate the extraction and management of invoices.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Invoice generation", "Payment tracking", "Expense management"],
            //   useCases: ["Billing", "Financial reporting", "Tax compliance"],
            //   description: ["Invoice Agent extracts and analyzes key fields from invoices, whether entered as text or uploaded as PDFs. It provides structured details including vendor, dates, totals, line items, taxes, and a summary. This tool helps automate invoice processing and gives a clear overview of financial data."],
            //   status: "available"
            // },
            // {
            //   id: "feedback-analysis-agent",
            //   name: "Feedback Analysis Agent",
            //   summary: "Analyze and generate insights from customer feedback.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Sentiment analysis", "Topic modeling", "Feedback categorization"],
            //   useCases: ["Product improvement", "Customer satisfaction", "Market research"],
            //   description: ["Feedback Analysis allows users to upload survey files or input text feedback and generate structured insights. It categorizes responses, summarizes trends, and highlights actionable items. Users can download the processed feedback as a CSV for reporting or further analysis."],
            //   status: "available"
            // },
            // {
            //   id: "idea-refinement-agent",
            //   name: "Idea Refinement Agent",
            //   summary: "Refine and enhance business ideas through iterative feedback.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Pattern recognition", "Time series analysis", "Trend forecasting"],
            //   useCases: ["Product strategy", "Market entry decisions", "Investment planning"],
            //   description: ["Idea Refinement Agent helps users transform raw, unstructured ideas into polished and actionable concepts. Users can input their idea, and the system provides a refined version with clean formatting and structured paragraphs. This UI offers a clear input-output workflow with visual feedback, making idea enhancement simple and intuitive."],
            //   status: "available"
            // },

            // {
            //   id: "outline-generator-agent",
            //   name: "Outline Generator Agent",
            //   summary: "Generate structured outlines for various content types.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Content structuring", "Hierarchical organization", "Thematic categorization"],
            //   useCases: ["Content creation", "Educational material development", "Research paper organization"],
            //   description: ["Outline Generator helps users create structured outlines from a given topic and optional context. Users can select the desired detail level, and the system produces a clear, hierarchical outline with headings, subpoints, and feedback. The interface provides real-time feedback, loading states, and error handling for smooth interaction."],
            //   status: "available"
            // },

          ]
        },
        {
          id: "financial-analysis",
          name: "Financial Analysis",
          description: "Comprehensive financial data analysis and performance evaluation.",
          image: "/placeholder.jpg",
          agents: [
          ]
        },
        {
          id: "risk-assessment",
          name: "Risk Assessment",
          description: "Identify, evaluate, and mitigate business and operational risks.",
          image: "/placeholder.jpg",
          agents: [

          ]
        },
        {
          id: "budget-forecasting",
          name: "Budget Forecasting",
          description: "Predict future financial performance and create accurate budget projections.",
          image: "/placeholder.jpg",
          agents: [
          ]
        },
        {
          id: "expense-tracking",
          name: "Expense Tracking",
          description: "Monitor, categorize, and analyze business expenses for optimization.",
          image: "/placeholder.jpg",
          agents: [
          ]
        },
        {
          id: "competitive-intelligence",
          name: "Competitive Intelligence",
          description: "Monitor competitors and market dynamics for strategic advantage.",
          image: "/placeholder.jpg",
          agents: [

          ]
        },
        {
          id: "anomaly-detection",
          name: "Anomaly Detection",
          description: "Identify unusual patterns and anomalies in business data and processes.",
          image: "/placeholder.jpg",
          agents: [
          ]
        },
        {
          id: "sentiment-analysis",
          name: "Sentiment Analysis",
          description: "Analyze customer sentiment and market perception for business insights.",
          image: "/placeholder.jpg",
          agents: [
          ]
        }
      ]
    },
    {
      id: "compliance-security",
      name: "Compliance & Security",
      description: "Ensure regulatory adherence, risk management, and system protection.",
      image: "images/compilance.jpg",
      subCategories: [
        {
          id: "compliance-monitoring",
          name: "Compliance Monitoring",
          description: "Monitor and ensure adherence to regulatory requirements and industry standards.",
          image: "/placeholder.jpg",
          agents: [

            // {
            //   id: "aes-agent",
            //   name: "AES Agent",
            //   summary: "Monitor compliance with regulatory requirements and standards.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Regulation tracking", "Compliance assessment", "Audit preparation"],
            //   useCases: ["Financial compliance", "Healthcare regulations", "Data protection laws"],
            //   description: ["AES Agent allows users to securely encrypt and decrypt text using AES encryption. Users can switch between encryption and decryption modes, providing necessary input, keys, and IVs as required. The UI displays real-time results with error handling, loading states, and a clean structured output for easy readability."],
            //   status: "available"
            // },
            // {
            //   id: "policy-suggest-agent",
            //   name: "Policy Suggestion Agent",
            //   summary: "Enforce organizational policies and procedures automatically.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Policy validation", "Violation detection", "Corrective actions"],
            //   useCases: ["HR policies", "IT security policies", "Business procedures"],
            //   description: ["Policy Suggestion provides users with expert guidance on government policies and regulations. Users can submit a query with optional context, and the system fetches structured advice along with credible sources. The UI handles loading states, errors, and displays results in a clean, readable format."],
            //   status: "available"
            // },
            // {
            //   id: "security-risk-analyzer",
            //   name: "Security Risk Analyzer Agent",
            //   summary: "Analyze and mitigate security risks across the organization.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Risk assessment", "Threat modeling", "Vulnerability management"],
            //   useCases: ["Security audits", "Compliance checks", "Incident response"],
            //   description: ["Security Risk Analyzer allows users to upload documents (PDF, DOCX, TXT) for automated security risk assessment. It evaluates content using local checks and AI scoring, highlighting potential risks and providing document excerpts. The interface handles file upload, loading states, errors, and displays results in a structured, readable format."],
            //   status: "available"
            // },
          ]
        },
        {
          id: "cybersecurity-monitoring",
          name: "Cybersecurity Monitoring",
          description: "Monitor and protect against cybersecurity threats and vulnerabilities.",
          image: "/placeholder.jpg",
          agents: [
          ]
        },
        {
          id: "data-privacy-pii",
          name: "Data Privacy (PII Redaction)",
          description: "Protect personal and sensitive information through automated redaction and privacy controls.",
          image: "/placeholder.jpg",
          agents: [
          ]
        },
        {
          id: "policy-checking-validation",
          name: "Policy Checking & Validation",
          description: "Validate content and processes against established policies and standards.",
          image: "/placeholder.jpg",
          agents: [

          ]
        }
      ]
    },
    {
      id: "data-management",
      name: "Data Management",
      description: "Organize, store, retrieve, and optimize data for efficiency and insights.",
      image: "images/data_work.jpg",
      subCategories: [
        {
          id: "data-cleaning-preprocessing",
          name: "Data Cleaning & Preprocessing",
          description: "Clean, validate, and prepare data for analysis and processing.",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "data-cleaner-agent",
            //   name: "Data Cleaner Agent",
            //   summary: "Clean and validate data by removing duplicates, errors, and inconsistencies.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Duplicate removal", "Error correction", "Data validation"],
            //   useCases: ["Data preparation", "Analytics pipelines", "Machine learning"],
            //   description: ["AI Data Cleaner enables users to upload CSV files and automatically clean, organize, and optimize the data using AI. It provides real-time progress feedback, previews the cleaned data, and allows easy download of the processed CSV. The interface includes error handling, loading states, and action buttons for seamless workflow."],
            //   status: "available"
            // },
            // {
            //   id: "schema-generator-agent",
            //   name: "Schema Generator Agent",
            //   summary: "Generate and validate data schemas for structured data.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Schema generation", "Validation rules", "Data mapping"],
            //   useCases: ["Database design", "API development", "Data integration"],
            //   description: ["Schema Generator allows users to upload CSV or Excel files and automatically generate platform-specific SQL schemas (Databricks, Snowflake, Teradata, Netezza). It analyzes file structure, column types, and previews sample data while providing a fully formatted SQL schema. The interface includes error handling, loading states, and an organized output for quick integration into data pipelines."],
            //   status: "available"
            // },
            // {
            //   id: "data-profiling-agent",
            //   name: "Data Profiling Agent",
            //   summary: "Analyze and profile data to understand its structure and quality.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Data profiling", "Quality assessment", "Metadata generation"],
            //   useCases: ["Data exploration", "Quality monitoring", "Compliance reporting"],
            //   description: ["The DataProfiler is a web application that allows users to upload CSV or Excel files (up to 10MB) for comprehensive data profiling. It generates detailed reports on dataset statistics, quality issues, pattern recognition, correlations, and business rule validations. Users can drag-and-drop files, analyze data, and download results as a JSON report. The interface features collapsible sections for easy navigation and visualization of profiling insights."],
            //   status: "available"
            // },
            // {
            //   id: "data-generation-agent",
            //   name: "Data Generation Agent",
            //   summary: "Generate synthetic data for various use cases.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Data synthesis", "Scenario simulation", "Augmented datasets"],
            //   useCases: ["Testing", "Training AI models", "Data augmentation"],
            //   description: ["The DataGeneration tool is a web application that enables users to create custom datasets using AI-driven methods. Users can generate data by defining table names, domains, and columns, uploading a sample CSV, or providing an SQL schema. The tool supports voice input for instructions, customizable column types, and data preview, with the ability to download results as CSV files. Its intuitive interface includes collapsible sections for easy configuration and visualization of generated data."],
            //   status: "available"
            // },
            // {
            //   id: "duplicate-expense-detector",
            //   name: "Duplicate Expense Detector",
            //   summary: "Identify and flag duplicate expenses in financial data.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Duplicate detection", "Data comparison", "Anomaly detection"],
            //   useCases: ["Expense management", "Fraud detection", "Financial auditing"],
            //   description: ["Duplicate Expense Detector helps users upload CSV or Excel files to automatically identify duplicate expense entries. It analyzes the dataset, highlights flagged duplicates with confidence scores, and summarizes total records versus duplicates found. The interface provides a clean, tabular view for easy review and validation."],
            //   status: "available"
            // },
            // {
            //   id: "data-query-agent",
            //   name: "Data Query Agent",
            //   summary: "Query and retrieve data from various sources and formats.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Data retrieval", "Query optimization", "Result formatting"],
            //   useCases: ["Business intelligence", "Reporting", "Data exploration"],
            //   description: ["RAG Data Query enables users to upload CSV or JSON files, store them in a Retrieval-Augmented Generation (RAG) system, and query the data using natural language. It provides instant answers along with source references and allows users to manage the stored document repository. The interface is interactive, user-friendly, and supports real-time data operations."],
            //   status: "available"
            // },
          ]
        },
        {
          id: "spreadsheet-analysis",
          name: "Spreadsheet Analysis",
          description: "Analyze and process spreadsheet data for insights and automation.",
          image: "/placeholder.jpg",
          agents: [
            {
              "id": "ai-sheets",
              "name": "AI Sheet",
              "summary": "Interact, analyze, and visualize your datasets with AI-driven insights and automation.",
              "image": "/placeholder.jpg",
              "solutions": ["Conversational data querying", "Automated visualization", "Report generation", "Database/API integration", "Prompt-to-formula conversion"],
              "useCases": ["Business analytics", "Data exploration", "Dashboard reporting", "Research analysis", "Machine learning pipelines"],
              "description": [
                "AI Sheet is an intelligent platform that lets users upload datasets in multiple formats (CSV, Excel, TSV, and future formats like PDF, Word, Images) and interact with them using natural language queries or analytical intents.",
                "The agent can generate visualizations, summarize insights, create reports, and integrate with databases or APIs for live data analysis.",
                "AI Sheet is ideal for business users, analysts, educators, researchers, and teams who need fast, reliable, and interactive data intelligence without writing code or complex formulas.",
                "Future enhancements include multi-format support, advanced workflow automation, prompt-to-formula conversion, and exportable dashboards for seamless decision-making."
              ],
              "status": "available"
            }
            

          ]
        },
        {
          id: "database-querying-management",
          name: "Database Querying & Management",
          description: "Query, manage, and optimize database operations and data retrieval.",
          image: "/placeholder.jpg",
          agents: [
          ]
        },
        {
          id: "web-scraping-extraction",
          name: "Web Scraping & Extraction",
          description: "Extract and collect data from web sources and online platforms.",
          image: "/placeholder.jpg",
          agents: [
          ]
        },
        {
          id: "invoice-processing",
          name: "Invoice Processing",
          description: "Process and extract data from invoices and financial documents.",
          image: "/placeholder.jpg",
          agents: [
          ]
        },
        {
          id: "file-conversion-formatting",
          name: "File Conversion & Formatting",
          description: "Convert and format files between different formats and standards.",
          image: "/placeholder.jpg",
          agents: [

          ]
        },
        {
          id: "data-visualization",
          name: "Data Visualization",
          description: "Create compelling visualizations and charts from data insights.",
          image: "/placeholder.jpg",
          agents: [
          ]
        }
      ]
    },
    {
      id: "developer-support",
      name: "Developer Support",
      description: "Tools, automation, and guidance for building and maintaining applications.",
      image: "/undraw_instant-support_oav0.png",
      subCategories: [
        {
          id: "code-review-debugging",
          name: "Code Review & Debugging",
          description: "Review code quality, identify bugs, and provide debugging assistance.",
          image: "/placeholder.jpg",
          agents: [
          ]
        },
        {
          id: "testing-qa-bots",
          name: "Testing & QA Bots",
          description: "Automate testing processes and quality assurance workflows.",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "testcase-generation-agent",
            //   name: "Test Case Generation Agent",
            //   summary: "Automate test case generation and execution for applications.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Test generation", "Automated execution", "Result analysis"],
            //   useCases: ["Regression testing", "Continuous integration", "Quality assurance"],
            //   description: ["Test Case Generation Agent automatically generates structured test cases from user-provided requirements or user stories. It parses input, produces clean, well-formatted test cases, and displays them interactively with options to download as Markdown or TXT. The interface supports real-time processing with clear error handling and visual feedback."],
            //   status: "available"
            // },
            // {
            //   id: "automated-linter-agent",
            //   name: "Automated Linter Agent",
            //   summary: "Automate code linting and style checking for applications.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Code linting", "Style checking", "Best practices enforcement"],
            //   useCases: ["Code quality assurance", "Development support", "Team collaboration"],
            //   description: ["The Automated Linter is a web-based tool that analyzes source code for errors, style violations, and potential improvements. It supports multiple programming languages and provides detailed suggestions for code quality, refactoring, and AI-assisted insights. Users can input code directly or upload files for instant linting results."],
            //   status: "available"
            // },
          ]
        },
        {
          id: "devops-monitoring",
          name: "DevOps Monitoring",
          description: "Monitor and manage DevOps processes, infrastructure, and deployments.",
          image: "/placeholder.jpg",
          agents: [
          ]
        },
        {
          id: "workflow-automation",
          name: "Workflow Automation",
          description: "Automate development workflows and repetitive tasks.",
          image: "/placeholder.jpg",
          agents: [

          ]
        },
        {
          id: "integration-api-agents",
          name: "Integration & API Agents",
          description: "Manage API integrations and system connectivity.",
          image: "/placeholder.jpg",
          agents: [
          ]
        }
      ]
    },
    {
      id: "work-management",
      name: "Work Management",
      description: "Plan, track, and optimize tasks, workflows, and team collaboration.",
      image: "/undraw_hr-presentation_uunk.png",
      subCategories: [
        {
          id: "task-project-management",
          name: "Task & Project Management",
          description: "Manage tasks, projects, and team collaboration efficiently.",
          image: "/placeholder.jpg",
          agents: [

            // {
            //   id: "task-breakdown-agent",
            //   name: "Task Breakdown Agent",
            //   summary: "Break down tasks into manageable subtasks.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Task decomposition", "Subtask management", "Progress tracking"],
            //   useCases: ["Agile development", "Project planning", "Team collaboration"],
            //   description: ["Task Breakdown Agent converts your project PDFs into a structured task overview. It extracts key details like title, summary, complexity, subtasks, risks, and recommended resources. Ideal for teams, managers, and professionals to plan, prioritize, and track projects efficiently."],
            //   status: "available"
            // },
            // {
            //   id: "csv-to-excel-agent",
            //   name: "CSV to Excel Agent",
            //   summary: "Convert CSV files to Excel format and vice versa.",
            //   image: "/placeholder.jpg",
            //   solutions: ["File conversion", "Data transformation", "Spreadsheet automation"],
            //   useCases: ["Data analysis", "Report generation", "Data migration"],
            //   description: ["CSV ↔ Excel Converter lets you quickly convert files between CSV and Excel formats. It supports .csv, .xlsx, and .xls, handling uploads, conversion, and downloads seamlessly. Perfect for professionals who need fast, reliable, and user-friendly data format conversions."],
            //   status: "available"
            // },
            // {
            //   id: "mom-generator-agent",
            //   name: "MoM Generator Agent",
            //   summary: "Generate Minutes of Meeting (MoM) documents from discussions.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Meeting transcription", "Action item extraction", "Summary generation"],
            //   useCases: ["Team meetings", "Project updates", "Client calls"],
            //   description: ["Meeting Notes Generator transforms your meeting transcripts or uploaded files into structured notes. It captures key details like meeting title, date, participants, agenda, discussion summary, decisions, and action items."],
            //   status: "available"
            // },
            // {
            //   id: "speech-to-text-mom",
            //   name: "Speech to Text MOMAgent",
            //   summary: " Convert audio files to  Minutes of Meeting (MoM) documents from discussions.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Meeting transcription", "Action item extraction", "Summary generation"],
            //   useCases: ["Team meetings", "Project updates", "Client calls"],
            //   description: ["Meeting Notes Generator transforms your meeting transcripts or uploaded files into structured notes. It captures key details like meeting title, date, participants, agenda, discussion summary, decisions, and action items."],
            //   status: "available"
            // },
            {
              id: "live-speech-to-text-mom",
              name: "Live Speech to Text MOMAgent",
              summary: "Live Generate Minutes of Meeting (MoM) documents from discussions.",
              image: "/placeholder.jpg",
              solutions: ["Meeting transcription", "Action item extraction", "Summary generation"],
              useCases: ["Team meetings", "Project updates", "Client calls"],
              description: ["Meeting Notes Generator transforms your meeting transcripts or uploaded files into structured notes. It captures key details like meeting title, date, participants, agenda, discussion summary, decisions, and action items."],
              status: "available"
            },
            // {
            //   id: "report-generator-agent",
            //   name: "Report Generator Agent",
            //   summary: "Generate reports from various data sources.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Report generation", "Data visualization", "Automated insights"],
            //   useCases: ["Business reporting", "Data analysis", "Performance tracking"],
            //   description: ["Report Generator transforms your PDF or Excel files into a structured, professional report. It extracts key information and presents it in a clear, readable format. Perfect for professionals and teams to summarize data efficiently and save time."],
            //   status: "available"
            // },

            // {
            //   id: "general-utility-agent",
            //   name: "General Utility Agent",
            //   summary: "Provide various utility functions to assist users.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Data formatting", "Text manipulation", "File management"],
            //   useCases: ["Data preparation", "Content creation", "Workflow automation"],
            //   description: ["General Utility Conversion lets you convert time zones, units, or currencies with ease. It supports natural language queries or structured inputs for precise conversions. Perfect for professionals, travelers, and teams needing quick, accurate transformations."],
            //   status: "available"
            // },
            // {
            //   id: "product-classifier",
            //   name: "Product Classifier Agent",
            //   summary: "Generate reports from Product classifier.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Report generation", "Data visualization", "Automated insights"],
            //   useCases: ["Business reporting", "Data analysis", "Performance tracking"],
            //   description: ["Product Service Classifier lets you categorize any product or service description quickly. It provides primary and secondary categories, confidence scores, sentiment, industry, use case, and target audience."],
            //   status: "available"
            // },
            // {
            //   id: "email-draft-agent",
            //   name: "Email Draft Agent",
            //   summary: "Assist in drafting and organizing email communications.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Email composition", "Template management", "Scheduling"],
            //   useCases: ["Email marketing", "Customer communication", "Internal collaboration"],
            //   description: ["Email Drafting Agent helps you generate professional emails quickly. It produces complete drafts with subject, greeting, body, sign-off, signature, and optional follow-ups. Perfect for professionals, teams, and anyone needing polished, ready-to-send emails."],
            //   status: "available"
            // },
            // {
            //   id: "evaluation-agent",
            //   name: "Evaluation Agent",
            //   summary: "Evaluate and assess project outcomes and performance.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Performance metrics", "Feedback analysis", "Reporting"],
            //   useCases: ["Project evaluation", "Team performance", "Outcome assessment"],
            //   description: ["Text Evaluation Agent analyzes your summaries or notes for accuracy, tone, and completeness. It detects key elements like topics, participants, timelines, and action items. Ideal for teams and professionals seeking clear, actionable feedback on written content."],
            //   status: "available"
            // },
          ]
        },
        {
          id: "calendar-scheduling",
          name: "Calendar & Scheduling",
          description: "Manage calendars, appointments, and scheduling optimization.",
          image: "/placeholder.jpg",
          agents: [
          ]
        },
        {
          id: "presentation-building",
          name: "Presentation Building",
          description: "Create and optimize presentations and visual content.",
          image: "/placeholder.jpg",
          agents: [

          ]
        },
        {
          id: "research-assistance",
          name: "Research Assistance",
          description: "Assist with research tasks, data collection, and information gathering.",
          image: "/placeholder.jpg",
          agents: [

          ]
        }
      ]
    },
    {
      id: "social-media",
      name: "Social & Media",
      description: "Create, manage, and analyze social interactions and media content.",
      image: "/undraw_tweetstorm_wq1q.png",
      subCategories: [
        {
          id: "social-media-analytics",
          name: "Social Media Analytics",
          description: "Analyze social media performance, trends, and audience engagement.",
          image: "/placeholder.jpg",
          agents: [

            // {
            //   id: "social-media-content-agent",
            //   name: "Social Media Content Agent",
            //   summary: "Create and manage content for social media platforms.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Content creation", "Post scheduling", "Engagement tracking"],
            //   useCases: ["Social media marketing", "Brand awareness", "Audience engagement"],
            //   description: ["Social Media Content Generator helps users create platform-specific posts effortlessly. It generates engaging content tailored to your topic, audience, and purpose, including suggested hashtags and step-by-step posting strategies. The tool streamlines social media planning, saving time and boosting engagement."],
            //   status: "available"
            // },
            // {
            //   id: "quiz-generator-agent",
            //   name: "Quiz Generator Agent",
            //   summary: "Create quizzes and assessments from various content sources.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Quiz creation", "Question generation", "Assessment design"],
            //   useCases: ["Educational content", "Training materials", "Skill assessments"],
            //   status: "available",
            //   description: ["Quiz Generator makes quiz creation effortless by turning any topic into ready-to-use multiple-choice questions. Customize the number of questions and get instant quizzes with correct answers includedPerfect for educators, trainers, and learners to save time and boost engagement."],
            // },
            // {
            //   id: "social-media",
            //   name: "Story Line Generator",
            //   summary: "Generate engaging storylines for social media content.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Content ideation", "Narrative development", "Audience engagement"],
            //   useCases: ["Social media campaigns", "Brand storytelling", "Content marketing"],
            //   status: "available",
            //   description: ["Storyline Generator turns your ideas into engaging story plots with AI-crafted narratives.Simply enter a theme and get structured, ready-to-use storylines instantly.Perfect for writers, filmmakers, and creatives to save time and spark imagination."]
            // },

            // {
            //   id: "work-management",
            //   name: "Headline Generator Agent",
            //   summary: "Create engaging headlines for social media content.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Headline optimization", "Audience targeting", "Engagement analysis"],
            //   useCases: ["Social media marketing", "Content promotion", "Brand awareness"],
            //   description: ["Headline Generator instantly transforms your text into catchy, engaging headlines powered by AI.Just input your content and get multiple compelling headline options in seconds.Perfect for marketers, bloggers, and media creators to boost attention and clicks."],
            //   status: "available"
            // },

            // {
            //   id: "image-generation-agent",
            //   name: "Image Generation Agent",
            //   summary: "Generate images for social media content.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Image synthesis", "Style transfer", "Visual content creation"],
            //   useCases: ["Social media posts", "Marketing materials", "Brand visuals"],
            //   description: ["AI Image Generator transforms your text prompts into stunning, high-quality images instantly.Choose from styles like realistic, professional, or artistic to match your needs.Perfect for designers, marketers, and creators looking for fast, customized visuals."],
            //   status: "available"
            // },
            // {
            //   id: "image-to-pdf",
            //   name: "Image to PDF Agent",
            //   summary: "Convert images to PDF format.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Image conversion", "PDF generation"],
            //   useCases: ["Document management", "File sharing"],
            //   description: ["Image to PDF Converter turns your images into professional, multi-page PDFs effortlessly. Supports JPG and PNG formats, allowing batch uploads for seamless conversion. Ideal for students, professionals, and creators needing fast, high-quality PDFs."],
            //   status: "available"
            // }

          ]
        },
        {
          id: "social-media-content-creation",
          name: "Social Media Content Creation",
          description: "Create engaging social media content and manage content strategies.",
          image: "/placeholder.jpg",
          agents: [

          ]
        }
      ]
    }
  ],
  industry: [
    {
      id: "hr",
      name: "Human Resources",
      description:
        "Streamline HR processes with intelligent automation and compliance.",
      image: "/industry/hr.png",
      subCategories: [
        {
          id: "talent-management",
          name: "Talent Management",
          description: "Complete talent lifecycle from acquisition to development",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "talent-acquisition",
            //   name: "Talent Acquisition & Recruitment",
            //   summary:
            //     "Automate candidate sourcing, screening, and interview coordination.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "AI-powered candidate matching",
            //     "Resume parsing",
            //     "Interview scheduling",
            //   ],
            //   useCases: [
            //     "Campus hiring",
            //     "Lateral recruitment",
            //     "High-volume hiring",
            //   ],
            // },
            // {
            //   id: "employee-development",
            //   name: "Employee Development & Retention",
            //   summary: "Personalize development journeys and retention strategies.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Skill gap analysis",
            //     "Learning paths",
            //     "Career progression insights",
            //   ],
            //   useCases: [
            //     "Upskilling programs",
            //     "Leadership training",
            //     "High-potential employee retention",
            //   ],
            // },
            // {
            //   id: "workforce-planning",
            //   name: "Workforce Planning & Strategy",
            //   summary: "Forecast workforce needs and optimize staffing strategies.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Demand forecasting",
            //     "Skill inventory analysis",
            //     "Scenario planning",
            //   ],
            //   useCases: [
            //     "Strategic hiring plans",
            //     "Succession planning",
            //     "Mergers & acquisitions staffing",
            //   ],
            // },
          ]
        },
        {
          id: "employee-lifecycle",
          name: "Employee Lifecycle",
          description: "Onboarding, engagement, and offboarding processes",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "employee-onboarding",
            //   name: "Employee Onboarding & Training",
            //   summary:
            //     "Digitize onboarding workflows and deliver personalized training paths.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Automated document collection",
            //     "Role-based learning modules",
            //     "Virtual orientation",
            //   ],
            //   useCases: [
            //     "New hire onboarding",
            //     "Cross-functional training",
            //     "Remote employee integration",
            //   ],
            // },
            // {
            //   id: "employee-engagement",
            //   name: "Employee Engagement & Experience",
            //   summary:
            //     "Monitor and enhance employee satisfaction, culture, and feedback.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Pulse surveys",
            //     "Sentiment analysis",
            //     "Engagement analytics",
            //   ],
            //   useCases: [
            //     "Culture assessment",
            //     "Feedback loops",
            //     "Employee wellness programs",
            //   ],
            // },
        //     {
        //       id: "offboarding",
        //       name: "Offboarding & Alumni Management",
        //       summary: "Standardize exit processes and build strong alumni networks.",
        //       image: "/placeholder.jpg",
        //       solutions: [
        //         "Exit interview automation",
        //         "Knowledge transfer",
        //         "Alumni engagement portals",
        //       ],
        //       useCases: [
        //         "Voluntary resignations",
        //         "Retirement workflows",
        //         "Alumni networking",
        //       ],
        //     },
        //   ]
        // },
        // {
        //   id: "performance-operations",
        //   name: "Performance & Operations",
        //   description: "Performance management and operational HR functions",
        //   image: "/placeholder.jpg",
        //   agents: [
        //     {
        //       id: "performance-management",
        //       name: "Performance Management",
        //       summary:
        //         "Enable transparent goal setting, reviews, and career progression.",
        //       image: "/placeholder.jpg",
        //       solutions: [
        //         "OKR tracking",
        //         "360-degree feedback",
        //         "Performance scoring",
        //       ],
        //       useCases: [
        //         "Quarterly reviews",
        //         "Promotion assessments",
        //         "Skill gap analysis",
        //       ],
        //     },
        //     {
        //       id: "hr-operations",
        //       name: "HR Operations & Compliance",
        //       summary: "Simplify HR administrative tasks while ensuring compliance.",
        //       image: "/placeholder.jpg",
        //       solutions: [
        //         "Policy automation",
        //         "Document management",
        //         "Payroll integration",
        //       ],
        //       useCases: [
        //         "Leave management",
        //         "Labor law compliance",
        //         "Payroll validation",
        //       ],
        //     },
        //     {
        //       id: "hr-analytics",
        //       name: "HR Analytics & Reporting",
        //       summary: "Analyze workforce trends and provide actionable HR insights.",
        //       image: "/placeholder.jpg",
        //       solutions: [
        //         "Predictive analytics",
        //         "Dashboard visualization",
        //         "Attrition forecasting",
        //       ],
        //       useCases: [
        //         "Attrition analysis",
        //         "Hiring funnel optimization",
        //         "Workforce productivity tracking",
        //       ],
        //     },
          ]
        },
        {
          id: "compliance-risk",
          name: "Compliance & Risk",
          description: "HR compliance, policy management, and risk mitigation",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "compliance-policy",
            //   name: "Compliance, Risk & Policy Management",
            //   summary:
            //     "Ensure adherence to HR policies, labor laws, and mitigate risks.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Policy libraries", "Risk scoring", "Regulation alignment"],
            //   useCases: [
            //     "GDPR compliance",
            //     "Equal employment audits",
            //     "Workplace safety",
            //   ],
            // },
          ]
        }
      ]
    },
    {
      id: "real-estate",
      name: "Real Estate",
      description:
        "Optimized workflows for property management, sales, leasing, and compliance.",
      image: "/industry/Realestate.png",
      subCategories: [
        {
          id: "property-transactions",
          name: "Property Transactions",
          description: "Buying, selling, and transferring property ownership",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "property-selling",
            //   name: "Property Selling Workflow",
            //   summary: "Automate the process of listing and selling properties.",
            //   image: "/Realestate.png",
            //   solutions: [
            //     "Property listing optimization",
            //     "Buyer matching",
            //     "Contract generation",
            //   ],
            //   useCases: [
            //     "Residential sales",
            //     "Commercial sales",
            //     "Auction preparation",
            //   ],
            // },
            // {
            //   id: "real-estate-service-classifier",
            //   name: "Real Estate Service Classifier",
            //   summary: "Classify real estate services based on user inquiries.",
            //   image: "/Realestate.png",
            //   solutions: [
            //     "Service categorization",
            //     "Buyer matching",
            //     "Contract generation",
            //   ],
            //   useCases: [
            //     "Residential sales",
            //     "Commercial sales",
            //     "Auction preparation",
            //   ],
            //   status: "available"
            // },
            // {
            //   id: "real-estate-inquiry-agent",
            //   name: "Real Estate Inquiry Agent",
            //   summary: "Real estate services based on user inquiries.",
            //   image: "/Realestate.png",
            //   solutions: [
            //     "Service categorization",
            //     "Buyer matching",
            //     "Contract generation",
            //   ],
            //   useCases: [
            //     "Residential sales",
            //     "Commercial sales",
            //     "Auction preparation",
            //   ],
            //   status: "available"
            // },
            // {
            //   id: "real-estate-news-brief",
            //   name: "Real Estate News Brief",
            //   summary: "Stay updated with the latest real estate news.",
            //   image: "/Realestate.png",
            //   solutions: [
            //     "Service categorization",
            //     "Buyer matching",
            //     "Contract generation",
            //   ],
            //   useCases: [
            //     "Residential sales",
            //     "Commercial sales",
            //     "Auction preparation",
            //   ],
            //   status: "available"
            // },
        //     {
        //       id: "property-purchase",
        //       name: "Property Purchase Workflow",
        //       summary:
        //         "Facilitate property purchase processes with due diligence and financing.",
        //       image: "/eSTATE.png",
        //       solutions: [
        //         "Purchase agreement automation",
        //         "Financing coordination",
        //         "Due diligence checks",
        //       ],
        //       useCases: [
        //         "Home buying",
        //         "Commercial acquisitions",
        //         "Investment purchases",
        //       ],
        //     },
        //     {
        //       id: "buyer-assistance",
        //       name: "Buyer Assistance Workflow",
        //       summary: "Support buyers through the property purchase process.",
        //       image: "/undraw_coming-home_jmbc.png",
        //       solutions: [
        //         "Property recommendations",
        //         "Negotiation support",
        //         "Closing assistance",
        //       ],
        //       useCases: [
        //         "First-time buyers",
        //         "Investment purchases",
        //         "Relocation support",
        //       ],
        //     },
        //     {
        //       id: "seller-assistance",
        //       name: "Seller Assistance Workflow",
        //       summary: "Assist sellers in marketing and closing property sales.",
        //       image: "/placeholder.jpg",
        //       solutions: [
        //         "Market analysis",
        //         "Listing optimization",
        //         "Buyer coordination",
        //       ],
        //       useCases: ["Home sales", "Commercial sales", "Quick sales"],
        //     },
        //     {
        //       id: "property-acquisition",
        //       name: "Property Acquisition Workflow",
        //       summary: "Streamline the acquisition of new properties.",
        //       image: "/placeholder.jpg",
        //       solutions: [
        //         "Market analysis",
        //         "Negotiation support",
        //         "Acquisition planning",
        //       ],
        //       useCases: [
        //         "Investment properties",
        //         "Portfolio expansion",
        //         "Distressed assets",
        //       ],
        //     },
        //   ]
        // },
        // {
        //   id: "property-management",
        //   name: "Property Management",
        //   description: "Managing properties, tenants, and maintenance operations",
        //   image: "/placeholder.jpg",
        //   agents: [
        //     {
        //       id: "tenant-management",
        //       name: "Tenant Management Workflow",
        //       summary: "Streamline tenant relations and property management tasks.",
        //       image: "/placeholder.jpg",
        //       solutions: [
        //         "Tenant communication",
        //         "Issue tracking",
        //         "Payment monitoring",
        //       ],
        //       useCases: [
        //         "Multi-unit management",
        //         "Tenant retention",
        //         "Property operations",
        //       ],
        //     },
        //     {
        //       id: "property-maintenance",
        //       name: "Property Maintenance Workflow",
        //       summary: "Manage maintenance requests and service schedules.",
        //       image: "/placeholder.jpg",
        //       solutions: [
        //         "Request tracking",
        //         "Vendor coordination",
        //         "Maintenance scheduling",
        //       ],
        //       useCases: [
        //         "Residential repairs",
        //         "Commercial upkeep",
        //         "Preventive maintenance",
        //       ],
        //     },
        //     {
        //       id: "complaint-maintenance",
        //       name: "Complaint & Maintenance Workflow",
        //       summary:
        //         "Handle tenant complaints and maintenance requests efficiently.",
        //       image: "/placeholder.jpg",
        //       solutions: [
        //         "Complaint logging",
        //         "Priority assignment",
        //         "Resolution tracking",
        //       ],
        //       useCases: ["Tenant issues", "Property repairs", "Service coordination"],
        //     },
        //     {
        //       id: "maintenance",
        //       name: "Maintenance Workflow",
        //       summary: "Coordinate and track property maintenance activities.",
        //       image: "/placeholder.jpg",
        //       solutions: [
        //         "Maintenance scheduling",
        //         "Vendor management",
        //         "Cost tracking",
        //       ],
        //       useCases: [
        //         "Routine maintenance",
        //         "Emergency repairs",
        //         "Property upkeep",
        //       ],
        //     },
          ]
        },
        {
          id: "leasing-rental",
          name: "Leasing & Rental",
          description: "Property leasing, rental management, and renewals",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "rental-renewal",
            //   name: "Rental Renewal Workflow",
            //   summary: "Automate lease renewals and tenant communications.",
            //   image: "/Real.png",
            //   solutions: [
            //     "Renewal reminders",
            //     "Lease updates",
            //     "Tenant negotiations",
            //   ],
            //   useCases: [
            //     "Residential renewals",
            //     "Commercial lease extensions",
            //     "Rent adjustments",
            //   ],
            // },
            // {
            //   id: "property-leasing",
            //   name: "Property Leasing Workflow",
            //   summary:
            //     "Streamline leasing processes for residential and commercial properties.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Lease agreement automation",
            //     "Tenant screening",
            //     "Payment tracking",
            //   ],
            //   useCases: ["Rental agreements", "Commercial leasing", "Lease renewals"],
            // },
            // {
            //   id: "rental-acquisition",
            //   name: "Rental Acquisition Workflow",
            //   summary: "Simplify the process of acquiring rental properties.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Market analysis",
            //     "Property evaluation",
            //     "Acquisition planning",
            //   ],
            //   useCases: [
            //     "Rental portfolio expansion",
            //     "Investment properties",
            //     "Multi-unit acquisitions",
            //   ],
            // },
            // {
            //   id: "rental",
            //   name: "Rental Workflow",
            //   summary: "Manage the end-to-end rental process for properties.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Tenant onboarding", "Rent collection", "Lease management"],
            //   useCases: [
            //     "Residential rentals",
            //     "Commercial rentals",
            //     "Short-term leases",
            //   ],
            // },
            // {
            //   id: "rental-income",
            //   name: "Rental Income Workflow",
            //   summary: "Optimize and track rental income streams.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Rent collection",
            //     "Income forecasting",
            //     "Delinquency tracking",
            //   ],
            //   useCases: [
            //     "Rental portfolios",
            //     "Property management",
            //     "Cash flow analysis",
            //   ],
            // },
          ]
        },
        {
          id: "financing-legal",
          name: "Financing & Legal",
          description: "Mortgages, legal compliance, and financial transactions",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "mortgage",
            //   name: "Mortgage Workflow",
            //   summary: "Automate mortgage application and approval processes.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Document verification",
            //     "Credit assessment",
            //     "Loan processing",
            //   ],
            //   useCases: ["Home mortgages", "Commercial loans", "Refinancing"],
            // },
            // {
            //   id: "mortgage-processing",
            //   name: "Mortgage Processing Workflow",
            //   summary: "Automate mortgage processing and documentation.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Application processing",
            //     "Document verification",
            //     "Approval tracking",
            //   ],
            //   useCases: ["Home loans", "Commercial mortgages", "Refinancing"],
            // },
            // {
            //   id: "refinancing",
            //   name: "Refinancing Workflow",
            //   summary: "Manage property refinancing processes.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Loan comparison",
            //     "Application automation",
            //     "Approval coordination",
            //   ],
            //   useCases: [
            //     "Mortgage refinancing",
            //     "Loan restructuring",
            //     "Rate optimization",
            //   ],
            // },
            // {
            //   id: "property-sale-legal",
            //   name: "Property Sale Legal Workflow",
            //   summary: "Handle legal aspects of property sales.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Contract review",
            //     "Compliance checks",
            //     "Closing documentation",
            //   ],
            //   useCases: ["Residential sales", "Commercial sales", "Legal compliance"],
            // },
            // {
            //   id: "dispute-resolution",
            //   name: "Dispute Resolution Workflow",
            //   summary: "Resolve disputes related to property transactions.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Dispute logging",
            //     "Mediation support",
            //     "Resolution tracking",
            //   ],
            //   useCases: [
            //     "Tenant disputes",
            //     "Contract disagreements",
            //     "Legal resolutions",
            //   ],
            // },
          ]
        },
        {
          id: "development-investment",
          name: "Development & Investment",
          description: "Property development, investment, and flipping projects",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "project-development",
            //   name: "Project Development Workflow",
            //   summary:
            //     "Manage real estate development projects from planning to completion.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Project planning", "Budget tracking", "Permit management"],
            //   useCases: [
            //     "Residential developments",
            //     "Commercial projects",
            //     "Mixed-use developments",
            //   ],
            // },
            // {
            //   id: "property-flipping",
            //   name: "Property Flipping Workflow",
            //   summary:
            //     "Manage the process of buying, renovating, and selling properties.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Renovation planning",
            //     "Budget management",
            //     "Sales strategy",
            //   ],
            //   useCases: [
            //     "Fix-and-flip projects",
            //     "Investment properties",
            //     "Quick turnarounds",
            //   ],
            // },
            // {
            //   id: "construction",
            //   name: "Construction Workflow",
            //   summary: "Oversee construction processes for real estate projects.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Construction scheduling",
            //     "Contractor coordination",
            //     "Progress tracking",
            //   ],
            //   useCases: ["New builds", "Renovations", "Infrastructure projects"],
            // },
          ]
        },
        {
          id: "compliance-services",
          name: "Compliance & Services",
          description: "Legal compliance, insurance, and regulatory services",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "due-diligence",
            //   name: "Due Diligence Workflow",
            //   summary: "Conduct thorough due diligence for property transactions.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Title checks",
            //     "Property valuation",
            //     "Compliance verification",
            //   ],
            //   useCases: [
            //     "Property purchases",
            //     "Investment analysis",
            //     "Legal compliance",
            //   ],
            // },
            // {
            //   id: "property-insurance",
            //   name: "Property Insurance Workflow",
            //   summary: "Manage property insurance processes and documentation.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Policy comparison",
            //     "Application automation",
            //     "Claims support",
            //   ],
            //   useCases: [
            //     "Home insurance",
            //     "Commercial insurance",
            //     "Rental property coverage",
            //   ],
            // },
            // {
            //   id: "claim-settlement",
            //   name: "Claim Settlement Workflow",
            //   summary: "Streamline insurance claim settlements for properties.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Claim documentation",
            //     "Assessment support",
            //     "Settlement tracking",
            //   ],
            //   useCases: ["Damage claims", "Liability claims", "Insurance payouts"],
            // },
            // {
            //   id: "surveying",
            //   name: "Surveying Workflow",
            //   summary: "Coordinate property surveying and assessments.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Survey scheduling",
            //     "Data collection",
            //     "Report generation",
            //   ],
            //   useCases: ["Land surveys", "Property assessments", "Boundary disputes"],
            // },
            // {
            //   id: "property-registration",
            //   name: "Property Registration Workflow",
            //   summary: "Automate property registration and documentation.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Document preparation",
            //     "Registration tracking",
            //     "Compliance checks",
            //   ],
            //   useCases: [
            //     "New property registrations",
            //     "Title transfers",
            //     "Legal documentation",
            //   ],
            // },
            // {
            //   id: "zoning-approval",
            //   name: "Zoning Approval Workflow",
            //   summary: "Manage zoning and land use approvals for properties.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Application preparation",
            //     "Compliance verification",
            //     "Approval tracking",
            //   ],
            //   useCases: [
            //     "Development projects",
            //     "Land use changes",
            //     "Zoning compliance",
            //   ],
            // },
            // {
            //   id: "taxation",
            //   name: "Taxation Workflow",
            //   summary: "Handle property tax calculations and compliance.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Tax assessment",
            //     "Payment tracking",
            //     "Compliance reporting",
            //   ],
            //   useCases: [
            //     "Property tax filings",
            //     "Tax exemptions",
            //     "Assessment disputes",
            //   ],
            // },
            // {
            //   id: "property-inspection",
            //   name: "Property Inspection Workflow",
            //   summary: "Coordinate and document property inspections.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Inspection scheduling",
            //     "Report generation",
            //     "Compliance checks",
            //   ],
            //   useCases: [
            //     "Pre-sale inspections",
            //     "Rental inspections",
            //     "Safety compliance",
            //   ],
            // },
          ]
        },
        {
          id: "marketing-reporting",
          name: "Marketing & Reporting",
          description: "Property marketing, sales, and financial reporting",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "marketing-sales",
            //   name: "Marketing & Sales Workflow",
            //   summary:
            //     "Promote properties and drive sales through targeted marketing.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Marketing campaigns", "Lead generation", "Sales tracking"],
            //   useCases: ["Property listings", "Open houses", "Online marketing"],
            // },
            // {
            //   id: "property-marketing",
            //   name: "Property Marketing Workflow",
            //   summary: "Create and manage marketing campaigns for properties.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Campaign creation",
            //     "Lead tracking",
            //     "Analytics reporting",
            //   ],
            //   useCases: [
            //     "Property listings",
            //     "Social media marketing",
            //     "Open house promotions",
            //   ],
            // },
            // {
            //   id: "financial-reporting",
            //   name: "Financial Reporting Workflow",
            //   summary: "Generate financial reports for property portfolios.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Income tracking", "Expense reporting", "Tax preparation"],
            //   useCases: ["Portfolio analysis", "Investor reports", "Tax compliance"],
            // },
          ]
        }
      ]
    },
    {
      id: "retail",
      name: "Retail",
      description: "Automation and optimization for retail operations, sales, and customer engagement.",
      image: "/industry/Ecommerce&retail.png",
      subCategories: [
        {
          id: "customer-experience",
          name: "Customer Experience",
          description: "Enhancing customer interactions and sales processes",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "end-users",
            //   name: "End Users Workflow",
            //   summary: "Enhance customer experience from product search to purchase and feedback.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Product search", "Recommendations", "Price comparison", "Checkout", "Feedback collection"],
            //   useCases: ["Online shopping", "In-store browsing", "Customer satisfaction tracking"],
            // },
            // {
            //   id: "retail-complaint-agent",
            //   name: "Retail Complaint Workflow",
            //   summary: "Manage and resolve customer complaints effectively.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Complaint intake", "Issue tracking", "Resolution management", "Feedback collection"],
            //   useCases: ["Customer support", "Issue resolution", "Service improvement"],
            //   status: "available"
            // },
            // {
            //   id: "retail-entity-extractor",
            //   name: "Retail Entity Extractor Workflow",
            //   summary: "Extract and manage key entities from retail data.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Entity extraction", "Data categorization", "Information retrieval"],
            //   useCases: ["Product categorization", "Customer segmentation", "Sales analysis"],
            //   status: "available"
            // },
            // {
            //   id: "customer-interaction-sales",
            //   name: "Customer Interaction & Sales Workflow",
            //   summary: "Assist sales associates with product assistance, billing, and checkout.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Greeting customers", "Product assistance", "Billing", "Payment processing", "Checkout"],
            //   useCases: ["Point-of-sale assistance", "Customer service", "Sales conversion"],
            // },
            // {
            //   id: "after-sales-support",
            //   name: "After-Sales Support Workflow",
            //   summary: "Handle customer queries, issue resolution, escalations, and feedback collection.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Query intake", "Issue categorization", "Resolution", "Escalation management", "Feedback collection"],
            //   useCases: ["Customer support", "Issue tracking", "Service improvement"],
            // },
          ]
        },
        {
          id: "store-operations",
          name: "Store Operations",
          description: "Daily store management and operational workflows",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "store-operations",
            //   name: "Store Operations Workflow",
            //   summary: "Streamline store operations including staff scheduling, inventory review, and audits.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Staff scheduling", "Sales monitoring", "Inventory review", "Store audits", "Reporting"],
            //   useCases: ["Daily store management", "Operational efficiency", "Store performance tracking"],
            // },
            // {
            //   id: "product-display",
            //   name: "Product Display & In-Store Experience Workflow",
            //   summary: "Support merchandisers in market research, planograms, promotions, and store walkthroughs.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Market research", "Planogram design", "Product display setup", "Promotion setup", "Store walkthrough"],
            //   useCases: ["Visual merchandising", "Promotion execution", "Customer engagement in-store"],
            // },
            // {
            //   id: "retail-technology-systems",
            //   name: "Retail Technology & Systems Workflow",
            //   summary: "Manage POS systems, data backup, troubleshooting, and security monitoring.",
            //   image: "/placeholder.jpg",
            //   solutions: ["System setup", "POS integration", "Data backup", "Troubleshooting", "Security monitoring"],
            //   useCases: ["Retail IT operations", "POS efficiency", "System reliability"],
            // },
          ]
        },
        {
          id: "inventory-supply-chain",
          name: "Inventory & Supply Chain",
          description: "Inventory management, procurement, and supply chain optimization",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "stock-inventory",
            //   name: "Stock & Inventory Management Workflow",
            //   summary: "Automate inventory management from stock checks to audits.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Stock checks", "Reorders", "Goods receipt", "Stock placement", "Inventory audit"],
            //   useCases: ["Inventory control", "Stock replenishment", "Warehouse management"],
            // },
            // {
            //   id: "procurement-distribution",
            //   name: "Procurement & Distribution Workflow",
            //   summary: "Manage supplier selection, order placement, shipping, tracking, and delivery confirmation.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Supplier selection", "Order placement", "Shipping", "Tracking", "Delivery confirmation"],
            //   useCases: ["Supply chain management", "Procurement automation", "On-time delivery assurance"],
            // },
            // {
            //   id: "sourcing-wholesale",
            //   name: "Sourcing & Wholesale Supply Workflow",
            //   summary: "Manage product sourcing, pricing negotiation, shipment, delivery, and invoicing.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Product sourcing", "Pricing negotiation", "Shipment management", "Delivery tracking", "Invoicing"],
            //   useCases: ["Supplier coordination", "Wholesale supply management", "Inventory replenishment"],
            // },
            // {
            //   id: "storage-fulfillment",
            //   name: "Storage & Fulfillment Workflow",
            //   summary: "Automate warehouse operations from receiving goods to dispatch.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Receiving goods", "Storage allocation", "Order picking", "Packing", "Dispatch"],
            //   useCases: ["Warehouse automation", "Inventory fulfillment", "Dispatch efficiency"],
            // },
          ]
        },
        {
          id: "digital-marketing",
          name: "Digital & Marketing",
          description: "Digital retail, marketing campaigns, and customer engagement",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "digital-retail",
            //   name: "Digital Retail & Omnichannel Workflow",
            //   summary: "Streamline online retail operations including listings, pricing, marketing, and fulfillment.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Product listing", "Pricing", "Online marketing", "Order fulfillment", "Returns management"],
            //   useCases: ["E-commerce operations", "Omnichannel sales", "Customer retention online"],
            // },
            // {
            //   id: "promotion-customer-engagement",
            //   name: "Promotion & Customer Engagement Workflow",
            //   summary: "Support marketing teams in campaigns, content, ad placement, and performance tracking.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Campaign planning", "Content creation", "Ad placement", "Customer engagement", "Performance tracking"],
            //   useCases: ["Marketing campaign automation", "Brand engagement", "Promotion ROI tracking"],
            // },
          ]
        },
        {
          id: "business-management",
          name: "Business Management",
          description: "Strategic business operations, finance, and compliance",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "ownership-strategy",
            //   name: "Ownership & Business Strategy Workflow",
            //   summary: "Support store owners in planning, licensing, compliance, and strategy execution.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Business planning", "Licensing", "Compliance monitoring", "Strategy execution", "Performance review"],
            //   useCases: ["Franchise setup", "Business performance tracking", "Strategic expansion"],
            // },
            // {
            //   id: "financial-management",
            //   name: "Financial Management Workflow",
            //   summary: "Assist finance teams in budgeting, expense tracking, payroll, tax filing, and reporting.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Budget planning", "Expense tracking", "Payroll", "Tax filing", "Financial reporting"],
            //   useCases: ["Retail finance management", "Cost tracking", "Profitability analysis"],
            // },
            // {
            //   id: "policy-compliance-taxation",
            //   name: "Policy, Compliance & Taxation Workflow",
            //   summary: "Support regulatory compliance, license applications, audits, and certifications.",
            //   image: "/placeholder.jpg",
            //   solutions: ["License application", "Policy review", "Tax compliance", "Audit", "Certification"],
            //   useCases: ["Regulatory adherence", "Tax compliance", "Business certification"],
            // },
          ]
        },
        {
          id: "workforce-management",
          name: "Workforce Management",
          description: "Employee recruitment, training, and development",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "workforce-recruitment-training",
            //   name: "Workforce Recruitment & Training Workflow",
            //   summary: "Streamline retail hiring processes, from attracting candidates to onboarding and employee skill development.",
            //   image: "/placeholder.jpg",
            //   solutions: [
            //     "Retail job posting & advertising",
            //     "Candidate sourcing & screening",
            //     "Interview scheduling & support",
            //     "Onboarding & orientation",
            //     "Retail staff training & development"
            //   ],
            //   useCases: [
            //     "Retail store staffing",
            //     "New employee onboarding",
            //     "Employee upskilling in retail operations",
            //     "Seasonal workforce management"
            //   ],
            // },

            // {
            //   id: "Product-listing-Agent",
            //   name: "Product listing Agent",
            //   summary: "Support HR in job posting, screening, hiring, and training.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Job posting", "Candidate screening", "Interview assistance", "Hiring", "Training & development"],
            //   useCases: ["Retail workforce management", "Employee onboarding", "Skill development"],
            // },
          ]
        }
      ]
    }
    ,
    {
      id: "media-entertainment",
      name: "Media & Entertainment",
      description: "Automation and optimization for content creation, distribution, audience engagement, and monetization.",
      image: "/industry/Media.png",
      subCategories: [
        {
          id: "content-management",
          name: "Content Management",
          description: "Content creation, curation, and moderation workflows",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "content-creation-curation",
            //   name: "Content Creation & Curation Workflow",
            //   summary: "Support creators in script writing, editing, tagging, and publishing content.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Script writing", "Content editing", "Tagging", "Publishing"],
            //   useCases: ["Video production", "Article creation", "Podcast editing"],
            // },
            // {
            //   id: "content-moderation-compliance",
            //   name: "Content Moderation & Compliance Workflow",
            //   summary: "Ensure uploaded content adheres to platform policies and compliance standards.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Content upload", "Automated scanning", "Compliance check", "Publish or reject"],
            //   useCases: ["User-generated content moderation", "Policy enforcement", "Safe platform experience"],
            // },
          ]
        },
        {
          id: "audience-engagement",
          name: "Audience Engagement",
          description: "Personalization, recommendations, and audience interaction",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "content-recommendation-personalization",
            //   name: "Content Recommendation & Personalization Workflow",
            //   summary: "Provide viewers with personalized content recommendations based on preferences.",
            //   image: "/placeholder.jpg",
            //   solutions: ["User profile analysis", "Preference matching", "Dynamic recommendations"],
            //   useCases: ["Streaming personalization", "News feed optimization", "Audience engagement"],
            // },
            // {
            //   id: "audience-engagement-interaction",
            //   name: "Audience Engagement & Interaction Workflow",
            //   summary: "Enhance viewer engagement through chatbots, gamification, and feedback collection.",
            //   image: "/placeholder.jpg",
            //   solutions: ["User login tracking", "Chatbot interaction", "Gamified engagement", "Feedback collection"],
            //   useCases: ["Subscriber interaction", "Fan engagement", "Community building"],
            // },
          ]
        },
        {
          id: "monetization-analytics",
          name: "Monetization & Analytics",
          description: "Revenue generation, advertising, and performance analytics",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "advertising-campaign-management",
            //   name: "Advertising & Campaign Management Workflow",
            //   summary: "Enable targeted advertising and track campaign performance for marketers.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Audience segmentation", "Ad targeting", "Performance tracking"],
            //   useCases: ["Digital ad campaigns", "Video monetization", "Marketing ROI optimization"],
            // },
            // {
            //   id: "revenue-analytics-forecasting",
            //   name: "Revenue Analytics & Forecasting Workflow",
            //   summary: "Collect data, analyze trends, predict churn, and generate revenue forecasts.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Data collection", "Trend analysis", "Churn prediction", "Forecast report generation"],
            //   useCases: ["Subscription analytics", "Revenue prediction", "Business performance insights"],
            // },
          ]
        },
        {
          id: "rights-licensing",
          name: "Rights & Licensing",
          description: "Content licensing, rights management, and royalty distribution",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "licensing-rights-management",
            //   name: "Licensing & Rights Management Workflow",
            //   summary: "Manage rights registration, usage tracking, and royalty distribution.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Rights registration", "Usage tracking", "Royalty calculation and distribution"],
            //   useCases: ["Content licensing", "Royalty management", "Intellectual property tracking"],
            // },
          ]
        }
      ]
    }
    ,
    {
      id: "legal",
      name: "Legal",
      description: "Compliance and document management for legal processes.",
      image: "/industry/Legal.png",
      subCategories: [
        {
          id: "civil-law",
          name: "Civil Law",
          description: "Civil litigation, property disputes, family matters, and contract disputes",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "civil-law-client-intake",
            //   name: "Civil Law Client Intake & Case Management",
            //   summary: "Manage client onboarding, case creation, document collection, and progress tracking.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Client onboarding", "Case type identification", "Conflict of interest check", "Document collection", "Case timeline generation", "Task assignment", "Client portal setup", "Progress tracking"],
            //   useCases: ["Property disputes", "Family law cases", "Consumer disputes", "Contract disputes"],
            // },
            //   {
            //   id: "contract-management-v1",
            //   name: "Contract Management V1",
            //   summary: "Handle intake, indexing, version control, secure storage, audit logging, and sharing.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Document intake", "Metadata tagging", "Indexing", "Version control", "Secure storage", "Retrieval", "Audit logging", "Document sharing", "Access control", "Archival"],
            //   useCases: ["Legal document organization", "Case file management", "Knowledge sharing"],
            //   status: "available"
            // },
            {
              id: "contract-management-system",
              name: "Contract Management System",
              summary: "Handle intake, indexing, version control, secure storage, audit logging, and sharing.",
              image: "/placeholder.jpg",
              solutions: ["Document intake", "Metadata tagging", "Indexing", "Version control", "Secure storage", "Retrieval", "Audit logging", "Document sharing", "Access control", "Archival"],
              useCases: ["Legal document organization", "Case file management", "Knowledge sharing"],
              status: "available"
            },
            // {
            //   id: "civil-law-property-dispute",
            //   name: "Property & Land Dispute Management",
            //   summary: "Streamline dispute intake, title verification, evidence collection, and court filings.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Dispute intake", "Title verification", "Partition analysis", "Evidence collection", "Precedent search", "Draft petition", "Court filing", "Mediation/Negotiation", "Hearing management", "Judgment recording"],
            //   useCases: ["Land disputes", "Property claims", "Partition litigation"],
            // },
            // {
            //   id: "civil-law-family-matters",
            //   name: "Family & Succession Matters",
            //   summary: "Handle case intake, document collection, mediation, court filings, and order issuance.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Case intake", "Marriage/Divorce paperwork collection", "Custody/Inheritance documentation", "Mediation scheduling", "Agreement drafting", "Court filing", "Hearing management", "Order issuance", "Archival"],
            //   useCases: ["Divorce cases", "Custody disputes", "Inheritance matters"],
            // },
            // {
            //   id: "civil-law-contractual-consumer",
            //   name: "Contractual & Consumer Disputes",
            //   summary: "Manage complaints, contract review, evidence gathering, and dispute resolution.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Complaint intake", "Contract review", "Evidence gathering", "Filing", "Counter-party notification", "Negotiation support", "Resolution suggestion", "Settlement agreement drafting", "Case closure"],
            //   useCases: ["Contract disputes", "Consumer claims", "Arbitration cases"],
            // },
          ]
        },
        {
          id: "criminal-law",
          name: "Criminal Law",
          description: "Criminal defense, bail proceedings, and court representation",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "criminal-law-intake-defense",
            //   name: "Criminal Case Intake & Defense",
            //   summary: "Automate client intake, offense classification, bail applications, evidence collection, and defense strategy generation.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Client intake", "FIR/Charge-sheet review", "Offense classification", "Bail application drafting", "Evidence collection", "Witness identification", "Defense strategy generation", "Court filing", "Hearing management", "Appeal planning"],
            //   useCases: ["Criminal defense", "Court representation", "Appeals management"],
            // },
            // {
            //   id: "criminal-law-bail-remand",
            //   name: "Bail & Remand Proceedings",
            //   summary: "Manage arrest notification, bail applications, risk assessment, court filings, and order tracking.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Arrest notification", "Bail application drafting", "Risk assessment", "Argument preparation", "Court filing", "Hearing scheduling", "Court argument summary", "Bail order tracking"],
            //   useCases: ["Bail applications", "Remand proceedings", "Court compliance tracking"],
            // },
          ]
        },
        {
          id: "corporate-law",
          name: "Corporate Law",
          description: "Contract management, M&A transactions, and corporate compliance",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "corporate-law-contract-lifecycle",
            //   name: "Contract Lifecycle Management",
            //   summary: "Oversee contract requests, clause suggestions, negotiation, approvals, and obligations.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Contract request intake", "Template selection", "Clause suggestion", "Risk clause detection", "Negotiation support", "Approval routing", "E-signature tracking", "Obligation monitoring", "Renewal alerts", "Archival"],
            //   useCases: ["Corporate contracts", "M&A agreements", "Compliance tracking"],
            // },
            // {
            //   id: "corporate-law-ma",
            //   name: "Mergers & Acquisitions (M&A) Workflow",
            //   summary: "Manage deal intake, due diligence, agreement drafting, regulator filing, and transaction closing.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Deal intake", "Due diligence", "Risk & liability analysis", "Drafting agreements", "Approval routing", "Regulator filing", "Transaction closing", "Compliance certification"],
            //   useCases: ["Corporate acquisitions", "M&A transactions", "Regulatory compliance"],
            // },
          ]
        },
        {
          id: "legal-support",
          name: "Legal Support",
          description: "Paralegal services, document management, and research support",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "contract-management",
            //   name: "Contract Management",
            //   summary: "Handle intake, indexing, version control, secure storage, audit logging, and sharing.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Document intake", "Metadata tagging", "Indexing", "Version control", "Secure storage", "Retrieval", "Audit logging", "Document sharing", "Access control", "Archival"],
            //   useCases: ["Legal document organization", "Case file management", "Knowledge sharing"],
            //   status: "available"
            // },
            // {
            //   id: "paralegal-document-management",
            //   name: "Document Management Workflow",
            //   summary: "Handle intake, indexing, version control, secure storage, audit logging, and sharing.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Document intake", "Metadata tagging", "Indexing", "Version control", "Secure storage", "Retrieval", "Audit logging", "Document sharing", "Access control", "Archival"],
            //   useCases: ["Legal document organization", "Case file management", "Knowledge sharing"],
            // },
            // {
            //   id: "paralegal-research-support",
            //   name: "Research Support Workflow",
            //   summary: "Support legal queries, database searches, statute extraction, precedent highlighting, and draft compilation.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Legal query assignment", "Database search", "Statute extraction", "Precedent highlighting", "Legal note creation", "Draft compilation", "Attorney review prep", "Knowledge library update"],
            //   useCases: ["Legal research", "Case preparation", "Precedent analysis"],
            // },
            // {
            //   id: "legal-it-knowledge-management",
            //   name: "Knowledge Base & Legal Tech Management Workflow",
            //   summary: "Manage legal document collection, metadata structuring, AI model prep, and chatbot support.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Legal document collection", "Metadata structuring", "AI model training data prep", "Search indexing", "Knowledge graph linking", "Update & maintenance", "User access management", "Legal chatbot support", "Analytics reporting", "Continuous improvement"],
            //   useCases: ["Legal tech management", "Knowledge base upkeep", "AI-assisted legal research"]
            // }
          ]
        },
        {
          id: "compliance-administration",
          name: "Compliance & Administration",
          description: "Regulatory compliance, court administration, and legal operations",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "compliance-officers",
            //   name: "Regulatory Compliance & Monitoring Workflow",
            //   summary: "Detect regulation updates, assess compliance risk, and manage audits and remediation.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Regulation update detection", "Policy mapping", "Compliance risk analysis", "Internal control check", "Audit report drafting", "Violation flagging", "Remediation suggestion", "Compliance dashboard update", "Regulator communication", "Compliance certification"],
            //   useCases: ["Corporate compliance", "Regulatory monitoring", "Internal audits"],
            // },
            // {
            //   id: "judges-mediators",
            //   name: "Case Adjudication & Dispute Resolution Workflow",
            //   summary: "Support case assignment, document review, evidence summarization, and decision drafting.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Case assignment", "Document review", "Evidence summarization", "Precedent analysis", "Hearing scheduling", "Argument summarization", "Neutral evaluation", "Decision drafting", "Order issuance", "Appeal management"],
            //   useCases: ["Court adjudication", "Mediation", "Dispute resolution"],
            // },
            // {
            //   id: "billing-finance",
            //   name: "Legal Billing & Time Tracking Workflow",
            //   summary: "Manage activity logging, time capture, invoice drafting, expense reconciliation, and reporting.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Activity logging", "Time capture", "Rate validation", "Billable hour allocation", "Invoice drafting", "Expense reconciliation", "Client approval routing", "Payment tracking", "Dispute resolution", "Billing analytics reporting"],
            //   useCases: ["Law firm billing", "Time tracking", "Financial reporting"],
            // },
          ]
        }
      ]
    }
    ,
    {
      id: "healthcare",
      name: "Healthcare",
      description: "PHI-aware agents with clinical context and auditability.",
      image: "/industry/Healthcare.png",
      subCategories: [
        {
          id: "clinical-care",
          name: "Clinical Care",
          description: "Primary care, specialist consultations, and direct patient treatment",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "primary-care",
            //   name: "Primary Care Workflow",
            //   summary: "Manage patient registration, exams, diagnosis, treatment, and follow-up.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Patient registration", "History review", "Examination", "Diagnosis", "Treatment planning", "Medication prescription", "Patient education", "Follow-up scheduling"],
            //   useCases: ["Routine checkups", "Chronic disease management", "Preventive screenings"],

            // },
            // {
            //   id: "healthcare-appoinment-classifier",
            //   name: "Healthcare Appointment Classifier",
            //   summary: "Classify and route healthcare appointments based on patient needs.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Appointment classification", "Patient need assessment", "Referral routing"],
            //   useCases: ["Primary care appointments", "Specialist referrals", "Telehealth consultations"],
            //   status: "available"
            // },
            // {
            //   id: "specialist-consultation",
            //   name: "Specialist Consultation Workflow",
            //   summary: "Coordinate referrals, assessments, diagnostics, and treatment recommendations.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Referral review", "Patient history analysis", "Specialized assessment", "Advanced diagnostics", "Treatment recommendation", "Progress monitoring", "Outcome evaluation"],
            //   useCases: ["Specialist consultations", "Interdisciplinary care", "Complex case management"],
            // },
            // {
            //   id: "diagnosis-treatment",
            //   name: "Diagnosis & Treatment Workflow",
            //   summary: "Streamline symptom assessment, test ordering, diagnosis, and treatment protocols.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Symptom assessment", "Test ordering", "Result analysis", "Diagnosis formulation", "Treatment protocol selection", "Medication management", "Outcome assessment"],
            //   useCases: ["Patient treatment plans", "Clinical decision support", "Monitoring treatment effectiveness"],
            // },
            // {
            //   id: "primary-care-delivery",
            //   name: "Primary Care Delivery Workflow",
            //   summary: "Manage intake, health assessment, care planning, treatment, and documentation.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Patient intake", "Health assessment", "Vital signs collection", "Care planning", "Treatment implementation", "Counseling", "Documentation", "Care coordination"],
            //   useCases: ["Routine care delivery", "Patient monitoring", "Coordinated care plans"],
            // },
          ]
        },
        {
          id: "chronic-preventive-care",
          name: "Chronic & Preventive Care",
          description: "Long-term condition management and preventive healthcare services",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "chronic-disease-management",
            //   name: "Chronic Disease Management Workflow",
            //   summary: "Support ongoing assessment, education, monitoring, and outcome tracking for chronic conditions.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Disease status assessment", "Risk evaluation", "Medication review", "Lifestyle assessment", "Care plan adjustment", "Self-management education", "Progress monitoring", "Complication prevention", "Outcome tracking"],
            //   useCases: ["Diabetes management", "Cardiac care", "Long-term condition monitoring"],
            // },
            // {
            //   id: "preventive-care",
            //   name: "Preventive Care Workflow",
            //   summary: "Enable risk screening, immunization, lifestyle counseling, and wellness planning.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Risk screening", "Health maintenance review", "Immunization assessment", "Lifestyle counseling", "Preventive service planning", "Screening schedule development", "Wellness planning", "Follow-up coordination"],
            //   useCases: ["Preventive health checkups", "Vaccination tracking", "Wellness programs"],
            // },
            // {
            //   id: "patient-education",
            //   name: "Patient Education Workflow",
            //   summary: "Provide educational resources, verify comprehension, and plan adherence.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Learning needs assessment", "Content preparation", "Education delivery", "Comprehension testing", "Follow-up education"],
            //   useCases: ["Patient education", "Health literacy improvement", "Behavioral adherence"],
            // },
            // {
            //   id: "patient-counseling",
            //   name: "Patient Counseling Workflow",
            //   summary: "Conduct counseling sessions, goal setting, strategy development, and progress evaluation.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Needs assessment", "Session planning", "Rapport building", "Information gathering", "Problem exploration", "Goal setting", "Strategy development", "Action planning", "Progress evaluation"],
            //   useCases: ["Mental health counseling", "Lifestyle coaching", "Behavior change support"],
            // },
          ]
        },
        {
          id: "diagnostics-testing",
          name: "Diagnostics & Testing",
          description: "Laboratory testing, imaging, and diagnostic equipment management",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "Lab-results-extractor",
            //   name: "Lab Results Extractor",
            //   summary: "Manage sample collection, processing, analysis, quality control, and reporting.",
            //   image: "/placeholder.jpg",
            //   status: "available",
            //   solutions: ["Sample collection", "Processing", "Test preparation", "Analysis execution", "Quality control", "Result validation", "Data recording", "Report generation", "Result communication"],
            //   useCases: ["Lab diagnostics", "Quality assurance", "Clinical testing workflow"],
            // },
            // {
            //   id: "diagnostic-imaging",
            //   name: "Diagnostic Imaging Workflow",
            //   summary: "Handle imaging from patient prep to result documentation and communication.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Patient preparation", "Equipment setup", "Image acquisition", "Image processing", "Quality assessment", "Image analysis", "Result documentation", "Report preparation", "Communication to radiologist"],
            //   useCases: ["Radiology workflow", "Imaging diagnostics", "Patient result delivery"],
            // },
            // {
            //   id: "equipment-operation",
            //   name: "Equipment Operation Workflow",
            //   summary: "Maintain, monitor, and operate medical equipment efficiently.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Equipment inspection", "Calibration", "Maintenance scheduling", "Operation monitoring", "Troubleshooting", "Repair coordination", "Documentation", "Performance tracking", "Replacement planning"],
            //   useCases: ["Medical device management", "Operational readiness", "Preventive maintenance"],
            // },
            // {
            //   id: "quality-control",
            //   name: "Quality Control Workflow",
            //   summary: "Ensure quality across clinical processes through monitoring, analysis, and improvement.",
            //   image: "/placeholder.jpg",
            //   solutions: ["QC planning", "Sample preparation", "Control testing", "Result analysis", "Trend monitoring", "Deviation investigation", "Corrective action", "Documentation", "Continuous improvement"],
            //   useCases: ["Laboratory QC", "Clinical process validation", "Continuous quality improvement"],
            // },
          ]
        },
        {
          id: "healthcare-operations",
          name: "Healthcare Operations",
          description: "Administrative, financial, and operational management workflows",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "operations-management",
            //   name: "Operations Management Workflow",
            //   summary: "Optimize resource allocation, staff coordination, process efficiency, and continuous improvement.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Operational planning", "Resource allocation", "Staff coordination", "Process optimization", "Performance monitoring", "Quality assurance", "Efficiency analysis", "Problem resolution", "Continuous improvement"],
            //   useCases: ["Hospital operations", "Clinic workflow optimization", "Process improvement initiatives"],
            // },
            {
              id: "Doc-Sentra",
              name: "DocSentra",
              summary: " AI-driven healthcare automation platform integrating clinical intelligence, conversational AI, and smart workflow management to enhance patient care, diagnosis accuracy, and operational efficiency.",
              image: "/placeholder.jpg",
              solutions: ["Doctor Assistant","Patient Management","Medical Documentation","Prescription Management","Clinical Decision Support","Health Record Management"],
              useCases: ["Hospital operations", "Clinic workflow optimization", "Process improvement initiatives"],
              status: "available"
            },
            // {
            //   id: "financial-oversight",
            //   name: "Financial Oversight Workflow",
            //   summary: "Manage budgets, revenue, costs, reporting, ROI analysis, and compliance.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Budget planning", "Revenue analysis", "Cost management", "Financial reporting", "Expense monitoring", "ROI analysis", "Forecasting", "Audit coordination", "Compliance monitoring"],
            //   useCases: ["Hospital finance management", "Cost tracking", "Revenue optimization"],
            // },
            // {
            //   id: "resource-planning",
            //   name: "Resource Planning Workflow",
            //   summary: "Plan and optimize healthcare resources, staffing, and capacity.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Demand forecasting", "Capacity planning", "Resource assessment", "Allocation strategy", "Scheduling optimization", "Utilization monitoring", "Efficiency improvement", "Cost optimization", "Performance tracking"],
            //   useCases: ["Staffing optimization", "Resource allocation", "Operational efficiency"],
            // },
            // {
            //   id: "compliance-monitoring",
            //   name: "Compliance Monitoring Workflow",
            //   summary: "Ensure regulatory compliance through audits, gap analysis, and continuous monitoring.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Regulatory assessment", "Policy review", "Compliance auditing", "Gap analysis", "Corrective action planning", "Training coordination", "Documentation management", "Reporting preparation", "Continuous monitoring"],
            //   useCases: ["Healthcare regulations adherence", "Patient safety compliance", "Internal audits"],
            // },
          ]
        },
        {
          id: "patient-support",
          name: "Patient Support",
          description: "Direct patient care assistance and support services",
          image: "/placeholder.jpg",
          agents: [
            // {
            //   id: "patient-care-assistance",
            //   name: "Patient Care Assistance Workflow",
            //   summary: "Support direct patient care including reception, personal care, and vital signs monitoring.",
            //   image: "/placeholder.jpg",
            //   solutions: ["Patient reception", "Basic assessment", "Comfort measures", "Mobility assistance", "Personal care", "Vital signs monitoring", "Communication support", "Safety monitoring", "Documentation"],
            //   useCases: ["Nursing support", "Patient mobility assistance", "Inpatient care"],
            // },
          ]
        }
      ]
    }
    ,
    {
      id: "agriculture",
      name: "Agriculture",
      description: "Smart solutions for farming and agricultural management.",
      image: "/industry/Agriculture.png",
      subCategories: [
        {
          id: "crop-production-agent",
          name: "Crop Production Agent",
          summary: "AI-driven workflow for managing crop lifecycle from land preparation to sale.",
          image: "/placeholder.jpg",
          solutions: [
            "Soil Analysis Agent",
            "Seed Selection Agent",
            "Sowing Scheduler Agent",
            "Irrigation Optimizer Agent",
            "Fertilizer Recommendation Agent",
            "Pest Detection Agent",
            "Harvest Planning Agent",
            "Storage Assistant Agent",
            "Market Linkage Agent"
          ],
          "useCases": [
            "Precision farming",
            "Smart irrigation",
            "Fertilizer optimization",
            "Pest management",
            "Harvest timing decisions",
            "Post-harvest logistics",
            "Farmer-market connections"
          ]
        },
        {
          "id": "farm-maintenance-agent",
          "name": "Farm Maintenance Agent",
          "summary": "Automates soil testing, equipment upkeep, labor scheduling, and compliance tracking.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Soil Testing Agent",
            "Equipment Maintenance Agent",
            "Labor Scheduling Agent",
            "Farm Records Agent",
            "Compliance Assistant Agent"
          ],
          "useCases": [
            "Soil health monitoring",
            "Predictive equipment maintenance",
            "Labor planning",
            "Digital farm logs",
            "Regulatory compliance support"
          ]
        },
        {
          "id": "sustainable-farming-agent",
          "name": "Sustainable Farming Agent",
          "summary": "Supports eco-friendly practices with certification, rotation planning, and resource optimization.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Certification Coordinator Agent",
            "Rotation Planner Agent",
            "Resource Optimizer Agent",
            "Sustainability Tracker Agent"
          ],
          "useCases": [
            "Sustainable agriculture adoption",
            "Organic farming certification",
            "Efficient resource management",
            "Carbon footprint monitoring"
          ]
        },
        {
          "id": "labor-management-agent",
          "name": "Labor Management Agent",
          "summary": "Streamlines agricultural labor assignment, tracking, and wage processing.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Job Assignment Agent",
            "Task Tracking Agent",
            "Attendance Agent",
            "Wage Processing Agent"
          ],
          "useCases": [
            "Labor assignment",
            "Work progress monitoring",
            "Attendance tracking",
            "Wage calculation & payment"
          ]
        },
        {
          "id": "skill-development-agent",
          "name": "Skill Development Agent",
          "summary": "Facilitates agricultural workforce training and certification.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Training Needs Agent",
            "Training Content Agent",
            "Performance Evaluation Agent",
            "Certification Agent"
          ],
          "useCases": [
            "Skill gap analysis",
            "Training content delivery",
            "Performance assessment",
            "Certification issuance"
          ]
        },
        {
          "id": "seed-fertilizer-distribution-agent",
          "name": "Seed & Fertilizer Distribution Agent",
          "summary": "Manages agri-input distribution from demand collection to billing.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Demand Collection Agent",
            "Inventory Tracking Agent",
            "Pricing Agent",
            "Delivery Scheduler Agent",
            "Billing Agent"
          ],
          "useCases": [
            "Input demand forecasting",
            "Stock management",
            "Dynamic pricing",
            "Delivery logistics",
            "Automated billing"
          ]
        },
        {
          "id": "advisory-agent",
          "name": "Advisory Agent",
          "summary": "Delivers personalized product recommendations and collects farmer feedback.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Recommendation Agent",
            "Usage Guide Agent",
            "Feedback Collector Agent"
          ],
          "useCases": [
            "Product recommendations",
            "Usage guidelines",
            "Farmer feedback management"
          ]
        },
        {
          "id": "water-management-agent",
          "name": "Water Management Agent",
          "summary": "Optimizes irrigation with requirement analysis, scheduling, and monitoring.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Requirement Analyzer Agent",
            "Scheduling Agent",
            "Distribution Agent",
            "Monitoring Agent",
            "Reporting Agent"
          ],
          "useCases": [
            "Smart irrigation",
            "Water scheduling",
            "Distribution management",
            "Real-time monitoring",
            "Usage reporting"
          ]
        },
        {
          "id": "infrastructure-maintenance-agent",
          "name": "Infrastructure Maintenance Agent",
          "summary": "Automates inspection, repair, and compliance of irrigation infrastructure.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Inspection Agent",
            "Repair Assignment Agent",
            "Quality Check Agent",
            "Documentation Agent"
          ],
          "useCases": [
            "Pipeline inspection",
            "Repair tracking",
            "Quality verification",
            "Digital documentation"
          ]
        },
        {
          "id": "crop-research-agent",
          "name": "Crop Research Agent",
          "summary": "Supports agronomists with data-driven crop field research and publication.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Field Study Agent",
            "Data Collection Agent",
            "Data Analysis Agent",
            "Recommendation Agent",
            "Publication Agent"
          ],
          "useCases": [
            "Field surveys",
            "Data-driven research",
            "Agronomy recommendations",
            "Research publication support"
          ]
        },
        {
          "id": "experiment-agent",
          "name": "Experiment Agent",
          "summary": "Enables agricultural experimentation from hypothesis to knowledge sharing.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Hypothesis Agent",
            "Experiment Setup Agent",
            "Monitoring Agent",
            "Result Analyzer Agent",
            "Knowledge Sharing Agent"
          ],
          "useCases": [
            "Experimental design",
            "Research monitoring",
            "Result analysis",
            "Knowledge dissemination"
          ]
        },
        {
          "id": "policy-implementation-agent",
          "name": "Policy Implementation Agent",
          "summary": "Automates agricultural policy drafting, enforcement, and monitoring.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Drafting Agent",
            "Approval Agent",
            "Communication Agent",
            "Enforcement Agent",
            "Monitoring Agent",
            "Reporting Agent"
          ],
          "useCases": [
            "Policy automation",
            "Regulatory approvals",
            "Policy enforcement",
            "Compliance reporting"
          ]
        },
        {
          "id": "subsidy-agent",
          "name": "Subsidy Agent",
          "summary": "Manages subsidy applications, approvals, disbursement, and auditing.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Application Intake Agent",
            "Verification Agent",
            "Approval Agent",
            "Disbursement Agent",
            "Audit Agent"
          ],
          "useCases": [
            "Subsidy applications",
            "Eligibility verification",
            "Approval workflow",
            "Fund disbursement",
            "Auditing & transparency"
          ]
        },
        {
          "id": "collective-marketing-agent",
          "name": "Collective Marketing Agent",
          "summary": "Enables farmer cooperatives to aggregate produce and negotiate prices.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Aggregation Agent",
            "Price Negotiator Agent",
            "Bulk Sale Agent",
            "Revenue Distribution Agent"
          ],
          "useCases": [
            "Collective aggregation",
            "Bulk sales",
            "Revenue distribution",
            "Price negotiations"
          ]
        },
        {
          "id": "training-support-agent",
          "name": "Training & Support Agent",
          "summary": "Delivers structured training programs and feedback for farmers.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Training Needs Agent",
            "Program Design Agent",
            "Implementation Agent",
            "Feedback Agent"
          ],
          "useCases": [
            "Farmer skill building",
            "Program development",
            "Training execution",
            "Feedback collection"
          ]
        },
        {
          "id": "procurement-agent",
          "name": "Procurement Agent",
          "summary": "Automates trader procurement process from farmer outreach to payment.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Outreach Agent",
            "Price Negotiator Agent",
            "Purchase Agent",
            "Logistics Agent",
            "Payment Agent"
          ],
          "useCases": [
            "Farmer engagement",
            "Price negotiations",
            "Purchase processing",
            "Logistics coordination",
            "Trader payment automation"
          ]
        },
        {
          "id": "distribution-agent",
          "name": "Distribution Agent",
          "summary": "Optimizes product sorting, allocation, transport, and buyer delivery.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Sorting Agent",
            "Allocation Agent",
            "Transport Agent",
            "Delivery Agent"
          ],
          "useCases": [
            "Product distribution",
            "Buyer delivery",
            "Transport logistics",
            "Allocation optimization"
          ]
        },
        {
          "id": "processing-agent",
          "name": "Processing Agent",
          "summary": "Streamlines food processing from procurement to distribution.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Procurement Agent",
            "Cleaning Agent",
            "Processing Agent",
            "Packaging Agent",
            "Quality Testing Agent",
            "Distribution Agent"
          ],
          "useCases": [
            "Raw material procurement",
            "Food processing automation",
            "Packaging optimization",
            "Quality testing",
            "Distribution support"
          ]
        },
        {
          "id": "compliance-agent",
          "name": "Compliance Agent",
          "summary": "Ensures safety, certification, and reporting in food supply chain.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Safety Check Agent",
            "Certification Agent",
            "Documentation Agent",
            "Reporting Agent"
          ],
          "useCases": [
            "Food safety compliance",
            "Certification management",
            "Documentation automation",
            "Regulatory reporting"
          ]
        },
        {
          "id": "export-agent",
          "name": "Export Agent",
          "summary": "Manages agricultural exports from market research to payment.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Market Research Agent",
            "Buyer Identification Agent",
            "Pricing Agent",
            "Quality Assurance Agent",
            "Documentation Agent",
            "Shipping Agent",
            "Payment Agent"
          ],
          "useCases": [
            "Export planning",
            "Market identification",
            "Pricing strategy",
            "Export quality compliance",
            "Shipping logistics",
            "Payment processing"
          ]
        },
        {
          "id": "import-agent",
          "name": "Import Agent",
          "summary": "Automates agricultural imports from supplier search to delivery.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Supplier Search Agent",
            "Negotiation Agent",
            "Compliance Agent",
            "Customs Clearance Agent",
            "Delivery Agent"
          ],
          "useCases": [
            "Supplier identification",
            "Import negotiations",
            "Regulatory compliance",
            "Customs processing",
            "Delivery tracking"
          ]
        },
        {
          "id": "technology-deployment-agent",
          "name": "Technology Deployment Agent",
          "summary": "Supports agri-tech solutions from analysis to deployment and support.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Requirement Analysis Agent",
            "Solution Design Agent",
            "Development Agent",
            "Testing Agent",
            "Deployment Agent",
            "Support Agent"
          ],
          "useCases": [
            "Agri-tech development",
            "Solution deployment",
            "Testing & validation",
            "Tech support"
          ]
        },
        {
          "id": "data-analytics-agent",
          "name": "Data Analytics Agent",
          "summary": "Enables data-driven agriculture insights and decision-making.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Data Collection Agent",
            "Preprocessing Agent",
            "Model Training Agent",
            "Insights Agent",
            "Decision Support Agent"
          ],
          "useCases": [
            "Agricultural data collection",
            "Data preprocessing",
            "AI model training",
            "Insights generation",
            "Decision support"
          ]
        },
        {
          "id": "agri-loan-agent",
          "name": "Agri-Loan Agent",
          "summary": "Simplifies agri-loan workflows from application to repayment monitoring.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Loan Application Agent",
            "Credit Check Agent",
            "Appraisal Agent",
            "Approval Agent",
            "Disbursement Agent",
            "Repayment Monitoring Agent"
          ],
          "useCases": [
            "Loan processing",
            "Credit checks",
            "Loan approval",
            "Fund disbursement",
            "Repayment monitoring"
          ]
        },
        {
          "id": "insurance-agent",
          "name": "Insurance Agent",
          "summary": "Automates agricultural insurance applications, risk assessment, and claims.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Application Agent",
            "Risk Assessment Agent",
            "Policy Issuance Agent",
            "Claim Request Agent",
            "Claim Settlement Agent"
          ],
          "useCases": [
            "Insurance applications",
            "Risk assessment",
            "Policy issuance",
            "Claims processing",
            "Settlement workflow"
          ]
        },
        {
          "id": "retail-agent",
          "name": "Retail Agent",
          "summary": "Optimizes agri-retail workflows from procurement to customer service.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Procurement Agent",
            "Inventory Manager Agent",
            "Pricing Agent",
            "Sales Agent",
            "Customer Service Agent"
          ],
          "useCases": [
            "Retail procurement",
            "Inventory management",
            "Pricing optimization",
            "Retail sales",
            "Customer support"
          ]
        },
        {
          "id": "wholesale-agent",
          "name": "Wholesale Agent",
          "summary": "Automates wholesale distribution and payment collection for agri-products.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Bulk Purchase Agent",
            "Distribution Agent",
            "Payment Collection Agent",
            "Reporting Agent"
          ],
          "useCases": [
            "Wholesale purchases",
            "Distribution logistics",
            "Payment collection",
            "Reporting automation"
          ]
        },
        {
          "id": "supply-chain-agent",
          "name": "Supply Chain Agent",
          "summary": "Manages agricultural supply chains with transport, tracking, and delivery.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Order Receipt Agent",
            "Route Planning Agent",
            "Transport Agent",
            "Tracking Agent",
            "Delivery Agent",
            "Proof of Delivery Agent"
          ],
          "useCases": [
            "Order management",
            "Transport planning",
            "Delivery tracking",
            "Proof of delivery"
          ]
        },
        {
          "id": "cold-chain-agent",
          "name": "Cold Chain Agent",
          "summary": "Ensures temperature-controlled logistics for agri-products.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Requirement Gathering Agent",
            "Temperature Monitoring Agent",
            "Delivery Agent",
            "Compliance Check Agent"
          ],
          "useCases": [
            "Cold chain logistics",
            "Temperature monitoring",
            "Perishable goods delivery",
            "Compliance verification"
          ]
        },
        {
          "id": "food-purchase-agent",
          "name": "Food Purchase Agent",
          "summary": "Helps consumers purchase food products with comparison and feedback loops.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Need Identification Agent",
            "Product Search Agent",
            "Price Comparison Agent",
            "Purchase Agent",
            "Payment Agent",
            "Feedback Agent"
          ],
          "useCases": [
            "Food purchase automation",
            "Product search",
            "Price comparison",
            "Customer feedback"
          ]
        },
        {
          "id": "consumer-awareness-agent",
          "name": "Consumer Awareness Agent",
          "summary": "Drives consumer awareness with quality checks and campaigns.",
          "image": "/placeholder.jpg",
          "solutions": [
            "Information Agent",
            "Quality Check Agent",
            "Awareness Campaign Agent",
            "Participation Agent"
          ],
          "useCases": [
            "Consumer education",
            "Product quality awareness",
            "Awareness campaigns",
            "Consumer participation"
          ]
        }
      ],
    },
    {
      id: "manufacturing",
      name: "Manufacturing",
      description: "Automation and optimization for manufacturing processes.",
      image: "/industry/Manufacturing.png",
      agents: [
        // {
        //   id: "rnd-innovation",
        //   name: "R&D & Innovation Workflow",
        //   summary: "Support material research, prototyping, and scaling innovations into manufacturing.",
        //   image: "/industry/Manufacturing.png",
        //   solutions: ["Research automation", "Prototype generation", "Testing & validation", "Scale-up management"],
        //   useCases: ["Material development", "New product innovation", "Chemical formulations"],
        // },
        // {
        //   id: "design",
        //   name: "Design Workflow",
        //   summary: "Streamline product design from concept to validation.",
        //   image: "/industry/Manufacturing.png",
        //   solutions: ["Concept ideation", "CAD automation", "Simulation & validation"],
        //   useCases: ["Industrial design", "Product development", "Design optimization"],
        // },
        // {
        //   id: "planning",
        //   name: "Planning Workflow",
        //   summary: "Optimize production planning and scheduling.",
        //   image: "/industry/Manufacturing.png",
        //   solutions: ["Demand forecasting", "Capacity planning", "Resource allocation", "Scheduling"],
        //   useCases: ["Production scheduling", "Capacity optimization", "Resource planning"],
        // },
        // {
        //   id: "procurement",
        //   name: "Procurement Workflow",
        //   summary: "Automate raw material and supplier procurement processes.",
        //   image: "/industry/Manufacturing.png",
        //   solutions: ["Vendor sourcing", "Quotation analysis", "Purchase order automation", "Invoice processing"],
        //   useCases: ["Supplier management", "Material sourcing", "Cost optimization"],
        // },
        // {
        //   id: "production",
        //   name: "Production Workflow",
        //   summary: "Enable seamless shop floor production operations.",
        //   image: "/industry/Manufacturing.png",
        //   solutions: ["Work order assignment", "Machine setup guidance", "Process monitoring", "Shift reporting"],
        //   useCases: ["Assembly line execution", "Machine operations", "Production tracking"],
        // },
        // {
        //   id: "quality",
        //   name: "Quality Workflow",
        //   summary: "Ensure product quality through inspection and compliance.",
        //   image: "/industry/Manufacturing.png",
        //   solutions: ["Inspection planning", "Defect logging", "Root cause analysis", "Compliance reporting"],
        //   useCases: ["Quality assurance", "Defect reduction", "Regulatory compliance"],
        // },
        // {
        //   id: "inventory",
        //   name: "Inventory Workflow",
        //   summary: "Automate inventory and warehouse management.",
        //   image: "/industry/Manufacturing.png",
        //   solutions: ["Stock tracking", "Replenishment planning", "Barcode/label management", "Inventory auditing"],
        //   useCases: ["Warehouse optimization", "Stock visibility", "Demand-driven replenishment"],
        // },
        // {
        //   id: "maintenance",
        //   name: "Maintenance Workflow",
        //   summary: "Enable predictive and preventive maintenance for equipment.",
        //   image: "/industry/Manufacturing.png",
        //   solutions: ["Condition monitoring", "Preventive maintenance", "Breakdown handling", "Spare parts management"],
        //   useCases: ["Equipment uptime", "Predictive maintenance", "Failure reduction"],
        // },
        // {
        //   id: "logistics",
        //   name: "Logistics Workflow",
        //   summary: "Optimize shipping and delivery coordination.",
        //   image: "/industry/Manufacturing.png",
        //   solutions: ["Shipment scheduling", "Route optimization", "Delivery tracking", "Returns handling"],
        //   useCases: ["Global shipments", "Distribution optimization", "Returns management"],
        // },
        // {
        //   id: "sales-aftermarket",
        //   name: "Sales & Aftermarket Workflow",
        //   summary: "Support customer orders, after-sales, and warranty handling.",
        //   image: "/industry/Manufacturing.png",
        //   solutions: ["Quotation generation", "Order confirmation", "After-sales support", "Warranty handling"],
        //   useCases: ["Customer orders", "After-sales engagement", "Service management"],
        // },
        // {
        //   id: "continuous-improvement",
        //   name: "Continuous Improvement Workflow",
        //   summary: "Drive continuous improvement through KPI monitoring and bottleneck detection.",
        //   image: "/industry/Manufacturing.png",
        //   solutions: ["KPI tracking", "Bottleneck detection", "Improvement planning", "Performance reporting"],
        //   useCases: ["Lean manufacturing", "Process optimization", "Operational efficiency"],
        // },
        // {
        //   id: "engineering",
        //   name: "Engineering Workflow",
        //   summary: "Optimize manufacturing process engineering and change management.",
        //   image: "/industry/Manufacturing.png",
        //   solutions: ["Process design", "Engineering simulation", "Tooling management", "Change management"],
        //   useCases: ["Process optimization", "Tooling automation", "Engineering change requests"],
        // },
        // {
        //   id: "safety-compliance",
        //   name: "Safety & Compliance Workflow",
        //   summary: "Ensure workplace safety and regulatory compliance.",
        //   image: "/industry/Manufacturing.png",
        //   solutions: ["Risk assessment", "Safety training", "Incident reporting", "Audit management"],
        //   useCases: ["Workplace safety", "Compliance audits", "Environmental protection"],
        // },
        // {
        //   id: "workforce-management",
        //   name: "Workforce Management Workflow",
        //   summary: "Plan and manage workforce scheduling, performance, and engagement.",
        //   image: "/industry/Manufacturing.png",
        //   solutions: ["Recruitment automation", "Training & development", "Shift scheduling", "Performance tracking"],
        //   useCases: ["Workforce optimization", "Employee engagement", "HR efficiency"],
        // },
        // {
        //   id: "it-systems",
        //   name: "IT & Systems Workflow",
        //   summary: "Automate IT infrastructure and cybersecurity for manufacturing systems.",
        //   image: "/industry/Manufacturing.png",
        //   solutions: ["System integration", "Cybersecurity", "Data governance", "System monitoring"],
        //   useCases: ["Smart factory IT", "Cybersecurity compliance", "System reliability"],
        // },
        // {
        //   id: "supply-chain",
        //   name: "Supply Chain Workflow",
        //   summary: "End-to-end supply chain coordination and optimization.",
        //   image: "/industry/Manufacturing.png",
        //   solutions: ["Demand planning", "Supplier collaboration", "Inventory replenishment", "Logistics coordination"],
        //   useCases: ["Global supply chains", "Supplier visibility", "Resilient operations"],
        // },
        // {
        //   id: "customer-support",
        //   name: "Customer Support Workflow",
        //   summary: "Handle customer inquiries, issues, and feedback collection.",
        //   image: "/industry/Manufacturing.png",
        //   solutions: ["Inquiry handling", "Order tracking", "Issue resolution", "Feedback collection"],
        //   useCases: ["Customer satisfaction", "Aftermarket support", "Issue management"],
        // },
        // {
        //   id: "financial-management",
        //   name: "Financial Management Workflow",
        //   summary: "Manage cost efficiency and profitability across operations.",
        //   image: "/industry/Manufacturing.png",
        //   solutions: ["Budgeting automation", "Cost tracking", "Variance analysis", "Profitability reporting"],
        //   useCases: ["Cost reduction", "Financial planning", "Profitability optimization"],
        // },
        // {
        //   id: "sustainability-esg",
        //   name: "Sustainability & ESG Workflow",
        //   summary: "Support sustainable manufacturing practices and ESG compliance.",
        //   image: "/industry/Manufacturing.png",
        //   solutions: ["Carbon footprint tracking", "Waste management", "Energy optimization", "Sustainability reporting"],
        //   useCases: ["Green manufacturing", "ESG compliance", "Energy-efficient operations"],
        // }
      ]
    }
    ,
    {
      id: "banking",
      name: "Banking",
      description: "Secure and compliant agents for banking operations.",
      image: "/industry/Banking.png",
      agents: [
        // {
        //   "id": "retail-banker-onboarding",
        //   "name": "Retail Banker - Account Opening & KYC",
        //   "summary": "Streamline customer onboarding, KYC, and account creation with compliance.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Identity verification", "Risk scoring", "KYC/AML checks"],
        //   "useCases": ["Customer onboarding", "Regulatory compliance", "Account setup"]
        // },
        // {
        //   "id": "retail-banker-loans",
        //   "name": "Retail Banker - Loan Processing",
        //   "summary": "Automate loan application review, credit checks, and disbursals.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Credit scoring", "Risk analysis", "Document verification"],
        //   "useCases": ["Loan approval", "Credit assessment", "Repayment tracking"]
        // },
        // {
        //   "id": "corporate-banker-trade-finance",
        //   "name": "Corporate Banker - Trade Finance",
        //   "summary": "Digitize trade finance approvals with fraud checks and compliance.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Document validation", "Fraud detection", "Compliance monitoring"],
        //   "useCases": ["LC processing", "Invoice validation", "Transaction settlement"]
        // },
        // {
        //   "id": "corporate-banker-treasury",
        //   "name": "Corporate Banker - Treasury Services",
        //   "summary": "Optimize liquidity, risk, and investment decisions for corporates.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Cash flow forecasting", "FX/derivatives risk", "Investment recommendations"],
        //   "useCases": ["Liquidity analysis", "Treasury planning", "Financial reporting"]
        // },
        // {
        //   "id": "compliance-fraud-monitoring",
        //   "name": "Compliance Officer - Fraud & Risk Monitoring",
        //   "summary": "Monitor transactions and detect suspicious patterns in real time.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Transaction monitoring", "Pattern recognition", "Fraud detection"],
        //   "useCases": ["AML monitoring", "Suspicious activity reports", "Regulatory filing"]
        // },
        // {
        //   "id": "compliance-regulatory",
        //   "name": "Compliance Officer - Regulatory Compliance",
        //   "summary": "Ensure adherence to financial regulations and automate reporting.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Rule mapping", "Breach detection", "Audit trail creation"],
        //   "useCases": ["Regulatory checks", "Automated reporting", "Audit readiness"]
        // },
        // {
        //   "id": "customer-support-service",
        //   "name": "Customer Support - Service Requests",
        //   "summary": "Resolve banking service requests efficiently with automation.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Query intake", "Knowledge base responses", "Escalation management"],
        //   "useCases": ["Balance queries", "Loan/card service", "Transaction help"]
        // },
        // {
        //   "id": "relationship-wealth",
        //   "name": "Relationship Manager - Wealth Management",
        //   "summary": "Provide tailored wealth management with AI-driven recommendations.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Risk profiling", "Portfolio analysis", "Product matching"],
        //   "useCases": ["Investment advice", "Portfolio monitoring", "Rebalancing"]
        // }
      ],
    },
    {
      id: "fintech",
      name: "Fintech",
      description: "Innovative solutions for financial technology applications.",
      image: "/industry/Fintech.png",
      agents: [
        {
  "id": "lead-management",
  "name": "Lead Management",
  "summary": "End-to-end AI-powered lead management that qualifies, scores, and nurtures leads with automated outreach and conversion tracking.",
  "image": "/industry/LeadManagement.png",
  "solutions": [
    "Lead qualification and scoring",
    "Personalized outreach automation",
    "Engagement tracking",
    "Conversion management"
  ],
  "useCases": [
    "Lead nurturing workflow",
    "Sales automation",
    "Customer conversion tracking"
  ],
  "status": "available"
},

        // {
        //   "id": "Lead-Genearation",
        //   "name": "Lead Generation",
        //   "summary": "Sales Lead Generation - Find and qualify high-potential prospects automatically.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Prospect identification", "Lead scoring", "Outreach automation", "Engagement tracking"],
        //   "useCases": ["B2B lead generation", "Account-based marketing", "Sales pipeline growth"],
        //   status: "available"
        // },
        //         {
        //   "id": "lead-qualification",
        //   "name": "Lead Qualification",
        //   "summary": "Automatically qualify leads based on engagement and fit.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Lead scoring", "Engagement tracking", "Fit assessment"],
        //   "useCases": ["Sales qualification", "Marketing automation", "Customer insights"]
        // },
        // {
        //   "id": "invoice-processing",
        //   "name": "Invoice Processing",
        //   "summary": "Convert invoices into instant cash flow with automated verification.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Invoice validation", "Credit checking", "Advance calculation"],
        //   "useCases": ["Invoice funding", "Working capital optimization", "Collections management"],
        //   status: "available"
        // },
        // {
        //   "id": "digital-payments",
        //   "name": "Digital Payments",
        //   "summary": "Enable instant, secure payments across multiple channels with fraud prevention.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Payment initiation", "Authentication", "Fraud detection", "Authorization"],
        //   "useCases": ["Instant payments", "Cross-channel transactions", "Secure settlements"]
        // },
        // {
        //   "id": "personal-lending",
        //   "name": "Personal Lending",
        //   "summary": "Provide fast, automated loan approvals with integrated risk assessments.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Loan application processing", "Credit scoring", "Risk analysis"],
        //   "useCases": ["Instant loan approvals", "Disbursement automation", "Consumer lending"]
        // },
        // {
        //   "id": "investment-management",
        //   "name": "Investment Management",
        //   "summary": "Automate investment decisions, portfolio construction, and performance tracking.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Risk profiling", "Portfolio building", "Rebalancing"],
        //   "useCases": ["Wealth management", "Goal-based investing", "Portfolio monitoring"]
        // },
        // {
        //   "id": "insurance-services",
        //   "name": "Insurance Services",
        //   "summary": "Streamline insurance applications, underwriting, and claims management.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Risk assessment", "Policy generation", "Claims automation"],
        //   "useCases": ["Policy issuance", "Claims processing", "Medical evaluation support"]
        // },
        // {
        //   "id": "buy-now-pay-later",
        //   "name": "Buy Now Pay Later",
        //   "summary": "Offer instant credit decisions and flexible installment plans for e-commerce.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Instant credit check", "Payment splitting", "Collection management"],
        //   "useCases": ["E-commerce checkout financing", "Installment payments", "Default recovery"]
        // },
        // {
        //   "id": "crypto-trading",
        //   "name": "Cryptocurrency Trading",
        //   "summary": "Enable secure crypto trading with liquidity checks and portfolio management.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Market analysis", "Liquidity validation", "Trade execution"],
        //   "useCases": ["Crypto trading", "Exchange settlements", "Wallet updates"]
        // },
        // {
        //   "id": "personal-finance",
        //   "name": "Personal Finance Management",
        //   "summary": "Automate budgeting, expense tracking, and financial goal setting.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Transaction categorization", "Spending analysis", "Recommendations"],
        //   "useCases": ["Budget automation", "Financial planning", "Expense insights"]
        // },
        // {
        //   "id": "credit-score-monitoring",
        //   "name": "Credit Score Monitoring",
        //   "summary": "Monitor and improve credit health with automated insights and alerts.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Score analysis", "Improvement recommendations", "Dispute management"],
        //   "useCases": ["Credit monitoring", "Risk factor identification", "Credit dispute support"]
        // },
        // {
        //   "id": "merchant-payments",
        //   "name": "Merchant Payment Processing",
        //   "summary": "Securely process business transactions with validation and risk checks.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Merchant validation", "Customer authentication", "Risk assessment"],
        //   "useCases": ["Merchant settlements", "Payment processing", "Business transactions"]
        // },
        // {
        //   "id": "business-lending",
        //   "name": "Business Lending",
        //   "summary": "Automate underwriting and approval for business loans.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Financial statement analysis", "Cash flow assessment", "Loan structuring"],
        //   "useCases": ["SME lending", "Credit evaluation", "Business loan disbursals"]
        // },
        // {
        //   "id": "invoice-financing",
        //   "name": "Invoice Financing",
        //   "summary": "Convert invoices into instant cash flow with automated verification.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Invoice validation", "Credit checking", "Advance calculation"],
        //   "useCases": ["Invoice funding", "Working capital optimization", "Collections management"]
        // },
        // {
        //   "id": "payroll-management",
        //   "name": "Payroll Management",
        //   "summary": "Automate payroll calculations, compliance, and employee payments.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Tax withholding", "Benefits administration", "Payment processing"],
        //   "useCases": ["Payroll automation", "Compliance reporting", "Employee salary disbursal"]
        // },
        // {
        //   "id": "fraud-detection",
        //   "name": "Fraud Detection",
        //   "summary": "Detect and prevent fraudulent activities in real time.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Transaction monitoring", "Pattern recognition", "Risk scoring"],
        //   "useCases": ["Fraud alerts", "Transaction risk detection", "Case resolution"]
        // },
        // {
        //   "id": "aml-kyc",
        //   "name": "AML/KYC Compliance",
        //   "summary": "Ensure compliance with AML and KYC regulations using automation.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Sanctions screening", "Document verification", "Ongoing monitoring"],
        //   "useCases": ["KYC checks", "AML compliance", "Suspicious activity reporting"]
        // },
        // {
        //   "id": "crypto-custody",
        //   "name": "Cryptocurrency Custody",
        //   "summary": "Securely store and manage digital assets with multi-layer security.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Cold storage", "Multi-sig authorization", "Transaction monitoring"],
        //   "useCases": ["Crypto custody", "Asset security", "Regulated audits"]
        // }
      ],
    },
    {
      id: "general",
      name: "General",
      description: "",
      image: "/industry/Fintech.png",
      agents: [
        // {
        //   "id": "email-triage",
        //   "name": "Email Triage",
        //   "summary": "Automate email sorting, prioritization, and response generation.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Email classification", "Priority tagging", "Response drafting"],
        //   "useCases": ["Inbox management", "Customer support", "Internal communications"],
        //   status: "available"
        // },
        // {
        //   "id": "email-support",
        //   "name": "Customer Support Email Responder Agent",
        //   "summary": "Automate email sorting, prioritization, and response generation.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Email classification", "Priority tagging", "Response drafting"],
        //   "useCases": ["Inbox management", "Customer support", "Internal communications"],
        //   status: "available"
        // },
        // {
        //   "id": "renewal-agent",
        //   "name": "Renewal Agent",
        //   "summary": "Automate subscription renewal notifications and manage subscriptions.",
        //   "image": "/placeholder.jpg",
        //   "solutions": ["Automated renewal reminders (30/15/7 days)", "Subscription lifecycle tracking", "Dashboard analytics & reporting"],
        //   "useCases": ["SaaS subscription management", "Membership renewal automation", "Contract expiration alerts"],
        //   status: "available"
        // },

      ],
    },
  ]
}

