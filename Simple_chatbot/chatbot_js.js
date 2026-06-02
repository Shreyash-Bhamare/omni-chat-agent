// Replace this placeholder string with your real generated Groq API Key
const GROQ_API_KEY = "YOUR_GROQ_API_KEY_HERE"; 
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
    // 1. Show the typing indicator
    appendMessage("AI is typing...", "system-msg");

    // 2. Inject our teaching persona
    const systemInstruction = "You are a helpful, super friendly, and encouraging AI peer assistant designed to help college freshmen study.";

    try {
        // 3. Make the clean network request
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + GROQ_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { "role": "system", "content": systemInstruction },
                    { "role": "user", "content": userPrompt }
                ],
                temperature: 0.7
            })
        });

        // 4. Convert response to JSON
        const data = await response.json();

        // 5. Remove the "AI is typing..." indicator
        if (chatWindow.lastChild && chatWindow.lastChild.textContent === "AI is typing...") {
            chatWindow.removeChild(chatWindow.lastChild);
        }

        // 6. FIXED: Navigate the correct JSON path - choices is an ARRAY!
        if (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            const aiResponseText = data.choices[0].message.content;
            appendMessage(aiResponseText, "ai-msg"); // Display as a clean chat bubble!
        } else {
            console.error("Unexpected data structure:", data);
            appendMessage("Received an unexpected structure.", "system-msg");
        }

    } catch (error) {
        console.error("JavaScript execution error:", error);
        if (chatWindow.lastChild && chatWindow.lastChild.textContent === "AI is typing...") {
            chatWindow.removeChild(chatWindow.lastChild);
        }
        appendMessage("A connection error occurred.", "system-msg");
    }
}

// Event Bindings to capture both button mouse clicks and keyboard 'Enter' presses
sendBtn.addEventListener("click", handleUserMessage);
userInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        handleUserMessage();
    }
});