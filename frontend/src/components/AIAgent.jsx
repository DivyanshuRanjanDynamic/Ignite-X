import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, X, Send, MessageCircle, User, Bot,
  BookOpen, Briefcase, FileText, HelpCircle,
  Lightbulb, Target, TrendingUp, Clock
} from "lucide-react";

export default function AIAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hi! I'm your AI assistant for the PM Internship Scheme. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Quick action suggestions
  const quickActions = [
    { icon: BookOpen, text: "Help with Skills", action: "skills" },
    { icon: Briefcase, text: "Internship Guidance", action: "internships" },
    { icon: FileText, text: "Resume Tips", action: "resume" },
    { icon: HelpCircle, text: "General Help", action: "general" }
  ];

  // Mock AI responses based on action type
  const getAIResponse = (action, userMessage = "") => {
    const responses = {
      skills: [
        "Based on your profile, I recommend focusing on these high-demand skills: React.js, Python, and SQL. Would you like me to create a personalized learning path?",
        "Great question! For PM Internship Scheme, technical skills like programming and soft skills like communication are equally important. Let me suggest some resources.",
        "I can see you're interested in skill development. Here are the top 5 skills that will boost your internship applications: 1) Digital Literacy 2) Communication 3) Problem Solving 4) Technical Skills 5) Leadership"
      ],
      internships: [
        "I can help you find the perfect internship! Based on your location and interests, here are some recommendations. Would you like me to filter by your preferred sector?",
        "For first-generation learners, I recommend starting with government internships as they provide excellent mentorship and structured learning opportunities.",
        "Let me analyze your profile and suggest internships that match your skills and career goals. I'll also help you understand the application process."
      ],
      resume: [
        "Your resume looks good! I suggest adding more quantifiable achievements and industry-specific keywords. Would you like me to analyze it for ATS compatibility?",
        "For PM Internship applications, make sure to highlight your problem-solving skills and any community work experience. Let me help you optimize it.",
        "I can help you improve your resume's ATS score. The key areas to focus on are: keywords, formatting, and quantifiable achievements."
      ],
      general: [
        "I'm here to help you succeed in the PM Internship Scheme! I can assist with applications, skill development, resume optimization, and career guidance.",
        "As your AI assistant, I can provide personalized recommendations, answer questions about the application process, and help you prepare for interviews.",
        "Feel free to ask me anything about internships, skills, applications, or career development. I'm designed to help first-generation learners like you succeed!"
      ]
    };

    const actionResponses = responses[action] || responses.general;
    return actionResponses[Math.floor(Math.random() * actionResponses.length)];
  };

  const handleSendMessage = async (message = inputMessage, action = null) => {
    if (!message.trim() && !action) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: message || quickActions.find(a => a.action === action)?.text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: "bot",
        content: getAIResponse(action, message),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action) => {
    handleSendMessage("", action);
  };

  return (
    <>
      {/* AI Agent Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Brain className="w-8 h-8" />
        </motion.button>
      </div>

      {/* AI Agent Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 flex flex-col"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Assistant</h3>
                  <p className="text-blue-200 text-sm">PM Internship Support</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-blue-200 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-b border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Quick Actions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.action)}
                    className="flex items-center space-x-2 p-2 bg-gray-50 hover:bg-blue-50 rounded-lg text-sm transition-colors"
                  >
                    <action.icon className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">{action.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === "user" 
                        ? "bg-blue-600" 
                        : "bg-gray-200"
                    }`}>
                      {message.type === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div className={`rounded-2xl px-4 py-2 ${
                      message.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === "user" ? "text-blue-200" : "text-gray-500"
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about internships..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-full transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}