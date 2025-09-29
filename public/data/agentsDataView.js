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
                                        description: "Document ingestion module (PDF, Excel, TXT)",
                                        image: "/images/corecomponents.png",
                                        features: [
                                            "Structured field and table extraction engine",
                                            "JSON typing and validation module",
                                            "Error handling and logging system",
                                            "Export/download or API integration module",
                                            "Scalable batch processing system"
                                        ]
                                    },
                                    {
                                        number: "03",
                                        title: "Data Handling",
                                        description: "Support multiple inputs, output structured results, track errors.",
                                        image: "/images/datahandling.png",
                                        features: [
                                            "Input Formats: PDF, XLS/XLSX, TXT",
                                            "Output Formats: Typed JSON, API response objects, exportable files",
                                            "Processing: Parsing → field/table extraction → JSON conversion → validation → export"
                                        ]
                                    }

                                ]
                            }
                        },
                        {
                            id: "ocr-agent",
                            name: "OCR (Optical Character Recognition) Agent",
                            summary: " An AI-powered agent that extracts text from image files (PNG/JPG) and provides summaries and keywords for quick understanding.",
                            image: "/placeholder.jpg",
                            heading: "OCR (Optical Character Recognition) Agent Instantly extract text and insights from images.",
                            status: "available",
                            whatItIs: {
                                title: "Transforming OCR with AI Agents",
                                description: " The OCR Agent allows users to upload image files in PNG or JPG formats and instantly extracts the text content. In addition to raw text, the agent generates a concise summary and identifies key keywords to provide a quick overview. The interface provides smooth feedback during processing, including loading indicators and progress updates, ensuring a seamless user experience."
                            },
                            features: [
                                "Extracts text from images (PNG, JPG)",
                                "Generates concise summaries and key insights",
                                "Identifies important keywords from the extracted text",
                                "Real-time processing feedback and progress indicators",
                                "Handles multiple images in batch processing",
                                "Smooth and intuitive interface for uploading and reviewing results",
                                "Error handling for unsupported or low-quality images"
                            ],
                            useCases: {
                                title: "Supported Use Cases Across Industries",
                                subtitle: "Deploy intelligent OCR agents to instantly extract, summarize, and structure text from images, streamlining data workflows across industries.",
                                cases: [
                                    {
                                        icon: "/icons/Finance.svg",
                                        title: "Finance",
                                        description: "Digitizing receipts, invoices, and statements"
                                    },
                                    {
                                        icon: "/icons/Healthcareuicon.svg",
                                        title: "Healthcare",
                                        description: "Extracting text from medical forms or prescriptions"
                                    },
                                    {
                                        icon: "/icons/Legal.svg",
                                        title: "Legal",
                                        description: "Converting scanned contracts or documents into editable text"
                                    },
                                    {
                                        icon: "/icons/education.svg",
                                        title: "Education",
                                        description: "Digitizing notes, textbooks, or research materials"
                                    },
                                    {
                                        icon: "/icons/ITIcon.svg",
                                        title: "Enterprise IT",
                                        description: "Feeding extracted data into dashboards or knowledge bases"
                                    }
                                ]
                            },
                            whyItMatters: {
                                title: "Business Impact",
                                subtitle: "Our OCR agent transforms manual image-to-text workflows into automated, accurate processes, enabling teams to digitize content faster, extract key insights, and streamline operations with confidence.",
                                benefits: [
                                    {
                                        icon: "/icons/BI1.svg",
                                        title: "Saves time and effort in manual data entry from images",
                                        
                                    },
                                    {
                                        icon: "/icons/BI2.svg",
                                        title: "Ensures higher accuracy and consistency in extracted content",
                                        
                                    },
                                    {
                                        icon: "/icons/BI3.svg",
                                        title: "Enables faster decision-making with summarized insights",
                                        
                                    },
                                    {
                                        icon: "/icons/BI4.svg",
                                        title: "Provides structured output for analytics, reporting, or documentation",
                                        
                                    },
                                    {
                                        icon: "/icons/BI4.svg",
                                        title: "Reduces errors associated with manual transcription",
                                        
                                    }
                                
                                ]
                            },
                            howItWorks: {
                                title: "How It Works",
                                steps: [
                                    {
                                        number: "01",
                                        title: "Architecture Overview",
                                        description: "Upload files → AI-powered processing → Structured output delivery. Designed for scalability, real-time feedback, and seamless integration into existing workflows.",
                                        process: [
                                            { icon: "/icons/AO1.svg", label: " Image Upload (PNG/JPG)", isImage: true },
                                            { icon: "/icons/AO2.svg", label: " OCR Text Extraction Engine", isImage: true },
                                            { icon: "/icons/AO3.svg", label: "Summary & Keyword Generation", isImage: true },
                                            { icon: "/icons/AO5.svg", label: "Interactive Display", isImage: true },
                                            { icon: "/icons/AO4.svg", label: " Export/Download", isImage: true },
                                        ]
                                    },
                                    {
                                        number: "02",
                                        title: "Core Components",
                                        description: "Handles file ingestion, AI processing, output visualization, and robust error management."
                                    },
                                    {
                                        number: "03",
                                        title: "Data Handling",
                                        description: "Supports multiple input formats, delivers structured outputs, and ensures traceable processing."
                                    }
                                ]
                            }
                        },
                        {
                            id: "date-format-agent",
                            name: "Date Format Agent",
                            summary: "Normalize and convert date formats across documents.",
                            image: "/placeholder.jpg",
                            heading: " Date Format Agent–Standardize your date fields quickly and accurately.",
                            status: "available",
                            whatItIs: {
                                title: "Transforming Date Formats with AI Agents",
                                description: "The Date Format Agent allows users to upload CSV files containing date fields and converts them into a selected date format. It displays original versus converted dates, identifies invalid or inconsistent entries, and provides an option to download the corrected CSV. The interface is interactive and provides real-time feedback on processing status."
                            },
                            features: [
                                "Converts date fields in CSV files to user-selected formats",
                                "Shows original vs converted dates for verification",
                                "Highlights invalid or improperly formatted entries",
                                "Supports large datasets with real-time processing feedback",
                                "Provides clean, corrected CSV for download",
                                "An interactive interface for easy review and adjustments",
                                "Handles errors gracefully and provides processing status indicators"
                            ],
                            useCases: {
                                title: "Supported Use Cases Across Industries",
                                subtitle: "Deploy intelligent agents to automatically standardize, validate, and correct date fields, ensuring accurate datasets across industries.",
                                cases: [
                                    {
                                        icon: "/icons/Data Analytics.svg",
                                        title: "Data Analytics",
                                        description: "Preparing data fields for analysis and reporting"
                                    },
                                    {
                                        icon: "/icons/Finance.svg",
                                        title: "Finance & Accounting",
                                        description: "Standardizing transaction and audit dates"
                                    },
                                    {
                                        icon: "/icons/Healthcareuicon.svg",
                                        title: "Healthcare",
                                        description: "Correcting patient record dates for consistency"
                                    },
                                    {
                                        icon: "/icons/Marketing,Sales.svg",
                                        title: "Marketing & Sales",
                                        description: " Formatting campaign or customer interaction dates"
                                    },
                                    {
                                        icon: "/icons/ITIcon.svg",
                                        title: "Enterprise IT",
                                        description: "Ensuring database consistency and accurate reporting"
                                    }
                                ]
                            },
                            whyItMatters: {
                                title: "Business Impact",
                                subtitle: "Our Date Format Agent automates CSV date standardization with precision, helping teams correct, validate, and format dates faster while ensuring accurate and consistent datasets.",
                                benefits: [
                                    {
                                        icon: "/icons/BI1.svg",
                                        title: "Saves time by automating date standardization",
                                        
                                    },
                                    {
                                        icon: "/icons/BI2.svg",
                                        title: "Improves accuracy and consistency in datasets",
                                        
                                    },
                                    {
                                        icon: "/icons/BI3.svg",
                                        title: "Identifies invalid entries early for correction",
                                        
                                    },
                                    {
                                        icon: "/icons/BI4.svg",
                                        title: "Reduces manual effort in data cleaning workflows",
                                        
                                    },
                                    {
                                        icon: "/icons/BI4.svg",
                                        title: "Supports reliable downstream analytics and reporting",
                                        
                                    }
                                
                                ]
                            },
                            howItWorks: {
                                title: "How It Works",
                                steps: [
                                    {
                                        number: "01",
                                        title: "Architecture Overview",
                                        description: "Upload files → AI-powered processing → Structured output delivery. Designed for scalability, real-time feedback, and seamless integration into existing workflows.",
                                        process: [
                                            { icon: "/icons/AO1.svg", label: "CSV Upload", isImage: true },
                                            { icon: "/icons/AO2.svg", label: "Date Parsing & Validation", isImage: true },
                                            { icon: "/icons/AO3.svg", label: "Format Conversion", isImage: true },
                                            { icon: "/icons/AO5.svg", label: "Interactive Display of Original vs Converted Dates", isImage: true },
                                            { icon: "/icons/AO4.svg", label: "Download Corrected CSV", isImage: true },
                                        ]
                                    },
                                    {
                                        number: "02",
                                        title: "Core Components",
                                        description: "Handles file ingestion, AI processing, output visualization, and robust error management."
                                    },
                                    {
                                        number: "03",
                                        title: "Data Handling",
                                        description: "Supports multiple input formats, delivers structured outputs, and ensures traceable processing."
                                    }
                                ]
                            }
                        },
                        {
                            id: "pdf-chat-agent",
                            name: "PDF Chat Agent",
                            summary: "An AI-powered agent that allows users to upload a PDF and interact with its content by asking questions in natural language.",
                            image: "/placeholder.jpg",
                            heading: "PDF Chat Agent – Interact with your PDFs and get instant answers.",
                            status: "available",
                            whatItIs: {
                                title: "Interacting with PDF Documents using AI Agents",
                                description: " The PDF Chat Agent allows users to upload PDFs and query their content interactively. Using AI, it understands natural language questions, searches the document context, and provides clear answers. The interface supports multiple queries, keeps conversation history, and allows users to reference sections of the PDF for better clarity."
                            },
                            features: [
                                "Upload and process PDF documents",
                                "Support natural language queries about PDF content",
                                "Provide clear, context-aware answers with references",
                                "Maintain conversation history for multiple queries",
                                "An interactive interface for easy navigation and follow-up questions",
                                "Export answers or summaries if needed",
                                "Error handling for unsupported formats or corrupted files"
                            ],
                            useCases: {
                                title: "Supported Use Cases Across Industries",
                                subtitle: "Deploy intelligent PDF Chat agents to instantly query, summarize, and extract insights from documents, streamlining workflows across industries.",
                                cases: [
                                    {
                                        icon: "/icons/education.svg",
                                        title: "Education",
                                        description: "Students querying textbooks, lecture notes, or research papers"
                                    },
                                    {
                                        icon: "/icons/ITIcon.svg",
                                        title: "Corporate Teams",
                                        description: "Extracting insights from reports, contracts, or manuals"
                                    },
                                    {
                                        icon: "/icons/Legal.svg",
                                        title: "Legal",
                                        description: "Analyzing contracts or legal documents quickly"
                                    },
                                    {
                                        icon: "/icons/Healthcareuicon.svg",
                                        title: "Healthcare",
                                        description: "Querying research papers, patient guides, or clinical documents"
                                    },
                                    {
                                        icon: "/icons/Research.svg",
                                        title: "Publishing & Research",
                                        description: "Interacting with PDF publications for faster review"
                                    }
                                ]
                            },
                            whyItMatters: {
                                title: "Business Impact",
                                subtitle: "Our PDF Chat Agent transforms manual document review into an interactive, AI-powered process, helping teams query, summarize, and extract insights from PDFs quickly and accurately.",
                                benefits: [
                                    {
                                        icon: "/icons/BI1.svg",
                                        title: "Saves time in manually reading and searching PDFs",
                                        
                                    },
                                    {
                                        icon: "/icons/Accurate.svg",
                                        title: "Provides accurate, context-aware answers for informed decision-making",
                                        
                                    },
                                    {
                                        icon: "/icons/BI3.svg",
                                        title: "Enhances productivity by enabling interactive document exploration",
                                        
                                    },
                                    {
                                        icon: "/icons/knowledge.svg",
                                        title: "Improves knowledge accessibility and comprehension",
                                        
                                    },
                                    {
                                        icon: "/icons/BI2.svg",
                                        title: "Reduces errors in interpreting complex documents",
                                        
                                    }
                                
                                ]
                            },
                            howItWorks: {
                                title: "How It Works",
                                steps: [
                                    {
                                        number: "01",
                                        title: "Architecture Overview",
                                        description: "Upload files → AI-powered processing → Structured output delivery. Designed for scalability, real-time feedback, and seamless integration into existing workflows.",
                                        process: [
                                            { icon: "/icons/AO1.svg", label: "PDF Upload", isImage: true },
                                            { icon: "/icons/AO2.svg", label: "Content Processing & Parsing", isImage: true },
                                            { icon: "/icons/AO3.svg", label: "Natural Language Query Handling", isImage: true },
                                            { icon: "/icons/Contextual.svg", label: "Contextual Answer Generation", isImage: true },
                                            { icon: "/icons/AO4.svg", label: "Interactive Display & Export Options", isImage: true },
                                        ]
                                    },
                                    {
                                        number: "02",
                                        title: "Core Components",
                                        description: "Handles file ingestion, AI processing, output visualization, and robust error management."
                                    },
                                    {
                                        number: "03",
                                        title: "Data Handling",
                                        description: "Supports multiple input formats, delivers structured outputs, and ensures traceable processing."
                                    }
                                ]
                            }
                        },
                        {
                            id: "tech-documentation-agent",
                            name: "Tech Documentation Agent",
                            summary: " An AI-enabled agent that processes PDF or DOCX files and generates structured summaries, highlighting executive summaries, key points, and findings for easy comprehension.",
                            image: "/placeholder.jpg",
                            heading: " Tech Documentation Agent–Instant, structured insights from technical documents.",
                            status: "available",
                            whatItIs: {
                                title: "Transforming Technical Document with AI Agents",
                                description: "The Tech Documentation Agent allows users to upload technical documents in PDF or DOCX formats and automatically generates structured summaries. It extracts executive summaries, highlights key points, and creates a findings table to make the content more digestible. The agent is ideal for project managers, engineers, analysts, and teams dealing with large volumes of technical reports or documentation."
                            },
                            features: [
                                "Automatic extraction of executive summaries",
                                "Highlighting of key points and essential details",
                                "Generation of a findings table for structured insights",
                                "Supports multiple file formats (PDF, DOCX)",
                                "Error handling for unsupported or corrupt documents",
                                "Real-time processing and output display",
                            ],
                            useCases: {
                                title: "Supported Use Cases Across Industries",
                                subtitle: "Deploy intelligent documentation agents to automatically extract summaries, key points, and findings from technical reports, streamlining comprehension across industries.",
                                cases: [
                                    {
                                        icon: "/icons/ITIcon.svg",
                                        title: "Software & IT",
                                        description: "Summarizing technical specifications, design docs, and release notes"
                                    },
                                    {
                                        icon: "/icons/Engineering.svg",
                                        title: "Engineering & Manufacturing",
                                        description: "Condensing project or process documentation"
                                    },
                                    {
                                        icon: "/icons/Healthcareuicon.svg",
                                        title: "Healthcare",
                                        description: "Extracting key insights from research reports or clinical guidelines"
                                    },
                                    {
                                        icon: "/icons/education.svg",
                                        title: "Education & Research",
                                        description: "Summarizing academic papers or technical manuals"
                                    },
                                    {
                                        icon: "/icons/Corprate.svg",
                                        title: "Corporate Management",
                                        description: "Generating executive summaries for reports and presentations"
                                    }
                                ]
                            },
                            whyItMatters: {
                                title: "Business Impact",
                                subtitle: "Our Tech Documentation Agent converts lengthy technical files into structured, easy-to-digest insights, helping teams capture executive summaries, key points, and findings with speed and accuracy.",
                                benefits: [
                                    {
                                        icon: "/icons/BI1.svg",
                                        title: "Reduces time spent reading and interpreting long technical documents",
                                        
                                    },
                                    {
                                        icon: "/icons/Accurate.svg",
                                        title: "Ensures key information is not missed by stakeholders",
                                        
                                    },
                                    {
                                        icon: "/icons/BI3.svg",
                                        title: "Enhances knowledge sharing across teams",
                                        
                                    },
                                    {
                                        icon: "/icons/knowledge.svg",
                                        title: "Improves productivity by automating document comprehension",
                                        
                                    },
                                
                                ]
                            },
                            howItWorks: {
                                title: "How It Works",
                                steps: [
                                    {
                                        number: "01",
                                        title: "Architecture Overview",
                                        description: "Upload files → AI-powered processing → Structured output delivery. Designed for scalability, real-time feedback, and seamless integration into existing workflows.",
                                        process: [
                                            { icon: "/icons/AO1.svg", label: "PDF Upload", isImage: true },
                                            { icon: "/icons/AO2.svg", label: "Content Processing & Parsing", isImage: true },
                                            { icon: "/icons/AO3.svg", label: "Natural Language Query Handling", isImage: true },
                                            { icon: "/icons/Contextual.svg", label: "Contextual Answer Generation", isImage: true },
                                            { icon: "/icons/AO4.svg", label: "Interactive Display & Export Options", isImage: true },
                                        ]
                                    },
                                    {
                                        number: "02",
                                        title: "Core Components",
                                        description: "Handles file ingestion, AI processing, output visualization, and robust error management."
                                    },
                                    {
                                        number: "03",
                                        title: "Data Handling",
                                        description: "Supports multiple input formats, delivers structured outputs, and ensures traceable processing."
                                    }
                                ]
                            }
                        },
                    ]
                }

            ]
        }
    ],
    industry: []
};