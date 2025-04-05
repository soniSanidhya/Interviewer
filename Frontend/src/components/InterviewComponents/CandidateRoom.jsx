import React from 'react'
import { useMemo, useState, useEffect, useRef } from 'react';
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

function CandidateRoom() {
    const { roomId } = useParams();
    const [id, setId] = useState("no");
    const [content, setContent] = useState("// Write your code here\nfunction hello() {\n  return \"Hello World!\";\n}");
    const [output, setOutput] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [messages, setMessages] = useState([
        { sender: 'Auto Generated', text: 'Start Messaging', time: '' },
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [cheatLogs, setCheatLogs] = useState([
        { type: 'Tab switch detected', time: new Date(), severity: 'medium' },
        { type: 'Multiple faces detected', time: new Date(), severity: 'high' }
    ]);
    const [notes, setNotes] = useState("Candidate seems nervous but has good fundamentals.");
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
        console.log("result ", result);

        return result;
    }


    //new work end

    //socket work start
    const socket = useMemo(() => io(import.meta.env.VITE_BACKEND_URL), []);

    useEffect(() => {
        socket.emit('join-room', roomId);

        socket.on("connect", () => {
            console.log("connected", socket.id);
            setId(socket.id);
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
                sender: "Candidate",
                text: newMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            socket.emit("sendMessage", { roomId, message });
            console.log("emitted ", message);

            setMessages(prev => [...prev, message]);
            setNewMessage("");
        }
    };
    //socket work end


    //code execution start
    const handleRunCode = () => {
        const mockOutput = `Running ${language} code...\n\n> ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}\n\n"Hello World!"\n\nCode executed successfully at ${new Date().toLocaleTimeString()}`;
        setOutput(mockOutput);
    };
    //code execution end

    //evaluation start
    const handleSubmitEvaluation = () => {
        alert("Evaluation submitted!");
        console.log("Evaluation:", evaluation);
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

    return (
        <div className="bg-night flex flex-col h-screen bg-gray-900 p-2">
            {/* Header */}
            <header className="bg-gray-900 rounded-lg shadow px-4 py-3 mb-4">
                <div className="flex flex-wrap justify-between items-center gap-y-2">
                    <h1 className="text-2xl font-bold text-white">Interview Room: {roomId}</h1>

                    <div className="border-4 flex flex-wrap items-center gap-3 border-gray-200 rounded-lg px-3 py-2">
                        <span className="h-3 w-3 rounded-full bg-green-500"></span>
                        <span className="text-white text-sm">Connected as ID: {id}</span>

                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-all">
                            End Interview
                        </button>
                    </div>
                </div>
            </header>

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
                                        <option value="typescript">TypeScript</option>
                                        <option value="python">Python</option>
                                        <option value="java">Java</option>
                                        <option value="cpp">C++</option>
                                        <option value="html">HTML</option>
                                        <option value="css">CSS</option>
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
                    Video Call Panel
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
                            <div className={`${isFullscreen ? 'h-full' : ''}`}>
                                <VideoCallWindow roomId={roomId} isFullscreen={isFullscreen} />

                            </div>
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
                                        <div key={i} className={`mb-3 ${msg.sender === 'Candidate' ? 'text-right' : ''}`}>
                                            <div
                                                className={`inline-block px-3 py-2 rounded-lg ${msg.sender != 'Candidate'
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-gray-100'
                                                    }`}
                                            >
                                                <p>{msg.text}</p>
                                                <p
                                                    className={`text-xs ${msg.sender != 'Candidate' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
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

export default CandidateRoom;



