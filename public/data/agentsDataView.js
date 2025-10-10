
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
                                subtitle: "Our Tech Documentation Agent converts lengthy technical files into structured, easy-to-digest insights, helping teams capture executive summaries, key points, and findings with speed and accuracy.",
                                benefits: [
                                    {
                                        icon: "/icons/Reduces.svg",
                                        title: "Reduces time spent reading and interpreting long technical documents",
                                        description: "Automate repetitive document processing tasks"
                                    },
                                    {
                                        icon: "/icons/Reduces-1.svg",
                                        title: "Ensures key information is not missed by stakeholders",
                                        description: "Achieve higher accuracy with AI-powered extraction"
                                    },
                                    {
                                        icon: "/icons/supports.svg",
                                        title: "Supports faster decision-making through structured summaries",
                                        description: "Streamline regulatory compliance processes"
                                    },
                                    {
                                        icon: "/icons/knowledge.svg",
                                        title: "Enhances knowledge sharing across teams",
                                        description: "Enhance information retrieval and organization"
                                    },
                                    {
                                        icon: "/icons/imporve.svg",
                                        title: "Improves productivity by automating document comprehension",
                                        description: "Improve productivity by automating document comprehension"
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
                                        description: "Document ingestion module (PDF, Excel, TXT)",
                                        image: "/images/corecomponents.png",
                                        features: [
                                            "Image ingestion and preprocessing module",
                                            "OCR engine for text extraction",
                                            "Summarization and keyword extraction module",
                                            "Interactive UI for viewing extracted text, summary, and keywords",
                                            "Export/download module (TXT, CSV, or other formats)",
                                            "Error handling and processing feedback system",
                                        ]
                                    },
                                    {
                                        number: "03",
                                        title: "Data Handling",
                                        description: "Support multiple inputs, output structured results, track errors.",
                                        image: "/images/datahandling.png",
                                        features: [
                                            "Input Formats: PNG, JPG",
                                            "Output Formats: Extracted text, summaries, keywords, exportable files",
                                            "Processing: Text extraction → summarization → keyword generation → interactive display → export"
                                        ]
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
                                        description: "Document ingestion module (PDF, Excel, TXT)",
                                        image: "/images/corecomponents.png",
                                        features: [
                                            "CSV ingestion module",
                                            "Date parsing and validation engine",
                                            "Format conversion module",
                                            "Interactive UI for reviewing original vs converted dates",
                                            "Export/download module for corrected CSV",
                                            "Error handling and processing feedback system"
                                        ]
                                    },
                                    {
                                        number: "03",
                                        title: "Data Handling",
                                        description: "Support multiple inputs, output structured results, track errors.",
                                        image: "/images/datahandling.png",
                                        features: [
                                            "Input Formats: CSV files with date fields",
                                            "Output Formats: Corrected CSV, interactive UI display",
                                            "Processing: Date parsing → validation → conversion → interactive verification → export"
                                        ]
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
                                        description: "Document ingestion module (PDF, Excel, TXT)",
                                        image: "/images/corecomponents.png",
                                        features: [
                                            "PDF ingestion and processing module",
                                            "AI-based content parsing engine",
                                            "Natural language understanding and query engine",
                                            "Interactive UI for asking questions and viewing answers",
                                            "Export/download module for answers or summaries",
                                            "Error handling and processing feedback system"
                                        ]
                                    },
                                    {
                                        number: "03",
                                        title: "Data Handling",
                                        description: "Support multiple inputs, output structured results, track errors.",
                                        image: "/images/datahandling.png",
                                        features: [
                                            "Input Formats: PDF documents",
                                            "Output Formats: Interactive Q&A responses, exportable summaries or answers",
                                            "Processing: PDF parsing → content indexing → query understanding → contextual answer generation → interactive display → export"
                                        ]
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
                                        icon: "/icons/Reduces.svg",
                                        title: "Reduces time spent reading and interpreting long technical documents",

                                    },
                                    {
                                        icon: "/icons/Reduces-1.svg",
                                        title: "Ensures key information is not missed by stakeholders",

                                    },
                                    {
                                        icon: "/icons/supports.svg",
                                        title: "Supports faster decision-making through structured summaries",

                                    },
                                    {
                                        icon: "/icons/knowledge.svg",
                                        title: "Enhances knowledge sharing across teams",

                                    },
                                    {
                                        icon: "/icons/imporve.svg",
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
                                            { icon: "/icons/AO1.svg", label: "Document Upload (PDF/DOCX)", isImage: true },
                                            { icon: "/icons/AO2.svg", label: "Text Extraction & Parsing Engine", isImage: true },
                                            { icon: "/icons/AO3.svg", label: "Executive Summary & Key Points Identification", isImage: true },
                                            { icon: "/icons/Contextual.svg", label: "Findings Table Generation", isImage: true },
                                            { icon: "/icons/AO4.svg", label: "Structured Summary Output", isImage: true },
                                        ]
                                    },
                                    {
                                        number: "02",
                                        title: "Core Components",
                                        description: "Document ingestion module (PDF, Excel, TXT)",
                                        image: "/images/corecomponents.png",
                                        features: [
                                            "File ingestion and format handling module",
                                            "Text extraction engine for PDFs and DOCX",
                                            "Summary generation and key points identification logic",
                                            "Findings table creation module",
                                            "Output formatting and display manager"
                                        ]
                                    },
                                    {
                                        number: "03",
                                        title: "Data Handling",
                                        description: "Support multiple inputs, output structured results, track errors.",
                                        image: "/images/datahandling.png",
                                        features: [
                                            "Input: PDF or DOCX technical documents",
                                            "Output: Structured summary with executive summary, key points, and findings table",
                                            "Processing: Text extraction → Summarization → Findings identification → Structured output"
                                        ]
                                    }

                                ]
                            }
                        },
                        {
                            id: "entity-recognition",
                            name: "Entity Extraction Tool",
                            summary: "An AI-powered agent that identifies and extracts key entities such as people, dates, organizations, locations, and monetary values from unstructured text.",
                            image: "/placeholder.jpg",
                            heading: "Entity Extraction Tool–Unlock hidden insights from text with precision.",
                            status: "available",
                            whatItIs: {
                                title: "Transforming Entity Extraction with AI Agents",
                                description: "The Entity Extraction Tool processes unstructured documents, messages, or datasets to automatically identify relevant entities. It recognizes categories such as people, organizations, locations, dates, and money values, and generates summaries with confidence scores. Users can filter results by entity type, review structured outputs, and export the extracted data into CSV, Excel, or JSON formats for further analysis and integration."
                            },
                            features: [
                                "Automatic identification of entities (people, dates, organizations, locations, money values)",
                                "Confidence scoring for each extracted entity",
                                "Summarized entity view with filtering options",
                                "Export to CSV, Excel, or JSON",
                                "Support for large-scale text processing",
                                "Interactive UI with real-time results",
                                "Error handling and log tracking"
                            ],
                            useCases: {
                                title: "Supported Use Cases Across Industries",
                                subtitle: "Deploy intelligent entity extraction agents to transform unstructured text into structured insights, enabling faster analysis, compliance, and reporting across industries.",
                                cases: [
                                    {
                                        icon: "/icons/finance.svg",
                                        title: "Finance",
                                        description: "Extracting transaction details, money values, and counterparties from reports"
                                    },
                                    {
                                        icon: "/icons/Healthcareuivcon.svg",
                                        title: "Healthcare",
                                        description: "Identifying patient names, dates, and medical organizations from case notes"
                                    },
                                    {
                                        icon: "/icons/Legal.svg",
                                        title: "Legal",
                                        description: "Parsing contracts to extract parties, dates, and obligations"
                                    },
                                    {
                                        icon: "/icons/Research.svg",
                                        title: "Media & Research",
                                        description: "Structuring news articles with people, places, and organizations"
                                    },
                                    {
                                        icon: "/icons/ITIcon.svg",
                                        title: "Enterprise IT",
                                        description: "Enriching unstructured data for analytics and compliance systems"
                                    }
                                ]
                            },
                            whyItMatters: {
                                title: "Business Impact",
                                subtitle: "Our Tech Documentation Agent transforms dense technical documents into clear, structured insights—delivering summaries, key takeaways, and findings quickly and reliably.",
                                benefits: [
                                    {
                                        icon: "/icons/Reduces.svg",
                                        title: "Reduces time spent on manual text review by up to 75%",

                                    },
                                    {
                                        icon: "/icons/Reduces-1.svg",
                                        title: "Improves data quality with accurate and confidence-scored extraction",

                                    },
                                    {
                                        icon: "/icons/supports.svg",
                                        title: "Enables structured insights from previously unstructured sources",

                                    },
                                    {
                                        icon: "/icons/knowledge.svg",
                                        title: "Enhances compliance, reporting, and analytics pipelines",

                                    },
                                    {
                                        icon: "/icons/imporve.svg",
                                        title: "Facilitates automation by converting text into machine-readable formats",

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
                                            { icon: "/icons/AO1.svg", label: "Text Input (documents/emails/messages)", isImage: true },
                                            { icon: "/icons/AO2.svg", label: "AI Entity Recognition Engine", isImage: true },
                                            { icon: "/icons/AO3.svg", label: "Confidence Scoring & Summarization", isImage: true },
                                            { icon: "/icons/Contextual.svg", label: "Filtering & Review", isImage: true },
                                            { icon: "/icons/AO4.svg", label: "Export to CSV/Excel/JSON", isImage: true },
                                        ]
                                    },
                                    {
                                        number: "02",
                                        title: "Core Components",
                                        description: "Document ingestion module (PDF, Excel, TXT)",
                                        image: "/images/corecomponents.png",
                                        features: [
                                            "Text ingestion & parsing module",
                                            "Named Entity Recognition (NER) engine",
                                            "Confidence scoring & validation logic",
                                            "Entity filtering & summarization interface",
                                            "Export/download manager",
                                            "Error handling & monitoring system"
                                        ]
                                    },
                                    {
                                        number: "03",
                                        title: "Data Handling",
                                        description: "Support multiple inputs, output structured results, track errors.",
                                        image: "/images/datahandling.png",
                                        features: [
                                            "Input: Text (plain text, DOCX, PDF, email, etc.)",
                                            "Output: CSV, Excel, JSON",
                                            "Processing: Entity recognition + confidence scoring + structured export"
                                        ]
                                    }

                                ]
                            }
                        },
                        {
                            id: "live-speech-to-text-mom",
                            name: "Live Speech-to-Text Meeting Minutes Generator",
                            summary: "An AI-powered live meeting assistant that transcribes speech in real time, identifies participants, captures decisions, and auto-generates structured Meeting Minutes with AI insights.",
                            image: "/placeholder.jpg",
                            heading: "Live Speech-to-Text Meeting Minutes Generator – Turn conversations into actionable insights instantly.",
                            status: "available",
                            whatItIs: {
                                title: "Transforming Meetings into Structured Intelligence",
                                description: "The Live Speech-to-Text Meeting Minutes Generator captures spoken conversations during meetings, transcribes them in real time, and uses AI analysis to generate structured Meeting Minutes. It identifies participants, action items, decisions, and risks while maintaining accurate, timestamped records. The agent combines advanced speech recognition, noise reduction, and multi-model AI analysis to deliver complete, shareable summaries of every meeting."
                            },
                            features: [
                                "Real-time speech-to-text transcription with automatic restart handling",
                                "Multi-format audio recording (WebM, WAV, OGG) using MediaRecorder API",
                                "Live audio visualization with animated waveform monitoring",
                                "Noise reduction via spectral gating algorithms for clear speech capture",
                                "Multi-model AI pipeline: Groq Whisper for transcription + Google Gemini for analysis",
                                "Automatic participant detection and role extraction",
                                "Action item tracking with priority, deadlines, and assignees",
                                "Decision and rationale recording with contextual impact tagging",
                                "Risk identification with severity and resolution tracking",
                                "Follow-up planning with scheduling and pending item mapping",
                                "Key topic extraction and summarization of discussion themes"
                            ],
                            useCases: {
                                title: "Supported Use Cases Across Industries",
                                subtitle: "Empower organizations to streamline communication, documentation, and decision-making with real-time meeting intelligence.",
                                cases: [
                                    {
                                        icon: "/icons/Finance.svg",
                                        title: "Corporate Meetings",
                                        description: "Generate detailed MoM with decisions, action items, and next steps automatically."
                                    },
                                    {
                                        icon: "/icons/Healthcareuicon.svg",
                                        title: "Healthcare Teams",
                                        description: "Transcribe medical board meetings or case reviews while tracking follow-up actions."
                                    },
                                    {
                                        icon: "/icons/Legal.svg",
                                        title: "Legal & Compliance",
                                        description: "Capture accurate transcripts of discussions, hearings, and negotiation sessions."
                                    },
                                    {
                                        icon: "/icons/Research.svg",
                                        title: "Research & Academia",
                                        description: "Record and summarize research group discussions or academic panels."
                                    },
                                    {
                                        icon: "/icons/ITIcon.svg",
                                        title: "Project Management",
                                        description: "Automatically generate task lists, decisions, and meeting logs for agile teams."
                                    }
                                ]
                            },
                            whyItMatters: {
                                title: "Business Impact",
                                subtitle: "Transform your meeting culture with automated documentation, increased accountability, and AI-driven insights.",
                                benefits: [
                                    {
                                        icon: "/icons/Reduces.svg",
                                        title: "Reduces manual note-taking and transcription time by over 80%"
                                    },
                                    {
                                        icon: "/icons/Reduces-1.svg",
                                        title: "Improves decision traceability and task accountability"
                                    },
                                    {
                                        icon: "/icons/supports.svg",
                                        title: "Enhances collaboration by sharing AI-generated MoMs instantly"
                                    },
                                    {
                                        icon: "/icons/knowledge.svg",
                                        title: "Builds a searchable knowledge base from every recorded conversation"
                                    },
                                    {
                                        icon: "/icons/imporve.svg",
                                        title: "Integrates seamlessly with project management and communication tools"
                                    }
                                ]
                            },
                            howItWorks: {
                                title: "How It Works",
                                steps: [
                                    {
                                        number: "01",
                                        title: "Architecture Overview",
                                        description: "Microphone input → AI Speech Recognition → AI Meeting Analysis → Structured MoM Output. Built for real-time transcription, semantic understanding, and actionable insights.",
                                        process: [
                                            { icon: "/icons/AO1.svg", label: "Audio Capture (Microphone/Stream)", isImage: true },
                                            { icon: "/icons/AO2.svg", label: "Speech Recognition (Groq Whisper)", isImage: true },
                                            { icon: "/icons/AO3.svg", label: "AI Analysis (Google Gemini)", isImage: true },
                                            { icon: "/icons/Contextual.svg", label: "Entity & Topic Extraction", isImage: true },
                                            { icon: "/icons/AO4.svg", label: "Structured MoM Output (PDF/JSON/DOCX)", isImage: true }
                                        ]
                                    },
                                    {
                                        number: "02",
                                        title: "Core Components",
                                        description: "Integrated pipeline for live transcription, analysis, and structured MoM generation.",
                                        image: "/images/corecomponents.png",
                                        features: [
                                            "Web Speech + Whisper-based transcription engine",
                                            "MediaRecorder API for multi-format audio capture",
                                            "Spectral gating for noise suppression",
                                            "AI Meeting Analyzer for participant, task, and topic extraction",
                                            "Frontend MoM visualization and export interface",
                                            "Error handling, latency tracking, and storage management"
                                        ]
                                    },
                                    {
                                        number: "03",
                                        title: "Data Handling",
                                        description: "Securely processes and structures meeting data for immediate use and archival.",
                                        image: "/images/datahandling.png",
                                        features: [
                                            "Input: Live audio, uploaded recordings",
                                            "Processing: Speech recognition + AI meeting analysis + structured MoM generation",
                                            "Output: Downloadable transcripts, task summaries, and decision logs"
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            id: "speech-to-text-mom",
                            name: "Speech to Text MOMAgent",
                            summary: "Generate Minutes of Meeting (MoM) documents from discussions.",
                            image: "/placeholder.jpg",
                            heading: "Audio-Based Meeting Minutes Generator – Transform recorded meetings into professional, structured documentation instantly.",
                            status: "available",
                            whatItIs: {
                                title: "Converting Audio Recordings into Actionable Intelligence",
                                description: "The Audio-Based Meeting Minutes Generator processes pre-recorded audio files from meetings, transcribes them using advanced AI models, and generates comprehensive, structured Minutes of Meeting. It leverages OpenAI Whisper for accurate speech-to-text conversion and Google Gemini for intelligent content analysis, identifying participants, extracting action items, capturing decisions, and highlighting risks. The system provides editable outputs in multiple formats (PDF, DOCX, JSON) for seamless integration into workflow systems."
                            },
                            features: [
                                "Multi-format audio file support (MP3, WAV, MP4) with drag-and-drop upload interface",
                                "Advanced speech-to-text transcription using OpenAI Whisper base model",
                                "AI-powered meeting analysis using Google Gemini 2.0 Flash for content extraction",
                                "Automatic participant identification and role extraction from conversations",
                                "Intelligent task extraction with assignee detection and deadline parsing",
                                "Decision tracking with participant attribution and contextual rationale",
                                "Risk and blocker identification with severity analysis",
                                "Data point and metrics extraction for quantitative insights",
                                "Real-time editable transcript and MoM sections with inline editing capability",
                                "Multi-format export (PDF, DOCX) with professional document formatting",
                                "File size validation (up to 50MB) and audio format verification"
                            ],
                            useCases: {
                                title: "Supported Use Cases Across Industries",
                                subtitle: "Enable organizations to automate meeting documentation, improve accountability, and extract maximum value from recorded conversations.",
                                cases: [
                                    {
                                        icon: "/icons/Finance.svg",
                                        title: "Executive Meetings",
                                        description: "Convert board meetings and executive sessions into formal MoM with decisions, action items, and strategic insights."
                                    },
                                    {
                                        icon: "/icons/Healthcareuicon.svg",
                                        title: "Healthcare Consultations",
                                        description: "Document medical team discussions, case reviews, and treatment planning sessions with accuracy."
                                    },
                                    {
                                        icon: "/icons/Legal.svg",
                                        title: "Legal Proceedings",
                                        description: "Transcribe depositions, client meetings, and internal deliberations with structured documentation."
                                    },
                                    {
                                        icon: "/icons/Research.svg",
                                        title: "Academic Research",
                                        description: "Process research group meetings, symposiums, and academic discussions into structured notes."
                                    },
                                    {
                                        icon: "/icons/ITIcon.svg",
                                        title: "Agile Team Standups",
                                        description: "Generate sprint retrospectives, planning sessions, and daily standup summaries automatically."
                                    }
                                ]
                            },
                            whyItMatters: {
                                title: "Business Impact",
                                subtitle: "Revolutionize your meeting documentation workflow with AI-driven transcription, analysis, and professional formatting.",
                                benefits: [
                                    {
                                        icon: "/icons/Reduces.svg",
                                        title: "Eliminates 90%+ of manual transcription and note-taking effort"
                                    },
                                    {
                                        icon: "/icons/Reduces-1.svg",
                                        title: "Ensures accurate attribution of decisions and action items"
                                    },
                                    {
                                        icon: "/icons/supports.svg",
                                        title: "Enables instant sharing of professional MoM documents in multiple formats"
                                    },
                                    {
                                        icon: "/icons/knowledge.svg",
                                        title: "Creates searchable archives of all meeting discussions and outcomes"
                                    },
                                    {
                                        icon: "/icons/imporve.svg",
                                        title: "Supports compliance and audit requirements with detailed documentation"
                                    }
                                ]
                            },
                            howItWorks: {
                                title: "How It Works",
                                steps: [
                                    {
                                        number: "01",
                                        title: "Architecture Overview",
                                        description: "Audio Upload → Whisper Transcription → Gemini Analysis → Structured MoM Export. Built for accurate transcription, semantic understanding, and professional documentation.",
                                        process: [
                                            { icon: "/icons/AO1.svg", label: "Audio File Upload (MP3/WAV/MP4)", isImage: true },
                                            { icon: "/icons/AO2.svg", label: "Speech Recognition (OpenAI Whisper)", isImage: true },
                                            { icon: "/icons/AO3.svg", label: "AI Analysis (Google Gemini 2.0)", isImage: true },
                                            { icon: "/icons/Contextual.svg", label: "Entity & Topic Extraction", isImage: true },
                                            { icon: "/icons/AO4.svg", label: "Structured MoM Output (PDF/DOCX/JSON)", isImage: true }
                                        ]
                                    },
                                    {
                                        number: "02",
                                        title: "Core Components",
                                        description: "Integrated pipeline combining Whisper transcription, LangChain orchestration, and Gemini analysis for comprehensive MoM generation.",
                                        image: "/images/corecomponents.png",
                                        features: [
                                            "OpenAI Whisper base model for multi-language transcription",
                                            "LangChain framework for AI agent orchestration and prompt engineering",
                                            "Google Gemini 2.0 Flash for intelligent content analysis",
                                            "FPDF and python-docx for professional document generation",
                                            "React frontend with real-time editing and drag-and-drop upload",
                                            "Pydub for audio format conversion and preprocessing"
                                        ]
                                    },
                                    {
                                        number: "03",
                                        title: "Data Handling",
                                        description: "Securely processes and structures meeting data for immediate use and archival with automatic cleanup.",
                                        image: "/images/datahandling.png",
                                        features: [
                                            "Input: Audio files (MP3, WAV, MP4) up to 50MB via upload or drag-and-drop",
                                            "Processing: Whisper transcription + LangChain agents + Gemini analysis + JSON structuring",
                                            "Output: Editable transcripts, structured MoM, and downloadable PDF/DOCX formats"
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