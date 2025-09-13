export const agentCategories = {
    "document-summarization": {
        id: "document-summarization",
        name: "Document & Summarization",
        description: "AI agents specialized in document processing, analysis, and summarization tasks",
        icon: "📄",
        color: "blue",
        agents: [
            {
                id: "document-classifier",
                name: "Document Classification Agent",
                description: "Automatically categorize and classify documents by type, content, and purpose with high accuracy.",
                image: "/icons/document-classifier.png",
                features: [
                    "Multi-label classification",
                    "Confidence scoring",
                    "Automatic routing",
                    "Batch processing"
                ],
                useCases: [
                    "Legal document sorting",
                    "Financial report categorization",
                    "Medical record classification",
                    "Email triage automation"
                ],
                status: "available"
            },
            {
                id: "text-summarizer",
                name: "Text Summarization Agent",
                description: "Generate concise, accurate summaries from long documents while preserving key information.",
                image: "/icons/text-summarizer.png",
                features: [
                    "Extractive summarization",
                    "Abstractive summarization",
                    "Multi-language support",
                    "Custom length control"
                ],
                useCases: [
                    "Research paper abstracts",
                    "News article summaries",
                    "Meeting minutes",
                    "Legal document briefs"
                ],
                status: "available"
            },
            {
                id: "ocr-processor",
                name: "OCR Processing Agent",
                description: "Convert scanned documents and images to editable text with high accuracy.",
                image: "/icons/ocr-processor.png",
                features: [
                    "Handwritten text recognition",
                    "Multi-language OCR",
                    "Layout preservation",
                    "Quality enhancement"
                ],
                useCases: [
                    "Form digitization",
                    "Archive document processing",
                    "Receipt scanning",
                    "Historical document conversion"
                ],
                status: "available"
            },
            {
                id: "content-extractor",
                name: "Content Extraction Agent",
                description: "Extract structured data and key information from unstructured documents.",
                image: "/icons/content-extractor.png",
                features: [
                    "Entity extraction",
                    "Key-value pair extraction",
                    "Table recognition",
                    "Metadata extraction"
                ],
                useCases: [
                    "Invoice processing",
                    "Contract analysis",
                    "Research data extraction",
                    "Form data capture"
                ],
                status: "available"
            }
        ]
    },
    "content-creation": {
        id: "content-creation",
        name: "Content Creation",
        description: "AI agents for generating, editing, and optimizing various types of content",
        icon: "✍️",
        color: "green",
        agents: [
            {
                id: "blog-writer",
                name: "Blog Writing Agent",
                description: "Create engaging blog posts on any topic with SEO optimization and proper structure.",
                image: "/icons/blog-writer.png",
                features: [
                    "SEO optimization",
                    "Multiple writing styles",
                    "Research integration",
                    "Plagiarism checking"
                ],
                useCases: [
                    "Marketing blogs",
                    "Technical articles",
                    "News updates",
                    "Educational content"
                ],
                status: "available"
            },
            {
                id: "social-media-manager",
                name: "Social Media Content Agent",
                description: "Generate platform-specific social media content with optimal engagement strategies.",
                image: "/icons/social-media.png",
                features: [
                    "Platform optimization",
                    "Hashtag research",
                    "Engagement analysis",
                    "Content scheduling"
                ],
                useCases: [
                    "Brand promotion",
                    "Community building",
                    "Event marketing",
                    "Customer engagement"
                ],
                status: "available"
            },
            {
                id: "email-composer",
                name: "Email Composition Agent",
                description: "Create professional emails for various purposes with appropriate tone and structure.",
                image: "/icons/email-composer.png",
                features: [
                    "Tone adaptation",
                    "Template generation",
                    "Personalization",
                    "A/B testing"
                ],
                useCases: [
                    "Marketing campaigns",
                    "Customer support",
                    "Internal communications",
                    "Newsletter creation"
                ],
                status: "available"
            }
        ]
    },
    "data-analysis": {
        id: "data-analysis",
        name: "Data Analysis",
        description: "AI agents specialized in data processing, analysis, and visualization",
        icon: "📊",
        color: "purple",
        agents: [
            {
                id: "data-visualizer",
                name: "Data Visualization Agent",
                description: "Create interactive charts, graphs, and dashboards from raw data.",
                image: "/icons/data-visualizer.png",
                features: [
                    "Interactive charts",
                    "Custom dashboards",
                    "Real-time updates",
                    "Export capabilities"
                ],
                useCases: [
                    "Business intelligence",
                    "Performance monitoring",
                    "Research visualization",
                    "Financial reporting"
                ],
                status: "available"
            },
            {
                id: "trend-analyzer",
                name: "Trend Analysis Agent",
                description: "Identify patterns, trends, and anomalies in datasets with predictive insights.",
                image: "/icons/trend-analyzer.png",
                features: [
                    "Pattern recognition",
                    "Predictive modeling",
                    "Anomaly detection",
                    "Statistical analysis"
                ],
                useCases: [
                    "Market analysis",
                    "Sales forecasting",
                    "Risk assessment",
                    "Performance optimization"
                ],
                status: "available"
            }
        ]
    },
    "customer-service": {
        id: "customer-service",
        name: "Customer Service",
        description: "AI agents for customer support, engagement, and relationship management",
        icon: "🎧",
        color: "orange",
        agents: [
            {
                id: "chatbot-assistant",
                name: "Intelligent Chatbot Agent",
                description: "Provide 24/7 customer support with natural language understanding and context awareness.",
                image: "/icons/chatbot.png",
                features: [
                    "Natural language processing",
                    "Context retention",
                    "Multi-language support",
                    "Escalation handling"
                ],
                useCases: [
                    "Customer inquiries",
                    "Technical support",
                    "Order tracking",
                    "FAQ automation"
                ],
                status: "available"
            },
            {
                id: "sentiment-analyzer",
                name: "Sentiment Analysis Agent",
                description: "Analyze customer feedback and communications to understand sentiment and satisfaction levels.",
                image: "/icons/sentiment-analyzer.png",
                features: [
                    "Real-time analysis",
                    "Multi-channel monitoring",
                    "Alert system",
                    "Trend tracking"
                ],
                useCases: [
                    "Review analysis",
                    "Social media monitoring",
                    "Survey processing",
                    "Brand reputation"
                ],
                status: "available"
            }
        ]
    }
};

export const getCategoryById = (categoryId) => {
    return agentCategories[categoryId] || null;
};

export const getAllCategories = () => {
    return Object.values(agentCategories);
};

export const getAgentById = (categoryId, agentId) => {
    const category = getCategoryById(categoryId);
    if (!category) return null;

    return category.agents.find(agent => agent.id === agentId) || null;
};
