
import { useState } from "react";
import { ArrowLeft } from 'lucide-react';

function TestCaseGenerationAgent() {
	const [userInput, setUserInput] = useState("");
	const [output, setOutput] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const cleanOutput = (raw) => {
		let cleaned = raw;

		// Handle JSON input
		if (typeof raw !== 'string') {
			cleaned = JSON.stringify(raw, null, 2);
		}

		// Remove markdown code block delimiters
		cleaned = cleaned.replace(/^```markdown\n|^```/, '').replace(/```$/, '');

		// Remove backslashes
		cleaned = cleaned.replace(/\\/g, '');

		// Only remove specific markdown formatting characters
		cleaned = cleaned.replace(/#{1,6}\s*/g, ''); // Remove heading symbols ##
		cleaned = cleaned.replace(/\*{1,3}(.*?)\*{1,3}/g, '$1'); // Remove asterisk formatting *, **, ***
		cleaned = cleaned.replace(/_{1,3}(.*?)_{1,3}/g, '$1'); // Remove underscore formatting
		cleaned = cleaned.replace(/`{1,3}(.*?)`{1,3}/g, '$1'); // Remove backtick formatting
		cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Remove markdown links

		// Clean up extra asterisks and hash symbols that might be leftover
		cleaned = cleaned.replace(/\*+/g, ''); // Remove any remaining asterisks
		cleaned = cleaned.replace(/#+/g, ''); // Remove any remaining hash symbols

		// Split into lines and clean each line while preserving structure
		const lines = cleaned.split('\n');
		const processedLines = [];

		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];

			// Only trim whitespace, don't remove content structure
			line = line.trim();

			// Skip completely empty lines
			if (!line) {
				// Add empty line for spacing if the previous line wasn't empty
				if (processedLines.length > 0 && processedLines[processedLines.length - 1] !== '') {
					processedLines.push('');
				}
				continue;
			}

			// Clean any remaining markdown symbols but keep the line structure
			line = line.replace(/\*+/g, ''); // Remove asterisks
			line = line.replace(/#+/g, ''); // Remove hash symbols
			line = line.replace(/`+/g, ''); // Remove backticks
			line = line.trim();

			// Add the cleaned line if it's not empty
			if (line) {
				processedLines.push(line);
			}
		}

		// Join all lines and clean up excessive spacing
		let result = processedLines
			.join('\n')
			.replace(/\n{3,}/g, '\n\n') // Limit to maximum 2 consecutive line breaks
			.replace(/^\n+/, '') // Remove leading newlines
			.replace(/\n+$/, ''); // Remove trailing newlines

		return result;
	};

	const runAgent = async () => {
		setLoading(true);
		setError("");
		setOutput("");

		const trimmedInput = userInput.trim();
		if (
			trimmedInput === "" ||
			trimmedInput === "''" ||
			/^\.*$/.test(trimmedInput)
		) {
			setLoading(false);
			setError("Please provide requirements or user stories.");
			return;
		}

		try {
			const formData = new FormData();
			formData.append("user_input", userInput);

			const response = await fetch("http://127.0.0.1:8000/test_case_generation_agent/run", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error(`Server error: ${response.status}`);
			}

			const data = await response.json();
			let rawOutput = "";

			if (data.error) {
				setError(data.error);
			} else if (data.test_cases) {
				rawOutput = typeof data.test_cases === "string" ? data.test_cases : JSON.stringify(data.test_cases, null, 2);
			} else if (data.output) {
				rawOutput = typeof data.output === "string" ? data.output : JSON.stringify(data.output, null, 2);
			} else {
				rawOutput = JSON.stringify(data, null, 2);
			}

			setOutput(cleanOutput(rawOutput));
		} catch (err) {
			setError(err.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	const downloadOutput = (format) => {
		if (!output) return;

		const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `test_cases.${format}`;
		link.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-2 sm:p-4" style={{ backgroundColor: '#F9FAFB' }}>
			<div className="w-full max-w-4xl mt-20 sm:mt-8 lg:mt-21">
				{/* Header */}
				<div className="relative mb-6">
					<h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white text-center py-3 px-4 sm:py-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
						Test Case Generation Agent
					</h1>
					<button
						onClick={() => window.location.href = '/media-entertainment'}
						className="absolute top-3 sm:top-4 right-2 sm:right-4 flex items-center gap-1 sm:gap-2 text-white font-medium hover:text-blue-200 transition-colors p-2 hover:bg-white-50 hover:bg-opacity-10 rounded-md z-10 text-sm sm:text-base"
					>
						<ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
						<span className="hidden sm:inline">Back</span>
					</button>
				</div>

				{/* Instructions */}
				<div className="text-center mb-4 sm:mb-6 text-gray-700 px-2">
					<p className="text-sm sm:text-base">Generate test cases from requirements or user stories.</p>
				</div>

				{/* Input Section */}
				<div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 mb-6">
					<div className="flex items-center mb-4 sm:mb-6 gap-2 sm:gap-3">
						<div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
							<svg className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-700 tracking-tight">
							Input Requirements
						</h2>
					</div>

					<div className="mb-4 sm:mb-6">
						<label htmlFor="userInput" className="block text-sm font-medium text-gray-700 mb-2">
							Paste Requirements or User Stories
						</label>
						<textarea
							id="userInput"
							value={userInput}
							onChange={(e) => setUserInput(e.target.value)}
							placeholder="Paste requirements or user stories here..."
							className="w-full h-32 sm:h-40 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm sm:text-base bg-gray-50"
						/>
					</div>

					<div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6 justify-center sm:justify-end">
						<button
							onClick={runAgent}
							disabled={loading}
							className={`px-4 sm:px-6 py-2 text-white font-semibold rounded-xl shadow transition-colors flex items-center gap-2 text-sm sm:text-base ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
							style={{ backgroundColor: loading ? '#9CA3AF' : '#1E3A8A' }}
						>
							{loading ? (
								<>
									<svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
									</svg>
									<span className="hidden sm:inline">Generating...</span>
									<span className="sm:hidden">Loading...</span>
								</>
							) : (
								<>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
									</svg>
									Generate
								</>
							)}
						</button>
					</div>

					{error && (
						<div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
							<div className="flex items-start gap-2">
								<svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<p className="text-red-700 font-medium text-sm sm:text-base">{error}</p>
							</div>
						</div>
					)}
				</div>

				{/* Output Section */}
				{output && (
					<div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6">
						<div className="flex items-center gap-2 mb-4 sm:mb-6">
							<svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<h2 className="text-lg sm:text-xl font-bold text-blue-700">Generated Test Cases</h2>
						</div>

						<div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
							<div className="max-h-64 sm:max-h-96 overflow-y-auto">
								<div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed font-sans">
									{output.split('\n').map((line, index, allLines) => {
										const trimmedLine = line.trim();

										// Check if this is a main title
										if (trimmedLine.match(/^(Test Case Generation for|E-commerce Shopping Cart API Test Cases|Test Cases for)/i)) {
											return (
												<div key={index} className="font-bold text-gray-900 mb-3 text-lg">
													{line}
												</div>
											);
										}

										// Check if this is a numbered section header
										if (trimmedLine.match(/^\d+\.\s+[A-Z]/i)) {
											return (
												<div key={index} className="font-bold text-gray-900 mb-2 mt-4">
													{line}
												</div>
											);
										}

										// Check if this is a test case ID (TC1:, TC2:, etc.) - handle complete test case title
										if (trimmedLine.match(/^TC\d+:/i)) {
											// Get the full test case line including description
											let fullTestCase = line;
											let nextLineIndex = index + 1;

											// Check if the next line continues the test case description (not Input: or Expected)
											while (nextLineIndex < allLines.length &&
												allLines[nextLineIndex].trim() &&
												!allLines[nextLineIndex].trim().match(/^(Input|Expected Result|Expected Output|TC\d+):/i)) {
												fullTestCase += ' ' + allLines[nextLineIndex].trim();
												nextLineIndex++;
											}

											// Split at the colon to make only the ID bold
											const colonIndex = fullTestCase.indexOf(':');
											if (colonIndex > -1) {
												const tcId = fullTestCase.substring(0, colonIndex + 1);
												const tcDescription = fullTestCase.substring(colonIndex + 1);

												return (
													<div key={index} className="mb-1 mt-3">
														<span className="font-bold text-gray-900">{tcId}</span>
														<span className="text-gray-800">{tcDescription}</span>
													</div>
												);
											}
										}

										// Skip lines that were already processed as part of test case descriptions
										const prevLine = index > 0 ? allLines[index - 1] : '';
										if (prevLine.trim().match(/^TC\d+:/i) &&
											!trimmedLine.match(/^(Input|Expected Result|Expected Output|TC\d+):/i) &&
											trimmedLine &&
											!trimmedLine.match(/^\d+\.\s+[A-Z]/i)) {
											return null; // Skip this line as it's part of the previous test case
										}

										// Check if this is Input:, Expected Result:, or Expected Output:
										if (trimmedLine.match(/^(Input|Expected Result|Expected Output):/i)) {
											// Split the line at the colon to make only the label bold
											const parts = line.split(':');
											if (parts.length > 1) {
												return (
													<div key={index} className="mb-1">
														<span className="font-bold text-gray-900">{parts[0]}:</span>
														<span className="text-gray-800">{parts.slice(1).join(':')}</span>
													</div>
												);
											}
										}

										// Empty lines for spacing
										if (!trimmedLine) {
											return <div key={index} className="mb-1">&nbsp;</div>;
										}

										// Regular lines (like Notes:, etc.)
										if (trimmedLine.match(/^Notes?:/i)) {
											return (
												<div key={index} className="font-bold text-gray-900 mb-2 mt-4">
													{line}
												</div>
											);
										}

										// Regular content lines
										return (
											<div key={index} className="text-gray-800 mb-1">
												{line}
											</div>
										);
									}).filter(Boolean)}
								</div>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center sm:justify-end">
							<button
								onClick={() => downloadOutput("md")}
								className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white font-semibold rounded-xl shadow hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								Download as MD
							</button>
							<button
								onClick={() => downloadOutput("txt")}
								className="w-full sm:w-auto px-4 py-2 bg-yellow-500 text-white font-semibold rounded-xl shadow hover:bg-yellow-600 transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								Download as TXT
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default TestCaseGenerationAgent;