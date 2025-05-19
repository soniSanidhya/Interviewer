import React, { useMemo, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import VideoCallWindow from './VideoCallWindow';
import { FiMaximize2, FiMinimize2, FiChevronDown, FiChevronUp, FiCode, FiMessageSquare, FiVideo, FiAlertTriangle, FiEdit2, FiCheckCircle, FiPlay, FiFileText } from 'react-icons/fi';
import SessionSecurityWrapper from './SessionSecurityWrapper';
import { Rnd } from 'react-rnd';
import '../../stylings/RoomPage.css';
import Rating from 'react-rating';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { BASE_URL } from '@/utils/constants';

function RoomPage() {
    const { roomId } = useParams();
    const [id, setId] = useState("no");
    const [content, setContent] = useState("// Write your code here\nfunction hello() {\n  return \"Hello World!\";\n}");
    const [output, setOutput] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [messages, setMessages] = useState([
        { sender: 'Auto Generated', text: 'Start Messaging', time: '' },
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [cheatLogs, setCheatLogs] = useState(() => {
        try {
            const savedLogs = localStorage.getItem(`security_${roomId}`);
            return savedLogs ? JSON.parse(savedLogs) : [];
        } catch (e) {
            console.error("Error parsing saved security logs:", e);
            return [];
        }
    });
    const [notes, setNotes] = useState(() => {
        const savedNotes = localStorage.getItem(`notes_${roomId}`);
        return savedNotes || "Candidate seems nervous but has good fundamentals.";
    });
    const [evaluation, setEvaluation] = useState(null);
    const [panels, setPanels] = useState({
        codeEditor: true,
        videoCall: true,
        messaging: true,
        security: false,
        evaluation: false,
        notes: false
    });
    const [showEvaluationForm, setShowEvaluationForm] = useState(false);
    const [showSecurityAlerts, setShowSecurityAlerts] = useState(false);
    const [showNotesPanel, setShowNotesPanel] = useState(false);
    const [activePanel, setActivePanel] = useState(null);

    const [isFullscreen, setIsFullscreen] = useState(false);
    const toggleFullscreen = () => setIsFullscreen(prev => !prev);
    const editorWidth = "100%";

    //new work start
    function generateEvaluationState(evalForm) {
        const result = {};

        for (const section in evalForm) {
            const sectionData = evalForm[section];
            result[section] = {};

            for (const subSection in sectionData) {
                const items = sectionData[subSection];

                // If it's an object with booleans
                if (typeof items === 'object' && !Array.isArray(items)) {
                    const subSectionObj = {};
                    for (const [key, val] of Object.entries(items)) {
                        if (val === true) {
                            subSectionObj[key] = { rating: 0, notes: "" };
                        } else if (Array.isArray(val)) {
                            // For arrays inside objects, like certifications
                            const questionObj = {};
                            val.forEach((q) => {
                                questionObj[q] = { rating: 0, notes: "" };
                            });
                            subSectionObj[key] = questionObj;
                        }
                    }
                    if (Object.keys(subSectionObj).length > 0) {
                        result[section][subSection] = subSectionObj;
                    }
                }

                // If it's an array (questions)
                if (Array.isArray(items)) {
                    result[section][subSection] = {};
                    items.forEach((q) => {
                        result[section][subSection][q] = { rating: 0, notes: "" };
                    });
                }
            }
        }
        // console.log("result ", result);

        return result;
    }

    useEffect(() => {
        const getEvaluationForm = async () => {
            try {
                const response = await fetch(`${BASE_URL}/getEvalForm/${roomId}`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) throw new Error(`Error: ${response.statusText}`);
                const data = await response.json();
                const evalForm = data.evalForm.evalForm;

                const structuredEval = generateEvaluationState(evalForm);
                setEvaluation(structuredEval);

            } catch (error) {
                console.error("Failed to fetch evaluation form:", error);
                
                // Try to load from localStorage if fetch fails
                const savedEvaluation = localStorage.getItem(`evaluation_${roomId}`);
                if (savedEvaluation) {
                    try {
                        setEvaluation(JSON.parse(savedEvaluation));
                        console.log("Loaded evaluation from local storage");
                    } catch (e) {
                        console.error("Error parsing saved evaluation:", e);
                    }
                }
            }
        };

        getEvaluationForm();
    }, [roomId]);


    //new work end

    //socket work start
    // const socket = useMemo(() => io("http://localhost:4000"), []);
    const socket = useMemo(() => io("https://socketnodejs-a2g8c8f7g7avaudc.southindia-01.azurewebsites.net"), []);

    useEffect(() => {
        socket.emit('join-room', roomId);

        socket.on("connect", () => {
            // console.log("connected", socket.id);
            setId(socket.id);
        });

        socket.on("warning-detected", (warning) => {
            // console.log("connected", socket.id);
            console.log("warning ", warning);

            const newlog = { type: warning, time: new Date(), severity: 'high' }
            setCheatLogs(prev => [...prev, newlog]);
        });

        socket.on("editorContentUpdate", (newContent) => setContent(newContent));
        socket.on("languageChange", (newLanguage) => setLanguage(newLanguage));
        socket.on("messageRecieved", (message) => {
            setMessages(prev => [...prev, message]);
        });
        socket.on("cheatDetected", (log) => {
            setCheatLogs(prev => [...prev, log]);
            setShowSecurityAlerts(true);
            setActivePanel('security');
        });

        return () => {
            socket.disconnect();
        };
    }, [socket, roomId]);

    const handleEditorChange = (newContent) => {
        setContent(newContent || "");
        socket.emit("editorContentUpdate", { newContent, roomId });
    };

    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        setLanguage(newLanguage);
        socket.emit("languageChange", newLanguage);
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message = {
                sender: "Interviewer",
                text: newMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            socket.emit("sendMessage", { roomId, message });
            // console.log("emitted ", message);

            setMessages(prev => [...prev, message]);
            setNewMessage("");
        }
    };
    //socket work end


    //code execution start
    const handleRunCode = async () => {
        const response = await fetch(`${BASE_URL}/exec-code`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: content,
                language: language.toLowerCase()
            }),
        });
        const data = await response.json()
        const mockOutput = `Running ${language} code...\n\n> ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}\n\n"Hello World!"\n\nCode executed successfully at ${new Date().toLocaleTimeString()}`;
        setOutput(data.output);
        // console.log("op: ",data);

    };
    //code execution end

    //evaluation start
    const handleSubmitEvaluation = () => {
        alert("Evaluation submitted!");
        console.log("Evaluation:", JSON.stringify(evaluation));
        
        // Save to localStorage first for backup
        localStorage.setItem(`evaluation_${roomId}`, JSON.stringify(evaluation));
        
        fetch(`${BASE_URL}/saveEvalForm/${roomId}`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: evaluation }),
        })
        .then(res => res.json())
        .then(data => {
            // Optionally show success message
            console.log('Evaluation saved successfully');
        })
        .catch(err => {
            console.error('Failed to save evaluation:', err);
            alert('There was an error saving the evaluation, but your data is backed up locally');
        });
    };
    //evaluation end


    //editor configs
    const editorDidMount = (editor, monaco) => {
        monaco.languages.registerCompletionItemProvider('javascript', {
            provideCompletionItems: () => ({
                suggestions: [
                    { label: 'console.log', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'console.log(${1:object});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Log output to console' },
                    { label: 'function', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'function ${1:functionName}(${2:params}) {\n\t${3:// body}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Function declaration' },
                    { label: 'if', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'if (${1:condition}) {\n\t${2:// body}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'If statement' },
                    { label: 'for loop', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:array}.length; ${1:i}++) {\n\t${3:// body}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'For loop' },
                    { label: 'async function', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'async function ${1:functionName}(${2:params}) {\n\t${3:// body}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Async function declaration' },
                ],
            }),
        });
    };

    //toggle panel
    const togglePanel = (panel) => {
        setPanels(prev => ({ ...prev, [panel]: !prev[panel] }));
    };

    // Add a function to save notes
    const handleSaveNotes = () => {
        localStorage.setItem(`notes_${roomId}`, notes);
        alert("Notes saved successfully!");
    };

    // Add useEffect to save cheatLogs to localStorage when they change
    useEffect(() => {
        if (cheatLogs.length > 0) {
            localStorage.setItem(`security_${roomId}`, JSON.stringify(cheatLogs));
        }
    }, [cheatLogs, roomId]);

    // Update the clear alerts button
    const handleClearAlerts = () => {
        setCheatLogs([]);
        localStorage.removeItem(`security_${roomId}`);
    };

    // Add this useEffect for auto-saving notes with debounce
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            localStorage.setItem(`notes_${roomId}`, notes);
        }, 1000); // Save after 1 second of inactivity
        
        return () => clearTimeout(debounceTimer);
    }, [notes, roomId]);

    return (
        <div className="bg-night flex flex-col h-screen bg-gray-900 p-2">
            {/* Header */}
            <header className="bg-gray-900 rounded-lg shadow px-4 py-3 mb-4">
                <div className="flex flex-wrap justify-between items-center gap-y-2">
                    <h1 className="text-2xl font-bold text-white">Interview Room: {roomId}</h1>

                    <div className="flex flex-wrap items-center gap-3 border-gray-200 rounded-lg px-3 py-2">
                        <span className="h-3 w-3 rounded-full bg-green-500"></span>
                        <span className="text-white text-sm">Connected as ID: {id}</span>

                        <button
                            onClick={() => {
                                setShowSecurityAlerts(!showSecurityAlerts);
                                if (!showSecurityAlerts) setActivePanel('security');
                            }}
                            className={`px-4 py-2 rounded-lg text-sm flex items-center transition-all ${showSecurityAlerts ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'
                                }`}
                        >
                            <FiAlertTriangle className="mr-1" /> Security Alerts
                        </button>

                        <button
                            onClick={() => {
                                setShowEvaluationForm(!showEvaluationForm);
                                if (!showEvaluationForm) setActivePanel('evaluation');
                            }}
                            className={`px-4 py-2 rounded-lg text-sm flex items-center transition-all ${showEvaluationForm ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                                }`}
                        >
                            <FiEdit2 className="mr-1" /> Evaluation Form
                        </button>

                        <button
                            onClick={() => {
                                setShowNotesPanel(!showNotesPanel);
                                if (!showNotesPanel) setActivePanel('notes');
                            }}
                            className={`px-4 py-2 rounded-lg text-sm flex items-center transition-all ${showNotesPanel ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'
                                }`}
                        >
                            <FiFileText className="mr-1" /> Notes
                        </button>

                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-all">
                            End Interview
                        </button>
                    </div>
                </div>
            </header>


            {/* Floating Evaluation Form */}


            {showEvaluationForm && (
                <Rnd
                    default={{
                        x: window.innerWidth - 850,
                        y: 100,
                        width: 700,
                        height: 750,
                    }}
                    minWidth={550}
                    minHeight={600}
                    bounds="parent"
                    enableResizing={{
                        top: true,
                        right: true,
                        bottom: true,
                        left: true,
                        topRight: true,
                        bottomRight: true,
                        bottomLeft: true,
                        topLeft: true
                    }}
                    className="border border-gray-200 bg-white rounded-lg shadow-xl overflow-hidden"
                    style={{ zIndex: activePanel === 'evaluation' ? 100 : 10 }}
                    onClick={() => setActivePanel('evaluation')}
                    onDragStart={() => setActivePanel('evaluation')}
                    onDragStop={() => setActivePanel('evaluation')}
                >
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-800 cursor-move">
                            <div className="flex items-center space-x-3">
                                <FiCheckCircle className="text-white text-xl" />
                                <h2 className="font-semibold text-white text-lg">Performance Evaluation</h2>
                            </div>
                            <button
                                onClick={() => setShowEvaluationForm(false)}
                                className="text-white hover:text-gray-200 text-xl"
                            >
                                ×
                            </button>
                        </div>

                        {/* Form Content */}
                        <div className="p-4 overflow-y-auto flex-1 bg-gray-50">
                            <div className="space-y-6">
                                {Object.entries(evaluation).map(([sectionKey, sectionValue]) => (
                                    <div key={sectionKey} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-bold text-blue-800 mb-3 border-b pb-2 capitalize">{sectionKey.replace(/_/g, ' ')}</h3>
                                        {Object.entries(sectionValue).map(([subKey, subValue]) => (
                                            <div key={subKey} className="ml-2 mb-4">
                                                <h4 className="font-semibold text-gray-800 mb-3 text-md capitalize">{subKey.replace(/_/g, ' ')}</h4>
                                                {Object.entries(subValue).map(([itemKey, itemVal]) => {
                                                    // If it's a nested object of questions
                                                    if (itemVal && typeof itemVal === 'object' && itemVal.rating === undefined) {
                                                        return (
                                                            <div key={itemKey} className="ml-2 mb-4 bg-gray-50 p-3 rounded border border-gray-200">
                                                                <h5 className="text-sm font-medium text-gray-700 mb-3 capitalize">{itemKey.replace(/_/g, ' ')}</h5>
                                                                {Object.entries(itemVal).map(([q, qVal]) => (
                                                                    <div key={q} className="mb-4 pl-2">
                                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                                                                            <label className="block text-sm font-medium text-gray-700 flex-1">{q.replace(/_/g, ' ')}</label>
                                                                            <div className="flex items-center">
                                                                                <span className="text-xs text-gray-500 mr-2">{qVal.rating || 0}/5</span>
                                                                                <Rating
                                                                                    initialRating={qVal.rating}
                                                                                    emptySymbol={<FaRegStar className="text-yellow-400 text-xl" />}
                                                                                    fullSymbol={<FaStar className="text-yellow-400 text-xl" />}
                                                                                    fractions={2}
                                                                                    onChange={(value) =>
                                                                                        setEvaluation(prev => ({
                                                                                            ...prev,
                                                                                            [sectionKey]: {
                                                                                                ...prev[sectionKey],
                                                                                                [subKey]: {
                                                                                                    ...prev[sectionKey][subKey],
                                                                                                    [itemKey]: {
                                                                                                        ...prev[sectionKey][subKey][itemKey],
                                                                                                        [q]: {
                                                                                                            ...prev[sectionKey][subKey][itemKey][q],
                                                                                                            rating: value
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }))
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <textarea
                                                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                            rows={2}
                                                                            placeholder="Add your comments..."
                                                                            value={qVal.notes}
                                                                            onChange={(e) =>
                                                                                setEvaluation(prev => ({
                                                                                    ...prev,
                                                                                    [sectionKey]: {
                                                                                        ...prev[sectionKey],
                                                                                        [subKey]: {
                                                                                            ...prev[sectionKey][subKey],
                                                                                            [itemKey]: {
                                                                                                ...prev[sectionKey][subKey][itemKey],
                                                                                                [q]: {
                                                                                                    ...prev[sectionKey][subKey][itemKey][q],
                                                                                                    notes: e.target.value
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }))
                                                                            }
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        );
                                                    }

                                                    // Standard case: itemVal has rating and notes
                                                    return (
                                                        <div key={itemKey} className="mb-4 pl-2">
                                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                                                                <label className="block text-sm font-medium text-gray-700 flex-1 capitalize">{itemKey.replace(/_/g, ' ')}</label>
                                                                <div className="flex items-center">
                                                                    <span className="text-xs text-gray-500 mr-2">{itemVal.rating || 0}/5</span>
                                                                    <Rating
                                                                        initialRating={itemVal.rating}
                                                                        emptySymbol={<FaRegStar className="text-yellow-400 text-xl" />}
                                                                        fullSymbol={<FaStar className="text-yellow-400 text-xl" />}
                                                                        fractions={2}
                                                                        onChange={(value) =>
                                                                            setEvaluation(prev => ({
                                                                                ...prev,
                                                                                [sectionKey]: {
                                                                                    ...prev[sectionKey],
                                                                                    [subKey]: {
                                                                                        ...prev[sectionKey][subKey],
                                                                                        [itemKey]: {
                                                                                            ...prev[sectionKey][subKey][itemKey],
                                                                                            rating: value
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }))
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                            <textarea
                                                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                rows={2}
                                                                placeholder="Add your comments..."
                                                                value={itemVal.notes}
                                                                onChange={(e) =>
                                                                    setEvaluation(prev => ({
                                                                        ...prev,
                                                                        [sectionKey]: {
                                                                            ...prev[sectionKey],
                                                                            [subKey]: {
                                                                                ...prev[sectionKey][subKey],
                                                                                [itemKey]: {
                                                                                    ...prev[sectionKey][subKey][itemKey],
                                                                                    notes: e.target.value
                                                                                }
                                                                            }
                                                                        }
                                                                    }))
                                                                }
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t bg-white">
                            <button
                                onClick={() => {
                                    // console.log("📋 Final Evaluated Data:", evaluation);
                                    handleSubmitEvaluation();
                                }}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-md text-sm font-medium w-full transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                Submit Evaluation
                            </button>
                        </div>
                    </div>
                </Rnd>
            )}



            {/* Floating Notes Panel */}
            {showNotesPanel && (
                <Rnd
                    default={{
                        x: window.innerWidth - 420,
                        y: 100,
                        width: 300,
                        height: 400,
                    }}
                    minWidth={350}
                    minHeight={400}
                    bounds="parent"
                    enableResizing={{
                        top: true,
                        right: true,
                        bottom: true,
                        left: true,
                        topRight: true,
                        bottomRight: true,
                        bottomLeft: true,
                        topLeft: true
                    }}
                    className="border-3 bg-white rounded-lg shadow-lg overflow-hidden"
                    style={{ zIndex: activePanel === 'notes' ? 100 : 10 }}
                    onClick={() => setActivePanel('notes')}
                    onDragStart={() => setActivePanel('notes')}
                    onDragStop={() => setActivePanel('notes')}
                >
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-3 bg-gray-100 cursor-move">
                            <div className="flex items-center space-x-2">
                                <FiFileText className="text-gray-600" />
                                <h2 className="font-semibold text-gray-800">Interview Notes</h2>
                            </div>
                            <button
                                onClick={() => setShowNotesPanel(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto flex-1">
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Notes</label>
                                <textarea
                                    className="w-full border rounded px-3 py-2 text-sm h-64"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Write your notes about the candidate here..."
                                />
                            </div>
                        </div>
                        <div className="p-3 border-t">
                            <button
                                onClick={handleSaveNotes}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm w-full"
                            >
                                Save Notes
                            </button>
                        </div>
                    </div>
                </Rnd>
            )}

            {/* Floating Security Alerts Panel */}
            {showSecurityAlerts && (
                <Rnd
                    default={{
                        x: 260,
                        y: 100,
                        width: 300,
                        height: 400,
                    }}
                    minWidth={350}
                    minHeight={400}
                    bounds="parent"
                    enableResizing={{
                        top: true,
                        right: true,
                        bottom: true,
                        left: true,
                        topRight: true,
                        bottomRight: true,
                        bottomLeft: true,
                        topLeft: true
                    }}
                    className="border-3 bg-white rounded-lg shadow-lg overflow-hidden"
                    style={{ zIndex: activePanel === 'security' ? 100 : 10 }}
                    onClick={() => setActivePanel('security')}
                    onDragStart={() => setActivePanel('security')}
                    onDragStop={() => setActivePanel('security')}
                >
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-3 bg-gray-100 cursor-move">
                            <div className="flex items-center space-x-2">
                                <FiAlertTriangle className="text-gray-600" />
                                <h2 className="font-semibold text-gray-800">Security Alerts</h2>
                            </div>
                            <button
                                onClick={() => setShowSecurityAlerts(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-3 overflow-y-auto flex-1">
                            {cheatLogs.length > 0 ? (
                                <ul className="space-y-2">
                                    {cheatLogs.map((log, i) => (
                                        <li key={i} className={`p-3 rounded text-sm ${log.severity === 'high' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' : 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500'}`}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium">{log.type}</p>
                                                    <p className="text-xs mt-1">{log.time.toLocaleTimeString()}</p>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${log.severity === 'high' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                                                    {log.severity === 'high' ? 'High' : 'Medium'}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-sm text-gray-500 text-center py-2">No suspicious activity detected</p>
                                </div>
                            )}
                        </div>
                        <div className="p-3 border-t">
                            <button
                                onClick={handleClearAlerts}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm w-full"
                            >
                                Clear All Alerts
                            </button>
                        </div>
                    </div>
                </Rnd>
            )}

            {/* Main Content */}
            <div className="flex flex-1 gap-4 overflow-hidden">
                {/* Left Column */}
                <div className=" flex-1 flex flex-col gap-3 min-w-0">
                    {/* Code Editor Panel */}
                    <div className="bg-night rounded-lg shadow overflow-hidden">
                        {/* <div
                            className="flex items-center justify-between p-1 bg-gray-100 cursor-pointer"
                            onClick={() => togglePanel('codeEditor')}
                        >
                            <div className="flex items-center space-x-2">
                                <FiCode className="text-gray-600" />
                                <h2 className="font-semibold text-gray-800">Code Editor</h2>
                            </div>
                            {panels.codeEditor ? <FiChevronUp /> : <FiChevronDown />}
                        </div> */}
                        {panels.codeEditor && (
                            <div className="p-2">
                                <div className="p-2 mb-3 flex justify-between">
                                    <select
                                        className="border border-gray-700 bg-[#1e2130] text-white rounded px-3 py-1 text-sm"
                                        onChange={handleLanguageChange}
                                        value={language}
                                    >
                                        <option value="javascript">JavaScript</option>
                                        <option value="python">Python</option>
                                        <option value="java">Java</option>
                                        <option value="cpp">C++</option>
                                        <option value="c">C</option>
                                        <option value="ruby">Ruby</option>
                                        <option value="go">Go</option>
                                        <option value="php">PHP</option>
                                        <option value="swift">Swift</option>
                                        <option value="kotlin">Kotlin</option>
                                    </select>
                                    <button
                                        onClick={handleRunCode}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center"
                                    >
                                        <FiPlay className="mr-1" /> Run Code
                                    </button>
                                </div>
                                <div className="border rounded-lg overflow-hidden">
                                    <Editor
                                        height="55vh"
                                        width={editorWidth}
                                        language={language}
                                        theme="vs-dark"
                                        value={content}
                                        onChange={handleEditorChange}
                                        onMount={editorDidMount}
                                        options={{
                                            fontSize: 20, // ← adjust this to your preferred size
                                        }}
                                    />
                                </div>
                                <br />
                                <div className="mt-">
                                    <button className="mt-3 px-4 py-2 text-sm font-medium rounded-md bg-gray-200 dark:bg-[#2a2d3e] text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-[#3b3f54] ">
                                        Output
                                    </button>

                                    <pre
                                        className="bg-gray-100 dark:bg-[#1e2130] text-black dark:text-gray-100 border dark:border-gray-700 p-3 rounded-lg text-sm font-mono whitespace-pre-wrap h-32 overflow-y-auto"
                                        style={{
                                            scrollbarWidth: 'thin', // Firefox
                                            scrollbarColor: '#9ca3af transparent', // Firefox
                                        }}
                                    >
                                        {output || 'No output yet. Run code to see results.'}
                                    </pre>

                                </div>

                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="w-180 flex flex-col gap-4">
                    <div
                        className={`bg-night rounded-lg shadow overflow-hidden ${isFullscreen ? 'fixed top-0 left-0 w-screen h-screen z-50 rounded-none' : ''
                            }`}
                    >
                        <div
                            className="flex items-center  justify-between p-6 bg-gray-900 cursor-pointer"
                            onClick={() => togglePanel('videoCall')}
                        >
                            <div className="flex items-center space-x-2 ">
                                <FiVideo className="text-white" />
                                <h2 className="font-semibold text-white"> &nbsp;
                                    Video Call</h2>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // prevent panel collapse
                                        toggleFullscreen();
                                    }}
                                    className="text-white hover:text-yellow-400 text-xl px-6"
                                >
                                    {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
                                </button>
                                {panels.videoCall ? <FiChevronUp /> : <FiChevronDown />}
                            </div>
                        </div>

                        <div
                            className={`p-4 transition-all duration-300 ${panels.videoCall ? 'block' : 'hidden'
                                } ${isFullscreen ? 'h-full' : ''}`}
                        >
                          {  <div className={`${isFullscreen ? 'h-full' : ''}`}>
                                {<VideoCallWindow roomId={roomId} isFullscreen={isFullscreen} />}

                            </div>}
                        </div>
                    </div>

                    {/* Messaging Panel */}
                    <div className="bg-white dark:bg-[#1e2130] rounded-lg shadow overflow-hidden flex-1 flex flex-col">
                        <div
                            className="flex items-center justify-between p-3 bg-gray-100 dark:bg-[#2a2d3e] cursor-pointer"
                            onClick={() => togglePanel('messaging')}
                        >
                            <div className="flex items-center space-x-2">
                                <FiMessageSquare className="text-gray-600 dark:text-gray-300" />
                                <h2 className="font-semibold text-gray-800 dark:text-gray-100">&nbsp;Messages</h2>
                            </div>
                            {panels.messaging ? (
                                <FiChevronUp className="text-gray-600 dark:text-gray-300" />
                            ) : (
                                <FiChevronDown className="text-gray-600 dark:text-gray-300" />
                            )}
                        </div>

                        {panels.messaging && (
                            <>
                                <div className="flex-1 p-3 overflow-y-auto max-h-64 bg-white dark:bg-[#1e2130]">
                                    {messages.map((msg, i) => (
                                        <div key={i} className={`mb-3 ${msg.sender === 'Interviewer' ? 'text-right' : ''}`}>
                                            <div
                                                className={`inline-block px-3 py-2 rounded-lg ${msg.sender != 'Interviewer'
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-gray-100'
                                                    }`}
                                            >
                                                <p >{msg.text}</p>
                                                <p
                                                    className={`text-xs ${msg.sender != 'Interviewer' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                                                        }`}
                                                >
                                                    {msg.time} • {msg.sender}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e2130]">
                                    <div className="flex">
                                        <input
                                            type="text"
                                            className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2a2d3e] text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-l-lg px-3 py-2 text-sm"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg text-sm"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default RoomPage;
