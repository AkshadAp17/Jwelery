import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! How can I help you today?",
      sender: "agent",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText("");

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message! Our jewelry experts will assist you shortly. In the meantime, feel free to browse our collections or call us directly at +91 98765 43210.",
        sender: "agent",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Chat Button */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="gold-gradient w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
        >
          {isOpen ? <X className="text-white text-xl" /> : <MessageCircle className="text-white text-xl" />}
          {!isOpen && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">1</span>
            </div>
          )}
        </Button>

        {/* Chat Widget */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 transform transition-all duration-300">
            {/* Chat Header */}
            <div className="gold-gradient p-4 rounded-t-2xl text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="font-semibold">Live Chat</h5>
                  <p className="text-xs opacity-90">We're here to help!</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200 p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-64 p-4 overflow-y-auto">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "items-start space-x-2"}`}>
                    {message.sender === "agent" && (
                      <div className="w-8 h-8 bg-gold bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-user-headset text-gold text-xs"></i>
                      </div>
                    )}
                    <div className={`rounded-lg p-3 max-w-xs ${
                      message.sender === "user" 
                        ? "bg-gold text-white ml-8" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 text-sm focus:border-gold"
                />
                <Button
                  onClick={sendMessage}
                  className="gold-gradient text-white w-10 h-10 p-0 hover:shadow-lg transition-all duration-300"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
