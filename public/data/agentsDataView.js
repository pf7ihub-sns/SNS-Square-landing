
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
                                        icon: "/icons/eduation.svg",
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
                            heading: "Live Speech-to-Text Instant Meeting Insights",
                            status: "available",
                            whatItIs: {
                                title: "Transforming Meetings into Structured Intelligence",
                                description: "The Live Speech-to-Text Meeting Minutes Generator captures spoken conversations during meetings, transcribes them in real time, and uses AI analysis to generate structured Meeting Minutes. It identifies participants, action items, decisions, and risks while maintaining accurate, timestamped records. The agent combines advanced speech recognition, noise reduction, and multi-model AI analysis to deliver complete, shareable summaries of every meeting."
                            },
                            features: [
                                "Real-time speech-to-text transcription with multi-format audio recording and noise reduction",
                                "Multi-model AI pipeline using Groq Whisper for transcription and Google Gemini for analysis",
                                "Automatic participant detection, role extraction, and speaker identification from conversations",
                                "Action item, decision, and risk tracking with priority levels, deadlines, and severity analysis",
                                "Key topic extraction, discussion summarization, and follow-up planning capabilities"
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
                            heading: "Meeting Minutes Generator  From Audio to Docs.",
                            status: "available",
                            whatItIs: {
                                title: "Converting Audio Recordings into Actionable Intelligence",
                                description: "The Audio-Based Meeting Minutes Generator processes pre-recorded audio files from meetings, transcribes them using advanced AI models, and generates comprehensive, structured Minutes of Meeting. It leverages OpenAI Whisper for accurate speech-to-text conversion and Google Gemini for intelligent content analysis, identifying participants, extracting action items, capturing decisions, and highlighting risks. The system provides editable outputs in multiple formats (PDF, DOCX, JSON) for seamless integration into workflow systems."
                            },
                            features: [
                                "Multi-format audio file support (MP3, WAV, MP4) with drag-and-drop upload interface and 50MB size limit",
                                "Advanced speech-to-text transcription using OpenAI Whisper base model for accurate conversion",
                                "AI-powered meeting analysis using Google Gemini 2.0 Flash for automatic content extraction",
                                "Intelligent task extraction with assignee detection and deadline parsing",
                                "Decision and risk tracking with participant attribution and severity analysis",
                                "Real-time editable transcript and MoM sections with inline editing capability",
                                "Professional multi-format export (PDF, DOCX) with organized document formatting"
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
                        },
                        {
                            id: "ai-sheets",
                            name: "AI Sheet",
                            summary: "Your Universal Data Intelligence Workspace for exploring, analyzing, and visualizing datasets.",
                            image: "/placeholder.jpg",
                            heading: "AI Sheet  Your Universal Data Intelligence Workspace",
                            status: "available",
                            whatItIs: {
                                title: "Universal Data Intelligence Platform",
                                description: " AI Sheet allows users to upload datasets (CSV, Excel, TSV, and future formats like PDF, Word, Images) and interact with them using natural language queries. Users can generate reports, visualizations, summaries, and integrate with databases or APIs for live insights. Ideal for analysts, business users, and teams handling structured or semi-structured data across systems."
                            },
                            features: [
                                "Multi-format data ingestion (CSV, Excel, TSV; future: PDF, Word, Images)",
                                "Conversational query engine for any dataset interaction",
                                "Automated visualization and chart generation",
                                "Report creation and insight summarization",
                                "Database and API integration for live data access",
                                "Exportable outputs and dashboards",
                                "Prompt-to-formula conversion for spreadsheet automation"
                            ],
                            useCases: {
                                title: "Supported Use Cases Across Industries",
                                subtitle: "Enable professionals across sectors to transform datasets into actionable intelligence with speed and precision.",
                                cases: [
                                    {
                                        icon: "/icons/Finance.svg",
                                        title: "Business Analytics",
                                        description: "Explore and visualize operational datasets, generate performance reports, and identify business trends automatically."
                                    },
                                    {
                                        icon: "/icons/Finance.svg",
                                        title: "Finance & Accounting",
                                        description: "Track transactions, generate financial summaries, detect anomalies, and automate reconciliation processes."
                                    },
                                    {
                                        icon: "/icons/ITIcon.svg",
                                        title: "E-commerce Operations",
                                        description: "Analyze sales patterns, customer behavior, inventory levels, and campaign performance across channels."
                                    },
                                    {
                                        icon: "/icons/Research.svg",
                                        title: "Education & Academia",
                                        description: "Summarize student performance, analyze exam results, and generate insights from educational datasets."
                                    },
                                    {
                                        icon: "/icons/Healthcareuicon.svg",
                                        title: "Healthcare Analytics",
                                        description: "Extract key metrics from clinical datasets, track patient outcomes, and analyze operational efficiency."
                                    },
                                    {
                                        icon: "/icons/ITIcon.svg",
                                        title: "Enterprise IT Monitoring",
                                        description: "Integrate multiple data sources for system monitoring, performance tracking, and incident analysis."
                                    },
                                    {
                                        icon: "/icons/Research.svg",
                                        title: "Research & Data Science",
                                        description: "Generate insights from structured and unstructured data, automate exploratory analysis, and create visualizations."
                                    }
                                ]
                            },
                            whyItMatters: {
                                title: "Business Impact",
                                subtitle: "Revolutionize data analysis workflows with AI-driven insights, automated visualization, and conversational intelligence.",
                                benefits: [
                                    {
                                        icon: "/icons/Reduces.svg",
                                        title: "Reduces time spent on manual data analysis and reporting by up to 80%"
                                    },
                                    {
                                        icon: "/icons/supports.svg",
                                        title: "Enables non-technical users to work with complex datasets using natural language"
                                    },
                                    {
                                        icon: "/icons/imporve.svg",
                                        title: "Improves decision-making with AI-generated insights and automated visualizations"
                                    },
                                    {
                                        icon: "/icons/knowledge.svg",
                                        title: "Supports seamless collaboration across teams with exportable dashboards and reports"
                                    },
                                    {
                                        icon: "/icons/Reduces-1.svg",
                                        title: "Enhances compatibility with existing analytics and reporting tools through multi-format support"
                                    }
                                ]
                            },
                            howItWorks: {
                                title: "How It Works",
                                steps: [
                                    {
                                        number: "01",
                                        title: "Architecture Overview",
                                        description: "File Upload/Database Connection → Data Parsing & Schema Detection → AI Query Engine → Visualization & Report Generation → Export & Integration. Built for seamless data interaction, intelligent analysis, and actionable output.",
                                        process: [
                                            { icon: "/icons/AO1.svg", label: " File Upload / Database/API Connection", isImage: true },
                                            { icon: "/icons/AO2.svg", label: "Data Parsing & Understanding", isImage: true },
                                            { icon: "/icons/AO3.svg", label: "AI Query Engine", isImage: true },
                                            { icon: "/icons/Contextual.svg", label: "Visualization & Report Generation", isImage: true },
                                            { icon: "/icons/AO4.svg", label: "Export & Integration", isImage: true }
                                        ]
                                    },
                                    {
                                        number: "02",
                                        title: "Core Components",
                                        description: "Integrated platform combining multi-format data ingestion, AI-powered query processing, automated visualization, and seamless export capabilities.",
                                        image: "/images/corecomponents.png",
                                        features: [
                                            "File ingestion module supporting CSV, Excel, TSV with future PDF and image support",
                                            "Schema detection engine for automatic metadata understanding and data type inference",
                                            "Natural language query engine enabling conversational dataset interaction",
                                            "Visualization and chart rendering engine with intelligent graph selection",
                                            "AI-powered insight summarization and report generation system",
                                            "Database and API integration layer for live data connectivity",
                                            "Export manager supporting dashboards, reports, and multiple output formats"
                                        ]
                                    },
                                    {
                                        number: "03",
                                        title: "Data Handling",
                                        description: "Processes datasets from multiple sources with intelligent parsing, query execution, and automated output generation.",
                                        image: "/images/datahandling.png",
                                        features: [
                                            "Input: CSV, Excel, TSV files via upload; future support for PDF, Word, Images, JSON, SQL, and API connections",
                                            "Processing: Schema detection + natural language query interpretation + visualization rendering + insight extraction",
                                            "Output: Interactive visualizations, automated reports, exportable dashboards, and data summaries"
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            id: "ai-document",
                            name: "AI Document Agent",
                            summary: "Interact with and extract information from documents using AI.",
                            image: "/placeholder.jpg",
                            heading: "AI Docs Agent  Effortless creation of professional, visually stunning documents.",
                            status: "available",
                            whatItIs: {
                                title: "Next-Generation AI Document Creation Platform",
                                description: "The AI Docs Agent is a next-generation platform that automates professional document creation. Users can upload existing documents, generate templates, or interact with AI through chat to create or refine content. It supports editing modes Rich Text and provides a visually consistent output with style and layout adaptation. Ideal for businesses, educators, marketers, legal teams, and non-profits that require efficient and professional document production."
                            },
                            features: [
                                "AI-powered document generation from user prompts or chat queries.",
                                "Automatic layout, typography, and style application.",
                                "Adaptive template library for reusable, content-adjusted designs.",
                                "Inline document preview with editing capabilities.",
                                "Dual Rich Text editing modes.",
                                "Deep research mode: fetches updated, source-backed information from the web."
                            ],
                            useCases: {
                                title: "Supported Use Cases Across Industries",
                                subtitle: "Enable organizations to automate document production with professional consistency, visual excellence, and intelligent content generation.",
                                cases: [
                                    {
                                        icon: "/icons/Finance.svg",
                                        title: "Corporate Documentation",
                                        description: "Generate reports, proposals, presentations, and executive summaries with consistent branding and professional formatting."
                                    },
                                    {
                                        icon: "/icons/Research.svg",
                                        title: "Education & Academia",
                                        description: "Create research papers, academic reports, structured assignments, and educational materials with proper citations."
                                    },
                                    {
                                        icon: "/icons/Legal.svg",
                                        title: "Legal Documentation",
                                        description: "Produce contracts, case documentation, compliance reports, and legal briefs with precision and formatting consistency."
                                    },
                                    {
                                        icon: "/icons/ITIcon.svg",
                                        title: "Marketing Materials",
                                        description: "Develop branded collateral, campaign summaries, visual documents, and promotional content with design coherence."
                                    },
                                    {
                                        icon: "/icons/Finance.svg",
                                        title: "Non-Profit Organizations",
                                        description: "Create grant proposals, compliance reports, audit documentation, and stakeholder communications efficiently."
                                    }
                                ]
                            },
                            whyItMatters: {
                                title: "Business Impact",
                                subtitle: "Transform document creation workflows with AI-driven generation, adaptive templates, and professional formatting automation.",
                                benefits: [
                                    {
                                        icon: "/icons/Reduces.svg",
                                        title: "Cuts document creation time by up to 75%, dramatically boosting operational efficiency"
                                    },
                                    {
                                        icon: "/icons/Reduces-1.svg",
                                        title: "Ensures professional, consistent outputs with automated design and formatting standards"
                                    },
                                    {
                                        icon: "/icons/supports.svg",
                                        title: "Supports seamless collaboration through editable previews and dual editing modes"
                                    },
                                    {
                                        icon: "/icons/imporve.svg",
                                        title: "Scales effortlessly for high-volume document production across departments and clients"
                                    },
                                    {
                                        icon: "/icons/knowledge.svg",
                                        title: "Enhances content quality with deep research mode and AI-assisted editing capabilities"
                                    }
                                ]
                            },
                            howItWorks: {
                                title: "How It Works",
                                steps: [
                                    {
                                        number: "01",
                                        title: "Architecture Overview",
                                        description: "User Input (Upload/Template/Chat) → AI Document Generation → Template & Styling Application → Visual Integration → Editable Preview → Content Refinement → Multi-Format Export. Built for intelligent automation, professional consistency, and seamless editing.",
                                        process: [
                                            { icon: "/icons/AO1.svg", label: "Document Upload or Chat Input", isImage: true },
                                            { icon: "/icons/AO2.svg", label: "AI Document Generation Engine", isImage: true },
                                            { icon: "/icons/AO3.svg", label: "Adaptive Template Application", isImage: true },
                                            { icon: "/icons/Contextual.svg", label: "Visual & Style Integration", isImage: true },
                                            { icon: "/icons/AO4.svg", label: "Export (PDF/DOCX/TXT)", isImage: true }
                                        ]
                                    },
                                    {
                                        number: "02",
                                        title: "Core Components",
                                        description: "Integrated platform combining AI document generation, adaptive templates, visual styling, and intelligent editing capabilities for professional output.",
                                        image: "/images/corecomponents.png",
                                        features: [
                                            "Document Generation Engine converting prompts or chat queries into structured documents",
                                            "Visual Integration Module for images and style elements with automated design consistency",
                                            "Adaptive Template Framework dynamically adjusting layouts based on content requirements",
                                            "Content Import Engine handling uploaded documents and metadata integration seamlessly",
                                            "Rich Text Editing Layer supporting advanced formatting with intuitive switching",
                                            "Web Research Module fetching and summarizing updated online information with source attribution",
                                            "Multi-format export system supporting PDF, DOCX, Markdown, and TXT outputs"
                                        ]
                                    },
                                    {
                                        number: "03",
                                        title: "Data Handling",
                                        description: "Processes multiple input formats with intelligent content generation, automatic formatting, and professional output delivery.",
                                        image: "/images/datahandling.png",
                                        features: [
                                            "Input: Text prompts, chat queries, uploaded documents (Word, PDF), images, and structured content",
                                            "Processing: AI-driven content generation + adaptive template application + visual integration + metadata structuring + style formatting",
                                            "Output: Editable document previews, professional PDF/DOCX files, Markdown, and TXT formats with consistent branding"
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            id: "ai-chat",
                            name: "AI Chat Support Agent",
                            summary: "Provide instant customer support with context-aware responses.",
                            image: "/placeholder.jpg",
                            heading: "AI Chat Agent Seamless, intelligent conversations at your fingertips.",
                            status: "available",
                            whatItIs: {
                                title: "Advanced Conversational AI Platform",
                                description: "The AI Chat Agent is an advanced conversational AI platform designed to provide real-time, context-aware interactions. Users can engage in multi-turn conversations, upload documents for analysis, or utilize deep research mode to fetch updated information. It supports natural language understanding and multiple languages, making it ideal for customer support, education, business operations, and more."
                            },
                            features: [
                                "Real-time, context-aware response generation from user queries.",
                                "Multi-turn conversation support for continuous dialogue.",
                                "Deep research mode: retrieves and summarizes web-based information.",
                                "Document and file analysis with natural language processing.",
                                "Multi-language support for global accessibility."
                            ],
                            useCases: {
                                title: "Supported Use Cases Across Industries",
                                subtitle: "Enable organizations to deliver instant, intelligent interactions with scalable conversation management and deep research capabilities.",
                                cases: [
                                    {
                                        icon: "/icons/ITIcon.svg",
                                        title: "Customer Support",
                                        description: "Provide instant query resolution, 24/7 assistance, and automated troubleshooting with context-aware responses."
                                    },
                                    {
                                        icon: "/icons/Research.svg",
                                        title: "Education & Tutoring",
                                        description: "Enable interactive tutoring, Q&A sessions, concept explanations, and personalized learning support."
                                    },
                                    {
                                        icon: "/icons/Finance.svg",
                                        title: "Business Operations",
                                        description: "Facilitate internal communication, generate meeting summaries, answer policy questions, and streamline workflows."
                                    },
                                    {
                                        icon: "/icons/Healthcareuicon.svg",
                                        title: "Healthcare Communication",
                                        description: "Support patient triage, provide informational assistance, answer medical queries, and facilitate care coordination."
                                    },
                                    {
                                        icon: "/icons/Legal.svg",
                                        title: "Knowledge Management",
                                        description: "Deliver instant access to organizational knowledge, documentation, procedures, and research-backed insights."
                                    }
                                ]
                            },
                            whyItMatters: {
                                title: "Business Impact",
                                subtitle: "Transform user engagement with instant, accurate conversations powered by advanced AI, deep research, and intelligent context management.",
                                benefits: [
                                    {
                                        icon: "/icons/Reduces.svg",
                                        title: "Reduces response time by up to 80%, dramatically improving customer satisfaction and engagement"
                                    },
                                    {
                                        icon: "/icons/supports.svg",
                                        title: "Enables scalable 24/7 support with minimal human intervention and consistent quality"
                                    },
                                    {
                                        icon: "/icons/imporve.svg",
                                        title: "Enhances decision-making with deep research capabilities and document-based insights"
                                    },
                                    {
                                        icon: "/icons/knowledge.svg",
                                        title: "Fosters global reach with multi-language capabilities and cross-cultural communication support"
                                    },
                                    {
                                        icon: "/icons/Reduces-1.svg",
                                        title: "Maintains conversation continuity with advanced context management across multi-turn dialogues"
                                    }
                                ]
                            },
                            howItWorks: {
                                title: "How It Works",
                                steps: [
                                    {
                                        number: "01",
                                        title: "Architecture Overview",
                                        description: "User Input (Chat/Upload/Query) → AI Conversation Engine → Context & NLU Processing → Deep Research/Document Analysis → Response Generation & Verification → Answer Display → Continuous Interaction. Built for intelligent dialogue, research integration, and seamless user experience.",
                                        process: [
                                            { icon: "/icons/AO1.svg", label: "User Chat Input or Document Upload", isImage: true },
                                            { icon: "/icons/AO2.svg", label: "Natural Language Understanding", isImage: true },
                                            { icon: "/icons/AO3.svg", label: "Context Management & Processing", isImage: true },
                                            { icon: "/icons/Contextual.svg", label: "Deep Research or Document Analysis", isImage: true },
                                            { icon: "/icons/AO4.svg", label: "Response Generation & Display", isImage: true }
                                        ]
                                    },
                                    {
                                        number: "02",
                                        title: "Core Components",
                                        description: "Integrated conversational platform combining natural language processing, context management, deep research, and document analysis for comprehensive interaction capabilities.",
                                        image: "/images/corecomponents.png",
                                        features: [
                                            "Conversation Engine processing and generating natural language responses with contextual awareness",
                                            "Context Management Module maintaining conversation history and user intent across multiple turns",
                                            "Natural Language Understanding Processor interpreting user queries and extracting intent accurately",
                                            "Deep Research Module fetching and summarizing current web data with source verification",
                                            "Document Analysis Engine extracting and parsing uploaded content for intelligent query responses",
                                            "Multi-language Processing supporting global communication and cross-cultural interactions",
                                            "Response Verification System ensuring accuracy, relevance, and quality control"
                                        ]
                                    },
                                    {
                                        number: "03",
                                        title: "Data Handling",
                                        description: "Processes conversational inputs, uploaded documents, and web research with intelligent context management and verified response generation.",
                                        image: "/images/datahandling.png",
                                        features: [
                                            "Input: Text queries, multi-turn conversations, uploaded documents (PDF, Word, text files), and research requests",
                                            "Processing: Natural language understanding + context management + document parsing + web research + response generation + verification",
                                            "Output: Context-aware responses, research summaries with citations, document insights, and continuous dialogue support"
                                        ]
                                    }
                                ]
                            }
                        },




                    ]
                }

            ]
        }
    ],
    industry: [
        {
            id: "healthcare",
            name: "Healthcare",
            description: "PHI-aware agents with clinical context and auditability.",
            image: "/industry/Healthcare.png",
            subCategories: [
                {
                    id: "healthcare-operations",
                    name: "Healthcare Operations",
                    description: "Administrative, financial, and operational management workflows",
                    image: "/placeholder.jpg",
                    agents: [
                        {
                            id: "Doc-Sentra",
                            name: "DocSentra",
                            summary: "AI-driven healthcare automation platform integrating clinical intelligence, conversational AI, and smart workflow management.",
                            image: "/placeholder.jpg",
                            heading: "AI-Driven Healthcare Automation Platform ",
                            status: "available",
                            whatItIs: {
                                title: "Comprehensive Healthcare Automation Platform",
                                description: "DocSentra is an advanced AI-driven healthcare automation platform that integrates clinical intelligence, conversational AI, and smart workflow management to revolutionize patient care delivery. The platform provides intelligent clinical decision support, automated medical documentation, real-time patient monitoring, and prescription management with HIPAA-compliant data handling. Seamlessly integrating with existing EHR systems, DocSentra streamlines clinical workflows from patient intake through treatment planning and follow-up care. Ideal for hospitals, clinics, healthcare professionals, and medical practices requiring efficient automation, enhanced diagnostic accuracy, and improved operational performance across all aspects of medical practice."
                            },
                            features: [
                                "Intelligent Clinical Decision Support with evidence-based treatment recommendations",
                                "Automated Medical Documentation with intelligent transcription and data entry",
                                "Real-time Patient Monitoring for continuous care tracking and alerts",
                                "Prescription Management System with drug interaction checks and dosage recommendations",
                                "HIPAA-Compliant Data Handling ensuring patient privacy and regulatory compliance",
                                "Multi-language Support for global accessibility and cross-cultural healthcare delivery",
                                "Integration with EHR Systems for seamless workflow connectivity",
                                "Advanced Analytics Dashboard for healthcare metrics and operational performance tracking"
                            ],
                            useCases: {
                                title: "Supported Use Cases Across Industries",
                                subtitle: "Transform healthcare operations with intelligent automation and AI-powered insights across every aspect of patient care delivery.",
                                cases: [
                                    {
                                        icon: "/icons/Healthcareuicon.svg",
                                        title: "Patient Care Enhancement",
                                        description: "Streamline patient interactions and improve care quality through AI-powered assistance and real-time monitoring."
                                    },
                                    {
                                        icon: "/icons/Research.svg",
                                        title: "Clinical Documentation",
                                        description: "Automate medical record creation and maintenance with intelligent transcription and data entry."
                                    },
                                    {
                                        icon: "/icons/ITIcon.svg",
                                        title: "Decision Support",
                                        description: "Provide evidence-based treatment recommendations and diagnostic assistance to healthcare professionals."
                                    },
                                    {
                                        icon: "/icons/Finance.svg",
                                        title: "Workflow Optimization",
                                        description: "Enhance hospital operations and clinic workflow efficiency through intelligent automation."
                                    },
                                    {
                                        icon: "/icons/Healthcareuicon.svg",
                                        title: "Prescription Management",
                                        description: "Streamline medication prescribing with drug interaction checks and dosage recommendations."
                                    },
                                    {
                                        icon: "/icons/ITIcon.svg",
                                        title: "Performance Analytics",
                                        description: "Track healthcare metrics and operational performance with comprehensive reporting tools."
                                    }
                                ]
                            },
                            whyItMatters: {
                                title: "Business Impact",
                                subtitle: "Revolutionize healthcare delivery with intelligent automation, reducing administrative burden and improving patient outcomes through advanced AI capabilities.",
                                benefits: [
                                    {
                                        icon: "/icons/supports.svg",
                                        title: "Enhanced Patient Safety through intelligent clinical decision support and error prevention"
                                    },
                                    {
                                        icon: "/icons/Reduces.svg",
                                        title: "Reduced Processing Time with automated documentation and workflow optimization"
                                    },
                                    {
                                        icon: "/icons/imporve.svg",
                                        title: "Improved Efficiency across clinical operations and administrative processes"
                                    },
                                    {
                                        icon: "/icons/knowledge.svg",
                                        title: "AI-Powered Insights for better diagnosis accuracy and treatment outcomes"
                                    }
                                ]
                            },
                            howItWorks: {
                                title: "How It Works",
                                steps: [
                                    {
                                        number: "01",
                                        title: "Patient Intake",
                                        description: "AI-powered patient registration and initial assessment with automated data collection and verification for streamlined onboarding.",
                                        process: [
                                            { icon: "/icons/AO1.svg", label: "Patient Registration & Data Collection", isImage: true },
                                            { icon: "/icons/AO2.svg", label: "Automated Assessment & Verification", isImage: true },
                                            { icon: "/icons/AO3.svg", label: "EHR Integration & Data Sync", isImage: true },
                                            { icon: "/icons/Contextual.svg", label: "Initial Clinical Evaluation", isImage: true },
                                            { icon: "/icons/AO4.svg", label: "Patient Profile Creation", isImage: true }
                                        ]
                                    },
                                    {
                                        number: "02",
                                        title: "Clinical Analysis",
                                        description: "Advanced clinical intelligence analyzes patient data and provides diagnostic support to healthcare professionals with evidence-based insights.",
                                        image: "/images/corecomponents.png",
                                        features: [
                                            "Intelligent Clinical Decision Support with treatment recommendations",
                                            "Automated Medical Documentation with transcription capabilities",
                                            "Real-time Patient Monitoring for continuous care tracking",
                                            "Prescription Management System with safety checks"
                                        ]
                                    },
                                    {
                                        number: "03",
                                        title: "Treatment Planning",
                                        description: "Generate personalized treatment plans with evidence-based recommendations and medication management for optimal patient outcomes.",
                                        image: "/images/datahandling.png",
                                        features: [
                                            "HIPAA-Compliant Data Handling for secure patient information",
                                            "Multi-language Support for diverse patient populations",
                                            "Integration with EHR Systems for seamless workflows",
                                            "Advanced Analytics Dashboard for performance tracking"
                                        ]
                                    },
                                    {
                                        number: "04",
                                        title: "Documentation & Follow-up",
                                        description: "Automated documentation generation and intelligent scheduling for follow-up appointments and care continuity with comprehensive record keeping.",
                                        image: "/images/datahandling.png",
                                        features: [
                                            "Input: Patient data, clinical observations, medical history, prescriptions, and diagnostic results",
                                            "Processing: AI clinical analysis + automated documentation + prescription management + EHR integration + compliance verification",
                                            "Output: Treatment plans, medical records, prescriptions, follow-up schedules, and analytics reports"
                                        ]
                                    }
                                ]
                            }
                        }
                    ]
                },
            ]
        }
    ]
};