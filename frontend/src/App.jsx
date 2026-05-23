import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Bot, User, Sparkles, FileText, HelpCircle } from "lucide-react";

function App() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your Nexus Dynamics HR Assistant. I have read the company handbook. Ask me anything about remote work, laptop upgrades, or bonuses!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // This ref automatically scrolls the chat down when new messages appear
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Send a message to the RAG API
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/chat", {
        question: userMessage.text,
      });

      const aiMessage = {
        sender: "ai",
        text: response.data.answer,
        source: response.data.source_used,
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error talking to RAG server:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error: I couldn't reach the RAG server. Make sure your Python backend is running." },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <header className="bg-neutral-900 border-b border-neutral-800 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-wider flex items-center space-x-2">
              <span>NEXUS: Oracle</span>
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </h1>
            <p className="text-xs text-neutral-500 font-mono">Enterprise Retrieval-Augmented Generation (RAG)</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-neutral-950 px-3 py-1.5 rounded-full border border-neutral-800">
          <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-mono text-indigo-400">DATABASE ENCRYPTED</span>
        </div>
      </header>

      {/* Chat Messages Area */}
      <main className="flex-1 overflow-y-auto p-6 max-w-4xl w-full mx-auto space-y-6">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex space-x-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {/* AI Avatar */}
            {msg.sender === "ai" && (
              <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}

            {/* Message Bubble */}
            <div className="max-w-[80%] flex flex-col space-y-2">
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed border ${
                  msg.sender === "user"
                    ? "bg-indigo-600 border-indigo-500 text-white rounded-tr-none"
                    : "bg-neutral-900 border-neutral-800 text-neutral-300 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>

              {/* Collapsible Source Card (Shows only for AI answers that used a document) */}
              {msg.sender === "ai" && msg.source && (
                <details className="group border border-neutral-800 rounded-xl bg-neutral-900/50 p-3 text-xs transition-colors hover:border-neutral-700">
                  <summary className="flex items-center justify-between cursor-pointer font-bold text-neutral-500 hover:text-neutral-400 select-none outline-none">
                    <span className="flex items-center space-x-2">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Verified Source Document</span>
                    </span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <div className="mt-2 pt-2 border-t border-neutral-800 text-neutral-400 leading-relaxed whitespace-pre-line font-mono">
                    {msg.source}
                  </div>
                </details>
              )}
            </div>

            {/* User Avatar */}
            {msg.sender === "user" && (
              <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex space-x-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 shrink-0">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-neutral-900 border border-neutral-800 text-neutral-500 p-4 rounded-2xl rounded-tl-none text-sm italic">
              Oracle is searching handbooks and generating response...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Form at Bottom */}
      <footer className="bg-neutral-900/50 border-t border-neutral-800 p-4">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex space-x-4">
          <input
            type="text"
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-600 transition-colors"
            placeholder="Ask about company handbook policies..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-800 text-white font-bold p-3 rounded-xl transition-all flex items-center justify-center"
            disabled={isLoading || !input.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </footer>

    </div>
  );
}

export default App;