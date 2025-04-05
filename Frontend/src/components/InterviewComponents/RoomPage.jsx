import React, { useMemo, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import VideoCallWindow from './VideoCallWindow';
import { FiMaximize2, FiMinimize2, FiChevronDown, FiChevronUp, FiCode, FiMessageSquare, FiVideo, FiAlertTriangle, FiEdit2, FiCheckCircle, FiPlay, FiFileText } from 'react-icons/fi';
import SessionSecurityWrapper from './SessionSecurityWrapper';
import { Rnd } from 'react-rnd';
import '../../stylings/RoomPage.css';

function RoomPage() {
    const { roomId } = useParams();
    const [id, setId] = useState("no");
    const [content, setContent] = useState("// Write your code here\nfunction hello() {\n  return \"Hello World!\";\n}");
    const [output, setOutput] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [messages, setMessages] = useState([
        { sender: 'Candidate', text: 'Hello, should I start with the first problem?', time: '10:00 AM' },
        { sender: 'You', text: 'Yes, please begin when ready', time: '10:01 AM' }
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [cheatLogs, setCheatLogs] = useState([
        { type: 'Tab switch detected', time: new Date(), severity: 'medium' },
        { type: 'Multiple faces detected', time: new Date(), severity: 'high' }
    ]);
    const [notes, setNotes] = useState("Candidate seems nervous but has good fundamentals.");
    const [evaluation, setEvaluation] = useState({
        problemSolving: 3,
        codingSkills: 4,
        communication: 3,
        overall: 7,
        feedback: 'Good potential but needs more practice with algorithms.'
    });
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
    const socket = useMemo(() => io(import.meta.env.VITE_BACKEND_URL), []);

    useEffect(() => {
        socket.emit('join-room', roomId);

        socket.on("connect", () => {
            console.log("connected", socket.id);
            setId(socket.id);
        });

        socket.on("editorContentUpdate", (newContent) => setContent(newContent));
        socket.on("languageChange", (newLanguage) => setLanguage(newLanguage));
        socket.on("newMessage", (message) => {
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

    const handleRunCode = () => {
        const mockOutput = `Running ${language} code...\n\n> ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}\n\n"Hello World!"\n\nCode executed successfully at ${new Date().toLocaleTimeString()}`;
        setOutput(mockOutput);
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message = {
                sender: "You",
                text: newMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            socket.emit("sendMessage", { roomId, message });
            setMessages(prev => [...prev, message]);
            setNewMessage("");
        }
    };

    const handleSubmitEvaluation = () => {
        alert("Evaluation submitted!");
        console.log("Evaluation:", evaluation);
    };

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

    const togglePanel = (panel) => {
        setPanels(prev => ({ ...prev, [panel]: !prev[panel] }));
    };

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
                        width: 400,
                        height: 500,
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
                    style={{ zIndex: activePanel === 'evaluation' ? 100 : 10 }}
                    onClick={() => setActivePanel('evaluation')}
                    onDragStart={() => setActivePanel('evaluation')}
                    onDragStop={() => setActivePanel('evaluation')}
                >
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-3 bg-gray-100 cursor-move">
                            <div className="flex items-center space-x-2">
                                <FiCheckCircle className="text-gray-600" />
                                <h2 className="font-semibold text-gray-800">Evaluation Form</h2>
                            </div>
                            <button
                                onClick={() => setShowEvaluationForm(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto flex-1">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Problem Solving (0-5)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="5"
                                        className="w-full border rounded px-3 py-2 text-sm"
                                        value={evaluation.problemSolving}
                                        onChange={(e) => setEvaluation({ ...evaluation, problemSolving: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Coding Skills (0-5)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="5"
                                        className="w-full border rounded px-3 py-2 text-sm"
                                        value={evaluation.codingSkills}
                                        onChange={(e) => setEvaluation({ ...evaluation, codingSkills: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Communication (0-5)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="5"
                                        className="w-full border rounded px-3 py-2 text-sm"
                                        value={evaluation.communication}
                                        onChange={(e) => setEvaluation({ ...evaluation, communication: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Overall (0-10)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        className="w-full border rounded px-3 py-2 text-sm"
                                        value={evaluation.overall}
                                        onChange={(e) => setEvaluation({ ...evaluation, overall: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Feedback</label>
                                <textarea
                                    className="w-full border rounded px-3 py-2 text-sm h-24"
                                    value={evaluation.feedback}
                                    onChange={(e) => setEvaluation({ ...evaluation, feedback: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="p-3 border-t">
                            <button
                                onClick={handleSubmitEvaluation}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm w-full"
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
                                onClick={() => console.log("Notes saved:", notes)}
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
                                onClick={() => setCheatLogs([])}
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
                    {/* Video Call Panel */}
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
          <div key={i} className={`mb-3 ${msg.sender === 'You' ? 'text-right' : ''}`}>
            <div
              className={`inline-block px-3 py-2 rounded-lg ${
                msg.sender === 'You'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-gray-100'
              }`}
            >
              <p>{msg.text}</p>
              <p
                className={`text-xs ${
                  msg.sender === 'You' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
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

// import React, { useMemo, useState, useEffect, useRef } from 'react';
// import { io } from 'socket.io-client';
// import { useParams } from 'react-router-dom';
// import Editor from '@monaco-editor/react';
// import VideoCallWindow from './VideoCallWindow';
// import { FiChevronDown, FiChevronUp, FiCode, FiMessageSquare, FiVideo, FiAlertTriangle, FiEdit2, FiCheckCircle, FiPlay } from 'react-icons/fi';
// import SessionSecurityWrapper from './SessionSecurityWrapper';
// import { Rnd } from 'react-rnd';
// import '../stylings/RoomPage.css';

// function RoomPage() {
//     const { roomId } = useParams();
//     const [id, setId] = useState("no");
//     const [content, setContent] = useState("// Write your code here\nfunction hello() {\n  return \"Hello World!\";\n}");
//     const [output, setOutput] = useState("");
//     const [language, setLanguage] = useState("javascript");
//     const [messages, setMessages] = useState([
//         { sender: 'Candidate', text: 'Hello, should I start with the first problem?', time: '10:00 AM' },
//         { sender: 'You', text: 'Yes, please begin when ready', time: '10:01 AM' }
//     ]);
//     const [newMessage, setNewMessage] = useState("");
//     const [cheatLogs, setCheatLogs] = useState([
//         { type: 'Tab switch detected', time: new Date(), severity: 'medium' },
//         { type: 'Multiple faces detected', time: new Date(), severity: 'high' }
//     ]);
//     const [notes, setNotes] = useState("Candidate seems nervous but has good fundamentals.");
//     const [evaluation, setEvaluation] = useState({
//         problemSolving: 3,
//         codingSkills: 4,
//         communication: 3,
//         overall: 7,
//         feedback: 'Good potential but needs more practice with algorithms.'
//     });
//     const [panels, setPanels] = useState({
//         codeEditor: true,
//         videoCall: true,
//         messaging: true,
//         security: true,
//         evaluation: false
//     });
//     const [showEvaluationForm, setShowEvaluationForm] = useState(false);
//     const [showSecurityAlerts, setShowSecurityAlerts] = useState(false);

//     const editorWidth = "100%";
//     const socket = useMemo(() => io(import.meta.env.VITE_BACKEND_URL), []);

//     useEffect(() => {
//         socket.emit('join-room', roomId);

//         socket.on("connect", () => {
//             console.log("connected", socket.id);
//             setId(socket.id);
//         });

//         socket.on("editorContentUpdate", (newContent) => setContent(newContent));
//         socket.on("languageChange", (newLanguage) => setLanguage(newLanguage));
//         socket.on("newMessage", (message) => {
//             setMessages(prev => [...prev, message]);
//         });
//         socket.on("cheatDetected", (log) => {
//             setCheatLogs(prev => [...prev, log]);
//             setShowSecurityAlerts(true);
//         });

//         return () => {
//             socket.disconnect();
//         };
//     }, [socket, roomId]);

//     const handleEditorChange = (newContent) => {
//         setContent(newContent || "");
//         socket.emit("editorContentUpdate", { newContent, roomId });
//     };

//     const handleLanguageChange = (e) => {
//         const newLanguage = e.target.value;
//         setLanguage(newLanguage);
//         socket.emit("languageChange", newLanguage);
//     };

//     const handleRunCode = () => {
//         const mockOutput = `Running ${language} code...\n\n> ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}\n\n"Hello World!"\n\nCode executed successfully at ${new Date().toLocaleTimeString()}`;
//         setOutput(mockOutput);
//     };

//     const handleSendMessage = () => {
//         if (newMessage.trim()) {
//             const message = {
//                 sender: "You",
//                 text: newMessage,
//                 time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//             };
//             socket.emit("sendMessage", { roomId, message });
//             setMessages(prev => [...prev, message]);
//             setNewMessage("");
//         }
//     };

//     const handleSubmitEvaluation = () => {
//         alert("Evaluation submitted!");
//         console.log("Evaluation:", evaluation);
//     };

//     const editorDidMount = (editor, monaco) => {
//         monaco.languages.registerCompletionItemProvider('javascript', {
//             provideCompletionItems: () => ({
//                 suggestions: [
//                     { label: 'console.log', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'console.log(${1:object});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Log output to console' },
//                     { label: 'function', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'function ${1:functionName}(${2:params}) {\n\t${3:// body}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Function declaration' },
//                     { label: 'if', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'if (${1:condition}) {\n\t${2:// body}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'If statement' },
//                     { label: 'for loop', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:array}.length; ${1:i}++) {\n\t${3:// body}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'For loop' },
//                     { label: 'async function', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'async function ${1:functionName}(${2:params}) {\n\t${3:// body}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Async function declaration' },
//                 ],
//             }),
//         });
//     };

//     const togglePanel = (panel) => {
//         setPanels(prev => ({ ...prev, [panel]: !prev[panel] }));
//     };

//     return (
//         <div className="flex flex-col h-screen bg-gray-50 p-4">
//             {/* Header */}
//             <header className="bg-white rounded-lg shadow p-4 mb-4">
//                 <div className="flex justify-between items-center">
//                     <h1 className="text-2xl font-bold text-gray-800">Interview Room: {roomId}</h1>
//                     <div className="flex items-center space-x-2">
//                         <span className="h-3 w-3 rounded-full bg-green-500"></span>
//                         <span className="text-gray-600">Connected as ID: {id}</span>
//                         <button
//                             onClick={() => setShowSecurityAlerts(!showSecurityAlerts)}
//                             className={`px-4 py-2 rounded-lg text-sm flex items-center ${showSecurityAlerts ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'}`}
//                         >
//                             <FiAlertTriangle className="mr-1" /> Security Alerts
//                         </button>
//                         <button
//                             onClick={() => setShowEvaluationForm(!showEvaluationForm)}
//                             className={`px-4 py-2 rounded-lg text-sm flex items-center ${showEvaluationForm ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
//                         >
//                             <FiEdit2 className="mr-1" /> Evaluation Form
//                         </button>
//                         <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
//                             End Interview
//                         </button>
//                     </div>
//                 </div>
//             </header>

//             {/* Floating Evaluation Form */}
//             {showEvaluationForm && (
//                 <Rnd
//                     default={{
//                         x: window.innerWidth - 420,
//                         y: 100,
//                         width: 400,
//                         height: 500,
//                     }}
//                     minWidth={350}
//                     minHeight={400}
//                     bounds="parent"
//                     enableResizing={{
//                         top: true,
//                         right: true,
//                         bottom: true,
//                         left: true,
//                         topRight: true,
//                         bottomRight: true,
//                         bottomLeft: true,
//                         topLeft: true
//                     }}
//                     className="z-50 bg-white rounded-lg shadow-lg overflow-hidden"
//                 >
//                     <div className="flex flex-col h-full">
//                         <div className="flex items-center justify-between p-3 bg-gray-100 cursor-move">
//                             <div className="flex items-center space-x-2">
//                                 <FiCheckCircle className="text-gray-600" />
//                                 <h2 className="font-semibold text-gray-800">Evaluation Form</h2>
//                             </div>
//                             <button
//                                 onClick={() => setShowEvaluationForm(false)}
//                                 className="text-gray-500 hover:text-gray-700"
//                             >
//                                 ×
//                             </button>
//                         </div>
//                         <div className="p-4 overflow-y-auto flex-1">
//                             <div className="grid grid-cols-2 gap-4 mb-4">
//                                 <div>
//                                     <label className="block text-sm font-medium mb-1">Problem Solving (0-5)</label>
//                                     <input
//                                         type="number"
//                                         min="0"
//                                         max="5"
//                                         className="w-full border rounded px-3 py-2 text-sm"
//                                         value={evaluation.problemSolving}
//                                         onChange={(e) => setEvaluation({ ...evaluation, problemSolving: e.target.value })}
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium mb-1">Coding Skills (0-5)</label>
//                                     <input
//                                         type="number"
//                                         min="0"
//                                         max="5"
//                                         className="w-full border rounded px-3 py-2 text-sm"
//                                         value={evaluation.codingSkills}
//                                         onChange={(e) => setEvaluation({ ...evaluation, codingSkills: e.target.value })}
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium mb-1">Communication (0-5)</label>
//                                     <input
//                                         type="number"
//                                         min="0"
//                                         max="5"
//                                         className="w-full border rounded px-3 py-2 text-sm"
//                                         value={evaluation.communication}
//                                         onChange={(e) => setEvaluation({ ...evaluation, communication: e.target.value })}
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium mb-1">Overall (0-10)</label>
//                                     <input
//                                         type="number"
//                                         min="0"
//                                         max="10"
//                                         className="w-full border rounded px-3 py-2 text-sm"
//                                         value={evaluation.overall}
//                                         onChange={(e) => setEvaluation({ ...evaluation, overall: e.target.value })}
//                                     />
//                                 </div>
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium mb-1">Feedback</label>
//                                 <textarea
//                                     className="w-full border rounded px-3 py-2 text-sm h-24"
//                                     value={evaluation.feedback}
//                                     onChange={(e) => setEvaluation({ ...evaluation, feedback: e.target.value })}
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium mb-1">Notes</label>
//                                 <textarea
//                                     className="w-full border rounded px-3 py-2 text-sm h-24"
//                                     value={notes}
//                                     onChange={(e) => setNotes(e.target.value)}
//                                 />
//                             </div>
//                         </div>
//                         <div className="p-3 border-t">
//                             <button
//                                 onClick={handleSubmitEvaluation}
//                                 className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm w-full"
//                             >
//                                 Submit Evaluation
//                             </button>
//                         </div>
//                     </div>
//                 </Rnd>
//             )}

//             {/* Main Content */}
//             <div className="flex flex-1 gap-4 overflow-hidden">
//                 {/* Left Column */}
//                 <div className="flex-1 flex flex-col gap-4 min-w-0">
//                     {/* Code Editor Panel */}
//                     <div className="bg-white rounded-lg shadow overflow-hidden">
//                         <div
//                             className="flex items-center justify-between p-3 bg-gray-100 cursor-pointer"
//                             onClick={() => togglePanel('codeEditor')}
//                         >
//                             <div className="flex items-center space-x-2">
//                                 <FiCode className="text-gray-600" />
//                                 <h2 className="font-semibold text-gray-800">Code Editor</h2>
//                             </div>
//                             {panels.codeEditor ? <FiChevronUp /> : <FiChevronDown />}
//                         </div>
//                         {panels.codeEditor && (
//                             <div className="p-4">
//                                 <div className="mb-3 flex justify-between">
//                                     <select
//                                         className="border rounded px-3 py-1 text-sm"
//                                         onChange={handleLanguageChange}
//                                         value={language}
//                                     >
//                                         <option value="javascript">JavaScript</option>
//                                         <option value="typescript">TypeScript</option>
//                                         <option value="python">Python</option>
//                                         <option value="java">Java</option>
//                                         <option value="cpp">C++</option>
//                                         <option value="html">HTML</option>
//                                         <option value="css">CSS</option>
//                                     </select>
//                                     <button
//                                         onClick={handleRunCode}
//                                         className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center"
//                                     >
//                                         <FiPlay className="mr-1" /> Run Code
//                                     </button>
//                                 </div>
//                                 <div className="border rounded-lg overflow-hidden">
//                                     <Editor
//                                         height="50vh"  // Adjusted height to make room for larger output
//                                         width={editorWidth}
//                                         language={language}
//                                         theme="vs-dark"
//                                         value={content}
//                                         onChange={handleEditorChange}
//                                         onMount={editorDidMount}
//                                     />
//                                 </div>
//                                 <div className="mt-3">
//                                     <h3 className="text-sm font-medium mb-1">Output</h3>
//                                     <pre className="bg-gray-100 p-3 rounded-lg text-sm font-mono whitespace-pre-wrap h-32 overflow-y-auto">
//                                         {output || 'No output yet. Run code to see results.'}
//                                     </pre>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Right Column */}
//                 <div className="w-156 flex flex-col gap-4">
//                     {/* Video Call Panel */}
//                     <div className="bg-white rounded-lg shadow overflow-hidden">
//                         <div
//                             className="flex items-center justify-between p-3 bg-gray-100 cursor-pointer"
//                             onClick={() => togglePanel('videoCall')}
//                         >
//                             <div className="flex items-center space-x-2">
//                                 <FiVideo className="text-gray-600" />
//                                 <h2 className="font-semibold text-gray-800">Video Call</h2>
//                             </div>
//                             {panels.videoCall ? <FiChevronUp /> : <FiChevronDown />}
//                         </div>

//                         <div className={`p-4 transition-all duration-300 ${panels.videoCall ? 'block' : 'hidden'}`}>
//                             <VideoCallWindow roomId={roomId} />
//                         </div>
//                     </div>

//                     {/* Messaging Panel */}
//                     <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
//                         <div
//                             className="flex items-center justify-between p-3 bg-gray-100 cursor-pointer"
//                             onClick={() => togglePanel('messaging')}
//                         >
//                             <div className="flex items-center space-x-2">
//                                 <FiMessageSquare className="text-gray-600" />
//                                 <h2 className="font-semibold text-gray-800">Messages</h2>
//                             </div>
//                             {panels.messaging ? <FiChevronUp /> : <FiChevronDown />}
//                         </div>
//                         {panels.messaging && (
//                             <>
//                                 <div className="flex-1 p-3 overflow-y-auto max-h-64">
//                                     {messages.map((msg, i) => (
//                                         <div key={i} className={`mb-3 ${msg.sender === 'You' ? 'text-right' : ''}`}>
//                                             <div className={`inline-block px-3 py-2 rounded-lg ${msg.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
//                                                 <p>{msg.text}</p>
//                                                 <p className={`text-xs ${msg.sender === 'You' ? 'text-blue-100' : 'text-gray-500'}`}>
//                                                     {msg.time} • {msg.sender}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                                 <div className="p-3 border-t">
//                                     <div className="flex">
//                                         <input
//                                             type="text"
//                                             className="flex-1 border rounded-l-lg px-3 py-2 text-sm"
//                                             value={newMessage}
//                                             onChange={(e) => setNewMessage(e.target.value)}
//                                             placeholder="Type a message..."
//                                             onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//                                         />
//                                         <button
//                                             onClick={handleSendMessage}
//                                             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg text-sm"
//                                         >
//                                             Send
//                                         </button>
//                                     </div>
//                                 </div>
//                             </>
//                         )}
//                     </div>

//                     {/* Security Alerts Panel - Only shown when showSecurityAlerts is true */}
//                     {showSecurityAlerts && (
//                         <div className="bg-white rounded-lg shadow overflow-hidden">
//                             <div
//                                 className="flex items-center justify-between p-3 bg-gray-100 cursor-pointer"
//                                 onClick={() => setShowSecurityAlerts(false)}
//                             >
//                                 <div className="flex items-center space-x-2">
//                                     <FiAlertTriangle className="text-gray-600" />
//                                     <h2 className="font-semibold text-gray-800">Security Alerts</h2>
//                                 </div>
//                                 <span>×</span>
//                             </div>
//                             <div className="p-3 max-h-64 overflow-y-auto">
//                                 {cheatLogs.length > 0 ? (
//                                     <ul className="space-y-2">
//                                         {cheatLogs.map((log, i) => (
//                                             <li key={i} className={`p-2 rounded text-sm ${log.severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
//                                                 <div className="flex justify-between">
//                                                     <span>{log.type}</span>
//                                                     <span className="text-xs">{new Date(log.time).toLocaleTimeString()}</span>
//                                                 </div>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 ) : (
//                                     <p className="text-sm text-gray-500 text-center py-2">No suspicious activity detected</p>
//                                 )}
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default RoomPage;