import "./ChatWindow.css";
import React, { useState } from "react";

function ChatWindow() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

const sendMessage = async (userInput) => {
    const userMessage = { role: "user", content: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const payload = {
        messages: [userMessage],
        runId: "weatherAgent",
        maxRetries: 2,
        maxSteps: 5,
        temperature: 0.5,
        topP: 1,
        runtimeContext: {},
      threadId: "38-IT-A", // or any unique value
        resourceId: "weatherAgent",
    };

    try {
        const response = await fetch(
        "https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent", // ❗non-streaming fallback URL
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "x-mastra-dev-playground": "true", // needed for dev environment
            "Authorization": "Bearer test-openai-key", // if required
            },
            body: JSON.stringify(payload),
        }
    );

        const data = await response.json();
        console.log("Response data:", data);

        const reply = data?.result || "Sorry, no response received.";

        setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply }
        ]);
    } catch (error) {
        console.error("API Error:", error);
        setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." }
        ]);
    }

    setIsLoading(false);
    setInput("");
};

const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
    sendMessage(input);
    }
};

return (
    <div className="chat-container">
    <h3>Weather Bot</h3>

    {messages.map((msg, index) => (
        <p key={index} className={`message ${msg.role === "user" ? "user" : "bot"}`}>
            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.content}
        </p>
    ))}

    {isLoading && <p className="message bot">Bot is typing...</p>}    

    <form onSubmit={handleSubmit}>
        <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
        />
        <button type="submit">Send</button>
    </form>
    </div>
);
}

export default ChatWindow;
