import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Calendar, Clock, Users, CheckSquare, AlertTriangle, FileText, User, Target, Flag, Mic, Play, Square, RotateCcw, Radio, ArrowLeft } from 'lucide-react';

export default function LiveSpeechToTextAgent() {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcription, setTranscription] = useState(null);
    const [error, setError] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [activeTab, setActiveTab] = useState('transcript');
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioLevel, setAudioLevel] = useState(0);
    const [liveTranscript, setLiveTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(true);
    const [recognitionAttempts, setRecognitionAttempts] = useState(0);
    const [lastTranscriptUpdate, setLastTranscriptUpdate] = useState(Date.now());

    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const recordedChunksRef = useRef([]);
    const timerIntervalRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const animationFrameRef = useRef(null);
    const recognitionRef = useRef(null);
    const restartTimeoutRef = useRef(null);
    const keepAliveIntervalRef = useRef(null);
    const isRestartingRef = useRef(false);

    const BACKEND_URL = 'http://localhost:8000';

    // Reset scroll position when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setSpeechSupported(false);
            console.warn('Speech Recognition API not supported in this browser');
        }
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startTimer = useCallback(() => {
        setRecordingTime(0);
        timerIntervalRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
    }, []);

    const stopTimer = useCallback(() => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    }, []);

    const initAudioLevelMonitoring = useCallback((stream) => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContextRef.current = audioContext;

            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyserRef.current = analyser;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const updateAudioLevel = () => {
                if (!analyserRef.current) return;

                analyser.getByteFrequencyData(dataArray);

                const sum = dataArray.reduce((a, b) => a + b, 0);
                const average = sum / dataArray.length;
                const normalizedLevel = Math.min(100, (average / 255) * 100);

                setAudioLevel(normalizedLevel);

                animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
            };

            updateAudioLevel();
        } catch (error) {
            console.error('Failed to initialize audio level monitoring:', error);
        }
    }, []);

    const stopAudioLevelMonitoring = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        analyserRef.current = null;
        setAudioLevel(0);
    }, []);

    const initSpeechRecognition = useCallback(() => {
        if (!speechSupported) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            console.log('✅ Speech recognition started - Attempt #' + recognitionAttempts);
            setIsListening(true);
            isRestartingRef.current = false;
            setRecognitionAttempts(prev => prev + 1);
        };

        recognition.onspeechstart = () => {
            console.log('🗣️ Speech detected - user started speaking');
        };

        recognition.onspeechend = () => {
            console.log('🔇 Speech ended - user stopped speaking');
        };

        recognition.onaudiostart = () => {
            console.log('🎵 Audio capture started');
        };

        recognition.onaudioend = () => {
            console.log('🔇 Audio capture ended');
        };

        recognition.onsoundstart = () => {
            console.log('🔊 Sound detected');
        };

        recognition.onsoundend = () => {
            console.log('🔇 Sound ended');
        };

        recognition.onresult = (event) => {
            console.log('🎤 Speech result received:', event.results.length, 'results');

            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                const confidence = event.results[i][0].confidence;

                console.log(`Result ${i}: "${transcript}" (final: ${event.results[i].isFinal}, confidence: ${confidence})`);

                if (event.results[i].isFinal) {
                    final += transcript + ' ';
                } else {
                    interim += transcript;
                }
            }

            console.log('Final text:', final, '| Interim text:', interim);

            if (final) {
                console.log('✅ Adding final text to transcript');
                setLiveTranscript(prev => {
                    const newTranscript = prev + final;
                    console.log('Updated transcript length:', newTranscript.length, 'chars');
                    setLastTranscriptUpdate(Date.now());
                    return newTranscript;
                });
                setInterimTranscript('');
            }

            if (interim) {
                console.log('⏳ Showing interim text');
                setInterimTranscript(interim);
                setLastTranscriptUpdate(Date.now());
            }
        };

        recognition.onerror = (event) => {
            console.error('❌ Speech recognition error:', event.error, event);

            if (event.error === 'no-speech') {
                console.log('⚠️ No speech detected, will auto-restart');
            } else if (event.error === 'audio-capture') {
                setError('Microphone error. Please check your microphone.');
                setIsListening(false);
                console.error('Audio capture failed');
            } else if (event.error === 'not-allowed') {
                setError('Microphone permission denied.');
                setIsListening(false);
                console.error('Microphone permission denied');
            } else if (event.error === 'network') {
                console.log('⚠️ Network error, will auto-restart');
            } else if (event.error === 'aborted') {
                console.log('⚠️ Recognition aborted, will auto-restart');
            } else {
                console.log(`⚠️ Speech recognition error: ${event.error}, will auto-restart`);
            }
        };

        recognition.onend = () => {
            const timeSinceRecording = Date.now();
            console.log('🔴 Speech recognition ended at', new Date(timeSinceRecording).toLocaleTimeString());

            setIsListening(false);

            if (isRecording && !isRestartingRef.current) {
                isRestartingRef.current = true;
                console.log('🔄 Preparing to auto-restart speech recognition...');

                if (restartTimeoutRef.current) {
                    clearTimeout(restartTimeoutRef.current);
                }

                restartTimeoutRef.current = setTimeout(() => {
                    if (isRecording && recognitionRef.current) {
                        try {
                            console.log('🚀 Restarting recognition NOW...');
                            recognitionRef.current.start();
                            console.log('✅ Speech recognition restarted successfully');
                        } catch (e) {
                            console.warn('⚠️ Restart attempt failed:', e.message);
                            isRestartingRef.current = false;

                            restartTimeoutRef.current = setTimeout(() => {
                                if (isRecording && recognitionRef.current) {
                                    try {
                                        recognitionRef.current.start();
                                        console.log('✅ Speech recognition restarted on retry');
                                    } catch (err) {
                                        console.error('❌ Failed to restart recognition:', err);
                                        isRestartingRef.current = false;
                                    }
                                }
                            }, 500);
                        }
                    } else {
                        console.log('ℹ️ Not restarting - recording stopped or no recognitionRef');
                        isRestartingRef.current = false;
                    }
                }, 100);
            } else {
                console.log('ℹ️ Not restarting - recording stopped or already restarting');
            }
        };

        recognitionRef.current = recognition;
    }, [speechSupported, isRecording, recognitionAttempts]);

    const startSpeechRecognition = useCallback(() => {
        if (!speechSupported || !recognitionRef.current) return;

        try {
            setLiveTranscript('');
            setInterimTranscript('');
            setError(null);
            recognitionRef.current.start();
            console.log('Speech recognition started successfully');
        } catch (error) {
            console.error('Failed to start speech recognition:', error);

            if (error.message && error.message.includes('already started')) {
                try {
                    recognitionRef.current.stop();
                    setTimeout(() => {
                        if (recognitionRef.current) {
                            recognitionRef.current.start();
                        }
                    }, 300);
                } catch (e) {
                    console.error('Failed to restart recognition:', e);
                }
            }
        }
    }, [speechSupported]);

    const stopSpeechRecognition = useCallback(() => {
        if (recognitionRef.current) {
            try {
                setIsListening(false);
                recognitionRef.current.stop();
                console.log('Speech recognition stopped successfully');
            } catch (error) {
                console.error('Failed to stop speech recognition:', error);
            }
        }
    }, []);

    const initializeRecorder = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 44100,
                    sampleSize: 16,
                    echoCancellation: true,
                    noiseSuppression: false,
                    autoGainControl: true,
                    volume: 1.0
                }
            });

            streamRef.current = stream;
            initAudioLevelMonitoring(stream);
            initSpeechRecognition();

            const mimeTypes = [
                'audio/wav',
                'audio/webm;codecs=opus',
                'audio/webm',
                'audio/ogg;codecs=opus'
            ];

            let selectedMimeType = null;
            for (const mimeType of mimeTypes) {
                if (MediaRecorder.isTypeSupported(mimeType)) {
                    selectedMimeType = mimeType;
                    console.log(`Using MIME type: ${mimeType}`);
                    break;
                }
            }

            if (!selectedMimeType) {
                throw new Error('No supported audio MIME type found');
            }

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: selectedMimeType,
                audioBitsPerSecond: 128000
            });

            mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                    console.log(`Recorded chunk: ${event.data.size} bytes`);
                }
            };

            mediaRecorder.onstart = () => {
                console.log('Recording started');
                setIsRecording(true);
                setAudioChunks([]);
                recordedChunksRef.current = [];
                setError(null);
                startTimer();
                startSpeechRecognition();
            };

            mediaRecorder.onstop = () => {
                console.log('Recording stopped');
                setIsRecording(false);
                stopTimer();
                stopAudioLevelMonitoring();
                stopSpeechRecognition();

                if (recordedChunksRef.current.length > 0) {
                    const completeBlob = new Blob(recordedChunksRef.current, { type: selectedMimeType });

                    console.log(`Complete recording: ${completeBlob.size} bytes`);

                    const chunk = {
                        data: completeBlob,
                        timestamp: Date.now(),
                        index: 0,
                        size: completeBlob.size
                    };

                    setAudioChunks([chunk]);
                } else {
                    console.warn('No audio data recorded');
                    setError('No audio data was recorded. Please check microphone permissions.');
                }
            };

            mediaRecorder.onerror = (error) => {
                console.error('MediaRecorder error:', error);
                setError('Recording error occurred');
                stopTimer();
                stopAudioLevelMonitoring();
                stopSpeechRecognition();
            };

            mediaRecorderRef.current = mediaRecorder;
            return true;

        } catch (error) {
            console.error('Failed to initialize recorder:', error);
            setError(`Failed to initialize recorder: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return false;
        }
    }, [initAudioLevelMonitoring, initSpeechRecognition, startTimer, stopTimer, stopAudioLevelMonitoring, startSpeechRecognition, stopSpeechRecognition]);

    const startRecording = useCallback(async () => {
        if (!mediaRecorderRef.current) {
            const initialized = await initializeRecorder();
            if (!initialized) return;
        }

        try {
            mediaRecorderRef.current?.start(1000);

            if (keepAliveIntervalRef.current) {
                clearInterval(keepAliveIntervalRef.current);
            }

            keepAliveIntervalRef.current = setInterval(() => {
                if (isRecording && !isListening && !isRestartingRef.current && recognitionRef.current) {
                    console.log('⚠️ Keep-alive: Recognition not listening, attempting restart...');
                    try {
                        recognitionRef.current.start();
                    } catch (e) {
                        console.log('Keep-alive restart skipped (already running or error)');
                    }
                }
            }, 3000);

        } catch (error) {
            console.error('Failed to start recording:', error);
            setError('Failed to start recording');
        }
    }, [initializeRecorder, isRecording, isListening]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();

            if (keepAliveIntervalRef.current) {
                clearInterval(keepAliveIntervalRef.current);
                keepAliveIntervalRef.current = null;
            }

            if (restartTimeoutRef.current) {
                clearTimeout(restartTimeoutRef.current);
                restartTimeoutRef.current = null;
            }

            isRestartingRef.current = false;
        }
    }, [isRecording]);

    const processAudioChunks = useCallback(async () => {
        if (audioChunks.length === 0) {
            setError('No audio chunks to process');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const chunk = audioChunks[0];

            if (chunk.size < 1000) {
                throw new Error('Audio file too small. Please record for longer duration.');
            }

            const formData = new FormData();
            formData.append('files', chunk.data, 'complete_recording.webm');

            const response = await fetch(`${BACKEND_URL}/live-speech-to-text/live-chunks`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch {
                    errorData = { detail: errorText || 'Unknown error' };
                }

                throw new Error(`HTTP ${response.status}: ${errorData.detail || 'Request failed'}`);
            }

            const result = await response.json();

            if (!result.transcript || result.transcript.trim() === '') {
                setError('No speech was detected in the recording. Please try recording again and speak clearly.');
            } else {
                setTranscription(result);
                setActiveTab('transcript');
                setLiveTranscript('');
                setInterimTranscript('');
            }

        } catch (error) {
            console.error('Failed to process audio chunks:', error);
            setError(`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsProcessing(false);
        }
    }, [audioChunks, BACKEND_URL]);

    const testSingleChunk = useCallback(async (chunkIndex) => {
        const chunk = audioChunks[chunkIndex];
        if (!chunk) return;

        try {
            const formData = new FormData();
            formData.append('file', chunk.data, `test_chunk_${chunk.index}.webm`);

            const response = await fetch(`${BACKEND_URL}/live-speech-to-text/live-single`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
                throw new Error(`HTTP ${response.status}: ${errorData.detail}`);
            }

            const result = await response.json();

            alert(`Chunk ${chunkIndex} transcript: "${result.transcript}"\nDuration: ${result.audio_info.duration.toFixed(2)}s`);

        } catch (error) {
            alert(`Failed to test chunk ${chunkIndex}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }, [audioChunks, BACKEND_URL]);

    const cleanup = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current = null;
        }
        stopSpeechRecognition();

        if (keepAliveIntervalRef.current) {
            clearInterval(keepAliveIntervalRef.current);
            keepAliveIntervalRef.current = null;
        }
        if (restartTimeoutRef.current) {
            clearTimeout(restartTimeoutRef.current);
            restartTimeoutRef.current = null;
        }

        recordedChunksRef.current = [];
        setIsRecording(false);
        setAudioChunks([]);
        setTranscription(null);
        setError(null);
        setActiveTab('transcript');
        stopTimer();
        stopAudioLevelMonitoring();
        setRecordingTime(0);
        setLiveTranscript('');
        setInterimTranscript('');
        setRecognitionAttempts(0);
        isRestartingRef.current = false;
    }, [stopTimer, stopAudioLevelMonitoring, stopSpeechRecognition]);

    const testMicrophone = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            alert('Microphone access granted! You can now start recording.');
        } catch (error) {
            console.error('Microphone test failed:', error);
            setError(`Microphone access failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }, []);

    useEffect(() => {
        return () => {
            cleanup();
        };
    }, [cleanup]);

    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const renderTabNavigation = () => {
        if (!transcription) return null;

        const tabs = [
            { id: 'transcript', label: 'Transcript', icon: FileText },
            { id: 'overview', label: 'Meeting Overview', icon: Calendar },
            { id: 'attendance', label: 'Attendance', icon: Users },
            { id: 'actions', label: 'Action Items', icon: CheckSquare },
            { id: 'decisions', label: 'Decisions', icon: Target },
            { id: 'followup', label: 'Follow-up', icon: Clock },
            { id: 'risks', label: 'Risks & Blockers', icon: AlertTriangle }
        ];

        return (
            <div className="border-b mb-6 border-gray-200">
                <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        let badge = null;
                        if (tab.id === 'attendance' && transcription.mom.attendance.total_participants > 0) {
                            badge = transcription.mom.attendance.total_participants;
                        } else if (tab.id === 'actions' && transcription.mom.action_items.length > 0) {
                            badge = transcription.mom.action_items.length;
                        } else if (tab.id === 'decisions' && transcription.mom.decisions.length > 0) {
                            badge = transcription.mom.decisions.length;
                        } else if (tab.id === 'risks' && transcription.mom.risks_and_blockers.length > 0) {
                            badge = transcription.mom.risks_and_blockers.length;
                        }

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${isActive
                                    ? 'border-blue-900 text-blue-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                                {badge && (
                                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-900">
                                        {badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full max-w-7xl mx-auto mt-25 bg-white rounded-xl p-6 mb-6 border border-gray-200 shadow-sm">
            {/* Header Section */}
            <div className="sticky top-0 z-10 ">
                <div className="max-w-7xl mx-auto  py-5 relative">
                    <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center relative bg-blue-900" style={{ boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)' }}>
                            <Radio className="w-7 h-7 text-white" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse bg-red-500" style={{ boxShadow: '0 0 12px rgba(239, 68, 68, 0.6)' }}></div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-blue-900">Live Speech to Text Agent</h1>
                            <p className="text-sm text-gray-500">Real-time speech recognition with instant conversion</p>
                        </div>
                    </div>

                    {/* Back Button */}
                    <button
                        onClick={() => window.history.back()}
                        className="absolute top-1/2 right-6 -translate-y-1/2 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 bg-blue-900 text-white shadow-sm hover:bg-blue-800"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Back</span>
                    </button>
                </div>
            </div>
            {/* Recording Controls */}
            <div className="mt-5">
                <h2 className="text-xl font-semibold mb-4 text-blue-900">Recording Controls</h2>

                <div className="flex flex-wrap gap-3 mb-4">
                    <button
                        onClick={testMicrophone}
                        disabled={isRecording || isProcessing}
                        className="px-6 py-3 bg-blue-900 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-blue-800"
                    >
                        <Mic className="w-5 h-5" />
                        Test Microphone
                    </button>

                    <button
                        onClick={startRecording}
                        disabled={isRecording || isProcessing}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-green-700"
                    >
                        <Play className="w-5 h-5" />
                        Start Recording
                    </button>

                    <button
                        onClick={stopRecording}
                        disabled={!isRecording || isProcessing}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-red-700"
                    >
                        <Square className="w-5 h-5" />
                        Stop Recording
                    </button>

                    <button
                        onClick={processAudioChunks}
                        disabled={isRecording || isProcessing || audioChunks.length === 0}
                        className="px-6 py-3 bg-blue-900 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-blue-800"
                    >
                        {isProcessing ? (
                            <>
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Processing...
                            </>
                        ) : 'Generate Meeting Minutes'}
                    </button>

                    <button
                        onClick={cleanup}
                        disabled={isRecording || isProcessing}
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-gray-700"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Reset
                    </button>
                </div>

                {/* Recording Status */}
                {isRecording && (
                    <div className="mb-4 space-y-4">
                        <div className="p-4 rounded-lg border bg-green-50 border-green-500">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
                                    <span className="font-medium text-green-700">Recording in progress...</span>
                                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-green-500">
                                        <Clock className="w-4 h-4 text-green-600" />
                                        <span className="font-mono font-semibold text-green-700">{formatTime(recordingTime)}</span>
                                    </div>
                                </div>
                                <Mic className="w-5 h-5 text-green-600" />
                            </div>

                            {/* Audio Level Visualizer */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Mic className="w-4 h-4 text-green-700" />
                                        <span className="text-sm font-medium text-green-700">Audio Level</span>
                                    </div>
                                    <span className="text-sm font-mono font-semibold px-2 py-0.5 rounded bg-green-100 text-green-700">
                                        {audioLevel.toFixed(0)}%
                                    </span>
                                </div>

                                <div className="flex items-end gap-1 h-16 bg-white rounded-lg p-2 border border-green-500">
                                    {[...Array(40)].map((_, i) => {
                                        const barHeight = Math.max(10, Math.sin((i + audioLevel) * 0.3) * audioLevel * 0.6 + Math.random() * 20);
                                        const color = audioLevel > 70 ? '#059669' : audioLevel > 30 ? '#F59E0B' : '#DC2626';
                                        return (
                                            <div
                                                key={i}
                                                className="flex-1 rounded-t transition-all duration-100"
                                                style={{
                                                    height: `${barHeight}%`,
                                                    backgroundColor: color,
                                                    opacity: 0.7
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Live Transcription Display */}
                {(isRecording || liveTranscript || interimTranscript) && (
                    <div className="mt-4 p-4 rounded-lg border bg-blue-50 border-blue-200">
                        <div className="flex items-center gap-2 mb-3">
                            <Radio className="w-5 h-5 animate-pulse text-blue-900" />
                            <h3 className="font-semibold text-blue-900">
                                Live Transcription
                                {isListening && (
                                    <span className="ml-2 text-sm font-normal text-green-600">● Listening...</span>
                                )}
                            </h3>
                            {!speechSupported && (
                                <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                                    Browser not supported - using audio recording only
                                </span>
                            )}
                        </div>

                        <div className="rounded-lg p-4 max-h-64 overflow-y-auto bg-white border border-blue-200">
                            {speechSupported ? (
                                <>
                                    {liveTranscript || interimTranscript ? (
                                        <div className="space-y-2">
                                            {liveTranscript && (
                                                <p className="leading-relaxed whitespace-pre-wrap text-gray-800">
                                                    {liveTranscript}
                                                </p>
                                            )}
                                            {interimTranscript && (
                                                <p className="leading-relaxed whitespace-pre-wrap italic text-gray-500">
                                                    {interimTranscript}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-center italic text-gray-400">
                                            Start speaking to see your words appear here in real-time...
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p className="text-center text-gray-600">
                                    Real-time transcription not available. Your speech will be transcribed after you stop recording.
                                </p>
                            )}
                        </div>

                        {speechSupported && liveTranscript && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                                <FileText className="w-4 h-4" />
                                <span>Word count: {liveTranscript.split(/\s+/).filter(Boolean).length}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Audio Chunks Info */}
                {audioChunks.length > 0 && !isRecording && (
                    <div className="mt-4 p-4 rounded-lg border bg-gray-50 border-gray-200">
                        <h3 className="font-medium mb-2 text-gray-700">
                            Recorded Audio: {audioChunks.length} file · Duration: {formatTime(recordingTime)}
                            · Size: {(audioChunks.reduce((sum, chunk) => sum + chunk.size, 0) / 1024).toFixed(1)} KB
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {audioChunks.map((chunk, index) => (
                                <button
                                    key={chunk.index}
                                    onClick={() => testSingleChunk(index)}
                                    className="px-3 py-1 text-sm rounded font-medium transition-colors bg-blue-50 text-blue-900 hover:bg-blue-100"
                                    title={`Test recording (${(chunk.size / 1024).toFixed(1)} KB)`}
                                >
                                    Test Audio
                                </button>
                            ))}
                        </div>
                        <p className="text-sm mt-2 text-gray-600">
                            Click "Generate Meeting Minutes" to transcribe and create comprehensive meeting minutes
                        </p>
                    </div>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="rounded-lg p-4 mb-6 border bg-red-50 border-red-300">
                    <div className="flex">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-900">Error</h3>
                            <p className="mt-1 text-sm text-red-600">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Processing Status */}
            {isProcessing && (
                <div className="rounded-lg p-4 mb-6 border bg-blue-50 border-blue-200">
                    <div className="flex items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-900"></div>
                        <p className="ml-3 text-blue-900">Processing audio and generating comprehensive meeting minutes...</p>
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="rounded-lg p-4 mb-6 border bg-gray-50 border-gray-200">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-medium mb-2 text-blue-900">How to Use:</h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                            <li>Test microphone access</li>
                            <li>Start recording your meeting</li>
                            <li>Watch your words appear in real-time</li>
                            <li>Monitor audio level and recording time</li>
                            <li>Speak clearly, mention names and roles</li>
                            <li>Stop recording when finished</li>
                            <li>Generate comprehensive meeting minutes</li>
                        </ol>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            {renderTabNavigation()}

            {/* Results Display */}
            {transcription && (
                <div className="space-y-6">
                    {/* Processing Info */}
                    {/* {transcription.processing_info && (
                        <div className="rounded-lg p-4 border bg-gray-50 border-gray-200">
                            <h3 className="text-lg font-semibold mb-2 text-blue-900">Processing Information</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">Files Processed:</span>
                                    <br />
                                    <span className="text-gray-600">
                                        {transcription.processing_info.successful_files}/{transcription.processing_info.total_files}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Processing Time:</span>
                                    <br />
                                    <span className="text-gray-600">
                                        {transcription.processing_info.processing_time?.toFixed(2)}s
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Transcription Time:</span>
                                    <br />
                                    <span className="text-gray-600">
                                        {transcription.processing_info.transcription_time?.toFixed(2)}s
                                    </span>
                                </div>
                            </div>
                        </div>
                    )} */}

                    {/* Tab Content */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        {/* Transcript Tab */}
                        {activeTab === 'transcript' && (
                            <div>
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-900">
                                    <FileText className="w-5 h-5" />
                                    Final Transcript
                                </h3>
                                <div className="rounded-lg p-4 bg-gray-50">
                                    <p className="leading-relaxed whitespace-pre-wrap text-gray-700">
                                        {transcription.transcript || 'No transcript available'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Meeting Overview Tab */}
                        {activeTab === 'overview' && (
                            <div>
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-900">
                                    <Calendar className="w-5 h-5" />
                                    Meeting Overview
                                </h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="rounded-lg p-4 bg-blue-50">
                                        <h4 className="font-medium mb-3 text-blue-900">Meeting Details</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-blue-900">Date:</span>
                                                <span className="font-medium text-gray-800">{transcription.mom.meeting_info.date}</span>
                                            </div>
                                            {/* <div className="flex justify-between">
                                                <span className="text-blue-900">Time/Duration:</span>
                                                <span className="font-medium text-gray-800">{transcription.mom.meeting_info.time}</span>
                                            </div> */}
                                            <div className="flex justify-between">
                                                <span className="text-blue-900">Type:</span>
                                                <span className="font-medium capitalize text-gray-800">{transcription.mom.meeting_info.meeting_type}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-lg p-4 bg-green-50">
                                        <h4 className="font-medium mb-3 text-green-700">Key Topics</h4>
                                        {transcription.mom.summary.key_topics.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {transcription.mom.summary.key_topics.map((topic, index) => (
                                                    <span key={index} className="px-2 py-1 rounded text-sm bg-green-200 text-green-800">
                                                        {topic}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-green-600">No key topics identified</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <div className="rounded-lg p-4 mb-3 bg-blue-50">
                                        <h4 className="font-medium mb-2 text-blue-900">Overview</h4>
                                        <p className="text-blue-900">{transcription.mom.summary.overview}</p>
                                    </div>
                                    <div className="rounded-lg p-4 bg-gray-50">
                                        <h4 className="font-medium mb-2 text-gray-800">Detailed Notes</h4>
                                        <p className="whitespace-pre-wrap text-gray-700">{transcription.mom.summary.detailed}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Attendance Tab */}
                        {activeTab === 'attendance' && (
                            <div>
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-900">
                                    <Users className="w-5 h-5" />
                                    Meeting Attendance ({transcription.mom.attendance.total_participants})
                                </h3>

                                {transcription.mom.attendance.participants.length > 0 ? (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {transcription.mom.attendance.participants.map((participant, index) => (
                                            <div key={index} className="rounded-lg p-4 border bg-gray-50 border-gray-200">
                                                <div className="flex items-start gap-3">
                                                    <User className="w-8 h-8 mt-1 text-gray-400" />
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-800">{participant.name}</h4>
                                                        {participant.role && participant.role !== 'Not specified' && (
                                                            <p className="text-sm mt-1 text-gray-600">{participant.role}</p>
                                                        )}
                                                        <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${participant.attendance_status === 'present'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {participant.attendance_status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p className="text-gray-600">No participants identified in the transcript</p>
                                        <p className="text-sm mt-2 text-gray-400">Try mentioning names and roles during the meeting</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Items Tab */}
                        {activeTab === 'actions' && (
                            <div>
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-900">
                                    <CheckSquare className="w-5 h-5" />
                                    Action Items ({transcription.mom.action_items.length})
                                </h3>

                                {transcription.mom.action_items.length > 0 ? (
                                    <div className="space-y-4">
                                        {transcription.mom.action_items.map((item) => (
                                            <div key={item.id} className="border-l-4 p-4 rounded-r-lg bg-gray-50 border-blue-900">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-sm font-medium text-gray-600">#{item.id}</span>
                                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
                                                                <Flag className="w-3 h-3 inline mr-1" />
                                                                {item.priority} priority
                                                            </span>
                                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-900">
                                                                {item.category}
                                                            </span>
                                                        </div>
                                                        <p className="font-medium mb-2 text-blue-900">{item.task}</p>
                                                        <div className="text-sm space-y-1 text-gray-700">
                                                            {item.assigned_to && item.assigned_to !== 'Not specified' && (
                                                                <p>
                                                                    <User className="w-4 h-4 inline mr-1" />
                                                                    Assigned to: <span className="font-medium">{item.assigned_to}</span>
                                                                </p>
                                                            )}
                                                            {item.deadline && item.deadline !== 'N/A' && item.deadline !== 'Not specified' && (
                                                                <p>
                                                                    <Calendar className="w-4 h-4 inline mr-1" />
                                                                    Deadline: <span className="font-medium">{item.deadline}</span>
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <CheckSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p className="text-gray-600">No action items identified</p>
                                        <p className="text-sm mt-2 text-gray-400">Action items will be automatically detected from meeting discussions</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Decisions Tab */}
                        {activeTab === 'decisions' && (
                            <div>
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-900">
                                    <Target className="w-5 h-5" />
                                    Decisions ({transcription.mom.decisions.length})
                                </h3>

                                {transcription.mom.decisions.length > 0 ? (
                                    <div className="space-y-4">
                                        {transcription.mom.decisions.map((decision) => (
                                            <div key={decision.id} className="border rounded-lg p-4 bg-green-50 border-green-500">
                                                <div className="mb-3">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-sm font-medium text-gray-600">Decision #{decision.id}</span>
                                                    </div>
                                                    <h4 className="font-medium text-lg text-green-700">{decision.decision}</h4>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-4 mt-4">
                                                    {decision.rationale && (
                                                        <div className="bg-white rounded p-3">
                                                            <h5 className="font-medium mb-1 text-green-600">Rationale</h5>
                                                            <p className="text-sm text-green-700">{decision.rationale}</p>
                                                        </div>
                                                    )}

                                                    {decision.impact && (
                                                        <div className="bg-white rounded p-3">
                                                            <h5 className="font-medium mb-1 text-green-600">Impact</h5>
                                                            <p className="text-sm text-green-700">{decision.impact}</p>
                                                        </div>
                                                    )}

                                                    {decision.responsible_party && decision.responsible_party !== 'Not specified' && (
                                                        <div className="bg-white rounded p-3">
                                                            <h5 className="font-medium mb-1 text-green-600">Responsible Party</h5>
                                                            <p className="text-sm text-green-700">
                                                                <User className="w-4 h-4 inline mr-1" />
                                                                {decision.responsible_party}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {decision.timeline && decision.timeline !== 'Not specified' && (
                                                        <div className="bg-white rounded p-3">
                                                            <h5 className="font-medium mb-1 text-green-600">Timeline</h5>
                                                            <p className="text-sm text-green-700">
                                                                <Clock className="w-4 h-4 inline mr-1" />
                                                                {decision.timeline}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p className="text-gray-600">No decisions identified</p>
                                        <p className="text-sm mt-2 text-gray-400">Decisions will be automatically detected from meeting discussions</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Follow-up Tab */}
                        {activeTab === 'followup' && (
                            <div>
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-900">
                                    <Clock className="w-5 h-5" />
                                    Follow-up Planning
                                </h3>

                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="rounded-lg p-4 bg-blue-50">
                                        <h4 className="font-medium mb-3 text-blue-900">Next Meeting</h4>
                                        <p className="text-blue-900">
                                            {transcription.mom.follow_up.next_meeting !== 'TBD' && transcription.mom.follow_up.next_meeting !== 'Not specified'
                                                ? transcription.mom.follow_up.next_meeting
                                                : 'To be determined'}
                                        </p>
                                    </div>

                                    <div className="rounded-lg p-4 bg-orange-200">
                                        <h4 className="font-medium mb-3 text-orange-900">Pending Items ({transcription.mom.follow_up.pending_items.length})</h4>
                                        {transcription.mom.follow_up.pending_items.length > 0 ? (
                                            <ul className="text-sm space-y-1 text-orange-800">
                                                {transcription.mom.follow_up.pending_items.map((item, index) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <span>•</span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-orange-600">No pending items</p>
                                        )}
                                    </div>

                                    <div className="rounded-lg p-4 bg-purple-100">
                                        <h4 className="font-medium mb-3 text-purple-900">Required Approvals ({transcription.mom.follow_up.required_approvals.length})</h4>
                                        {transcription.mom.follow_up.required_approvals.length > 0 ? (
                                            <ul className="text-sm space-y-1 text-purple-700">
                                                {transcription.mom.follow_up.required_approvals.map((approval, index) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <span>•</span>
                                                        {approval}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-purple-600">No approvals needed</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Risks & Blockers Tab */}
                        {activeTab === 'risks' && (
                            <div>
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-900">
                                    <AlertTriangle className="w-5 h-5" />
                                    Risks & Blockers ({transcription.mom.risks_and_blockers.length})
                                </h3>

                                {transcription.mom.risks_and_blockers.length > 0 ? (
                                    <div className="space-y-4">
                                        {transcription.mom.risks_and_blockers.map((risk, index) => (
                                            <div key={index} className="border rounded-lg p-4 bg-red-50 border-red-300">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <AlertTriangle className="w-5 h-5 text-red-600" />
                                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(risk.severity)}`}>
                                                                {risk.severity} severity
                                                            </span>
                                                        </div>
                                                        <p className="font-medium mb-2 text-red-900">{risk.issue}</p>
                                                        {risk.owner && risk.owner !== 'Not specified' && (
                                                            <p className="text-sm text-red-600">
                                                                <User className="w-4 h-4 inline mr-1" />
                                                                Owner: <span className="font-medium">{risk.owner}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p className="text-gray-600">No risks or blockers identified</p>
                                        <p className="text-sm mt-2 text-gray-400">Risks and blockers will be automatically detected from meeting discussions</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}