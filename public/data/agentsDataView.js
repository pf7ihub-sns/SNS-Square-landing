
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
                        {
                            id: "document-parser-agent",
                            name: "Document Parser Agent",
                            summary: "Extract structured information from documents.",
                            image: "/placeholder.jpg",
                            heading: "Document Parser Agent Transform unstructured files into Structured insights",
                            status: "available",
                            whatItIs: {
                                title: "Transforming Document Parsing with AI Agents",
                                description: "The Document Parser Agent enables users to upload PDF or Excel files and automatically extract structured information including document ID, title, author, keywords, and summary. It generates a summarized view with expandable full details, handles parsing errors gracefully, and provides real-time progress indicators."
                            },
                            features: [
                                "Automatic parsing of PDF, XLS, and XLSX files",
                                "Metadata extraction (ID, title, author, keywords)",
                                "AI-generated summary of document content",
                                "Expandable detailed view",
                                "Error handling and retry mechanism",
                                "Real-time loading and processing status indicators"
                            ],
                            useCases: {
                                title: "Supported Use Cases Across Industries",
                                subtitle: "Deploy intelligent agents and automation ready to coordinate at enterprise scale and optimize complex workflows across diverse industry verticals",
                                cases: [
                                    {
                                        icon: "/icons/Finance.svg",
                                        title: "Finance",
                                        description: "Parsing invoices, reports, and audit records"
                                    },
                                    {
                                        icon: "/icons/Healthcareuicon.svg",
                                        title: "Healthcare",
                                        description: "Extracting structured information from medical reports"
                                    },
                                    {
                                        icon: "/icons/Legal.svg",
                                        title: "Legal",
                                        description: "Automating contract metadata extraction"
                                    },
                                    {
                                        icon: "/icons/education.svg",
                                        title: "Education",
                                        description: "Summarizing research papers and academic reports"
                                    },
                                    {
                                        icon: "/icons/ITIcon.svg",
                                        title: "Enterprise IT",
                                        description: "Feeding parsed data into knowledge bases and CRMs"
                                    }
                                ]
                            },
                            whyItMatters: {
                                title: "Business Impact",
                                subtitle: "Our agent-based AI transforms manual workflows into automated, error-resistant processes, enabling teams to work faster, make smarter decisions, and scale operations with confidence.",
                                benefits: [
                                    {
                                        icon: "/icons/BI1.svg",
                                        title: "Saves up to 70% of manual document review time",
                                        description: "Automate repetitive document processing tasks"
                                    },
                                    {
                                        icon: "/icons/BI2.svg",
                                        title: "Reduces human error in transcription and data entry",
                                        description: "Achieve higher accuracy with AI-powered extraction"
                                    },
                                    {
                                        icon: "/icons/BI3.svg",
                                        title: "Speeds up compliance workflows by providing structured metadata",
                                        description: "Streamline regulatory compliance processes"
                                    },
                                    {
                                        icon: "/icons/BI4.svg",
                                        title: "Improves knowledge management and searchability",
                                        description: "Enhance information retrieval and organization"
                                    }
                                ]
                            },
                            howItWorks: {
                                title: "How It Works",
                                steps: [
                                    {
                                        number: "01",
                                        title: "Architecture Overview",
                                        description: "Ingest → Analyze → Deliver structured insights in real time.",
                                        process: [
                                            { icon: "/icons/AO1.svg", label: " File Upload", isImage: true },
                                            { icon: "/icons/AO2.svg", label: " Parsing Engine", isImage: true },
                                            { icon: "/icons/AO3.svg", label: "Summarization & Structuring", isImage: true },
                                            { icon: "/icons/AO5.svg", label: "Output as JSON / API Response / UI Table", isImage: true },
                                        ]
                                    },
                                    {
                                        number: "02",
                                        title: "Core Components",
                                        description: "Data ingestion, AI processing, output, and error handling.",
                                        image: "/images/corecomponents.png",
                                        features: [
                                            "File ingestion API",
                                            "AI-based parsing and metadata extraction module",
                                            "Summarization engine",
                                            "Error handling & retry logic",
                                            "UI components for summary and expanded view"
                                        ]
                                    },
                                    {
                                        number: "03",
                                        title: "Data Handling",
                                        description: "Support multiple inputs, output structured results, track errors.",
                                        image: "/images/datahandling.png",
                                        features: [
                                            "Input Formats: PDF, XLS, XLSX",
                                            "Output Formats: JSON, CSV, API response objects",
                                            "Processing: Metadata + Summary + Error logs"
                                        ]
                                    }

                                ]
                            }
                        }
                    ]
                }
            ]
        }
    ],
    industry: []
};