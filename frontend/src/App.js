import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { text: "Welcome, student! I am your Omni-Chat Teacher. Ask me any question or share text you'd like me to summarize. Let's learn together!", sender: "bot" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred on the server.");
      }

      setMessages(prev => [...prev, { text: data.response, sender: "bot" }]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { text: `Error: ${error.message}`, sender: "error-msg" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ text: "Welcome back, student! What would you like to learn today?", sender: "bot" }]);
  };

  const getTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="app-wrapper">
      <div className="chat-container">

        {/* Header */}
        <div className="chat-header">
          <div className="header-left">
            <div className="teacher-avatar">👨‍🏫</div>
            <div className="header-info">
              <span className="header-title">Omni-Chat Teacher</span>
              <span className="header-subtitle">Always here to help you learn</span>
            </div>
          </div>
          <button className="clear-btn" onClick={clearChat} title="Clear chat">
            🗑️
          </button>
        </div>

        {/* Chalkboard Banner */}
        <div className="chalkboard-banner">
          <span>📚 Classroom Session in Progress 📚</span>
        </div>

        {/* Chat Window */}
        <div className="chat-window" ref={chatWindowRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.sender}`}>
              {msg.sender === 'bot' && (
                <div className="avatar teacher-icon">👨‍🏫</div>
              )}
              <div className="message-block">
                <span className="role-label">
                  {msg.sender === 'bot' ? 'Teacher' : msg.sender === 'user' ? 'Student' : '⚠️ Notice'}
                </span>
                <div className={`message ${msg.sender}`}>
                  {msg.text.split('\n').map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
                </div>
                <span className="timestamp">{getTimestamp()}</span>
              </div>
              {msg.sender === 'user' && (
                <div className="avatar student-icon">🧑‍🎓</div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="message-wrapper bot">
              <div className="avatar teacher-icon">👨‍🏫</div>
              <div className="message-block">
                <span className="role-label">Teacher</span>
                <div className="message bot thinking">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Box */}
        <div className="input-box">
          <div className="student-input-label">🧑‍🎓 Your Question:</div>
          <div className="input-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask your teacher anything..."
              disabled={isLoading}
            />
            <button onClick={sendMessage} disabled={isLoading}>
              {isLoading ? '...' : 'Ask ✏️'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;