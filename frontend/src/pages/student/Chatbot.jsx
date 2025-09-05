// src/pages/student/Chatbot.jsx
import { useState } from "react";
import { Send } from "lucide-react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 I'm your AI assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    // Fake bot reply for now
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { 
  sender: "bot", 
  text: "🤖 Thanks to Rohan and Manvi for creating me! I'm waiting for my Backend and ML Team to teach me, then I'll be ready to answer your queries. 🚀" 
},
,
      ]);
    }, 1000);

    setInput("");
  };

  return (
    <div className="flex flex-col h-[80vh] bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">AI Chatbot</h2>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-xl">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl shadow-md max-w-xs text-sm transition transform hover:scale-[1.02] ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex items-center space-x-3">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 hover:scale-105 transition flex items-center space-x-2"
        >
          <Send size={18} />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}


