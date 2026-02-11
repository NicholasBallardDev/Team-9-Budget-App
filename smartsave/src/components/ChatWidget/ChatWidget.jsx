import { useState, useEffect, useRef } from 'react';
// import './ChatWidget.css';

function ChatWidget() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const sendChatMessage = () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setChatLoading(true);

    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        role: "assistant",
        content: "Thanks for your message! I can help you save money on groceries, fuel, and track your spending. What would you like to know?"
      }]);
      setChatLoading(false);
    }, 1000);
  };

  return (
    <>
      <button
        className={`chat-fab ${chatOpen ? 'open' : ''}`}
        onClick={() => setChatOpen(!chatOpen)}
      >
        {chatOpen ? "✕" : "💬"}
      </button>

      {chatOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            SmartSave Assistant
          </div>

          <div className="chat-messages" ref={chatMessagesRef}>
            {chatMessages.length === 0 && (
              <div className="chat-empty">
                👋 Hi! Ask me about saving money or finding deals.
              </div>
            )}

            {chatMessages.map((msg, i) => (
              <div 
                key={i} 
                className={`chat-message ${msg.role === "user" ? "user" : "assistant"}`}
              >
                {msg.content}
              </div>
            ))}

            {chatLoading && (
              <div className="chat-message assistant">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendChatMessage()}
              placeholder="Ask anything..."
              disabled={chatLoading}
            />
            <button
              className="chat-send-button"
              onClick={sendChatMessage}
              disabled={chatLoading || !chatInput.trim()}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatWidget;
