// Replace this placeholder string with your real generated Groq API Key
const GROQ_API_KEY = "your_groq_api_key_here"; 
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Target DOM interface nodes
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatWindow = document.getElementById("chat-window");

// Step 1: Taking User Input and kicking off execution
function handleUserMessage() {
    const text = userInput.value.trim();
    if (text === "") return; // Skip execution if input string is empty

    // Display user message on screen UI container
    appendMessage(text, "user-msg");
    userInput.value = ""; // Clear input bar text

    // Hand execution payload to the asynchronous connection layer
    sendInputToAI(text);
}

// Visual layout DOM helper utility function
function appendMessage(text, className) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", className);
    msgDiv.textContent = text;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll downward
}

// Step 2 & 3: Sending Input to AI API & Processing Network Request
async function sendInputToAI(userPrompt) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + GROQ_API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
                { "role": "user", "content": userPrompt }
            ],
            temperature: 0.7
        })
    });

    const data = await response.json();
    const aiResponseText = data.choices[0].message.content;
    appendMessage(aiResponseText, "ai-msg");
}

// Event Bindings to capture both button mouse clicks and keyboard 'Enter' presses
sendBtn.addEventListener("click", handleUserMessage);
userInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        handleUserMessage();
    }
});