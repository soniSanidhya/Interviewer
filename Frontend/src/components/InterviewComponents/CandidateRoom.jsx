import React from 'react'
import { useMemo, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useNavigate, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import VideoCallWindow from './VideoCallWindow';
import { FiMaximize2, FiMinimize2, FiChevronDown, FiChevronUp, FiCode, FiMessageSquare, FiVideo, FiAlertTriangle, FiEdit2, FiCheckCircle, FiPlay, FiFileText } from 'react-icons/fi';
import SessionSecurityWrapper from './SessionSecurityWrapper';
import { Rnd } from 'react-rnd';
import '../../stylings/RoomPage.css';
import Rating from 'react-rating';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { BASE_URL } from '@/utils/constants';

function CandidateRoom() {
    const navigate = useNavigate()
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

    const socket = useMemo(() => io("https://socketnodejs-a2g8c8f7g7avaudc.southindia-01.azurewebsites.net"), []);
    // const socket = useMemo(() => io("http://localhost:5500"), []);

    useEffect(() => {
        socket.emit('join-room', roomId);

        socket.on("connect", () => {
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

        socket.on("outputRecieved",(output)=>{
            console.log("outputRecieved ",output);
            setOutput(output)
        })

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
            setMessages(prev => [...prev, message]);
            setNewMessage("");
        }
    };

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
            socket.emit("sendOutput", { roomId, output: data.output });
            // console.log("op: ",data);
    
        };

    const handleSubmitEvaluation = () => {
        alert("Evaluation submitted!");
    };

    const editorDidMount = (editor, monaco) => {
        monaco.languages.registerCompletionItemProvider('javascript', {
            provideCompletionItems: () => ({
                suggestions: [
                    { label: '// console.log', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '// console.log(${1:object});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Log output to console' },
                    { label: 'function', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'function ${1:functionName}(${2:params}) {\n\t${3:// body}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Function declaration' },
                    { label: 'if', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'if (${1:condition}) {\n\t${2:// body}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'If statement' },
                    { label: 'for loop', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:array}.length; ${1:i}++) {\n\t${3:// body}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'For loop' },
                    { label: 'async function', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'async function ${1:functionName}(${2:params}) {\n\t${3:// body}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Async function declaration' },
                ],
            }),
        });
    };

    const togglePanel = (panel) => {
        setPanels(prev => ({ ...prev, [panel]: !prev[panel] }));
    };

    return (
        <SessionSecurityWrapper socket={socket} roomId={roomId}>
            <div className="bg-night flex flex-col h-screen bg-gray-900 p-2">
                {/* Header */}
                <header className="bg-gray-800 rounded-lg shadow px-6 py-4 mb-4 border border-gray-700">
                    <div className="flex flex-wrap justify-between items-center gap-y-2">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold text-white">Interview Session</h1>
                            <div className="bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-300">
                                Room ID: {roomId}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-full">
                                <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-white text-sm">Connected</span>
                            </div>
                            <button onClick={()=>{navigate('/')}} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-all shadow-md hover:shadow-red-500/20">
                                End Interview
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex flex-1 gap-4 overflow-hidden">
                    {/* Left Column - Code Editor */}
                    <div className="flex-1 flex flex-col gap-4 min-w-0">
                        <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700 flex flex-col h-full">
                            <div className="flex items-center justify-between p-3 bg-gray-700 border-b border-gray-600">
                                <div className="flex items-center space-x-3">
                                    <FiCode className="text-blue-400 text-lg" />
                                    <h2 className="font-semibold text-white">Code Editor</h2>
                                    <select
                                        className="border border-gray-600 bg-gray-800 text-white rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                </div>
                                <button
                                    onClick={handleRunCode}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors"
                                >
                                    <FiPlay className="mr-1" /> Run Code
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-hidden">
                                <Editor
                                    height="100%"
                                    width={editorWidth}
                                    language={language}
                                    theme="vs-dark"
                                    value={content}
                                    onChange={handleEditorChange}
                                    onMount={editorDidMount}
                                    options={{
                                        fontSize: 14,
                                        minimap: { enabled: false },
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                    }}
                                />
                            </div>
                            
                            <div className="border-t border-gray-700">
                                <div className="p-3 bg-gray-700 flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-gray-300">Output</h3>
                                    <div className="text-xs text-gray-400">
                                        {new Date().toLocaleTimeString()}
                                    </div>
                                </div>
                                <pre
                                    className="bg-gray-900 text-gray-100 p-3 text-sm font-mono whitespace-pre-wrap overflow-y-auto max-h-32"
                                    style={{
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: '#4B5563 transparent',
                                    }}
                                >
                                    {output || <span className="text-gray-500">No output yet. Run code to see results.</span>}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Video & Chat */}
                   <div className="w-180 flex flex-col gap-4">
                       
                        <div
                            className={`border border-gray-400 bg-night rounded-lg shadow overflow-hidden ${isFullscreen ? 'fixed top-0 left-0 w-screen h-screen z-50 rounded-none' : ''
                                }`}
                        >
                            <div
                                className="flex items-center  justify-between p-6 bg-gray-900 cursor-pointer"
                                onClick={() => togglePanel('videoCall')}
                            >
                                <div className="flex items-center space-x-2 ">
                                    <FiVideo className="text-white" />
                                    <h2 className="font-semibold text-white"> &nbsp;
                                        Video Call  (click to hide/show panel)</h2>
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
        </SessionSecurityWrapper>
    );
}

export default CandidateRoom;