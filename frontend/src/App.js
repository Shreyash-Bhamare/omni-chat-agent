import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { text: "Hello! I am your Omni-Chat Agent. Ask me a question or ask me to summarize text!", sender: "bot" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef(null);

  // Auto-scroll to bottom when a new message arrives
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
      // Note: We now talk to our Python Backend, NOT directly to Groq!
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text })
      });

      const data = await response.json();

      // Frontend Error Handling checks the backend's response package
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

  return (
    <div className="chat-container">
      <div className="chat-header">Omni-Chat Agent</div>
      
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {/* Split by newline to preserve Groq's bullet points and formatting natively */}
            {msg.text.split('\n').map((line, i) => (
              <span key={i}>{line}<br/></span>
            ))}
          </div>
        ))}
        {isLoading && <div className="message bot">Agent is thinking...</div>}
      </div>

      <div className="input-box">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading}>
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default App;