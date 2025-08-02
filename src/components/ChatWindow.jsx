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
        threadId: "38-IT-A",
        resourceId: "weatherAgent",
    };

    try {
        const response = await fetch(
        "https://brief-thousands-sunset-9fcb1c78-485f-4967-ac04-2759a8fa1462.mastra.cloud/api/agents/weatherAgent/stream",
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer test-openai-key",
            },
            body: JSON.stringify(payload),
        }
        );

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let botReply = "";

        while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        botReply += chunk;

        setMessages((prev) => [
            ...prev.filter((msg) => msg.role !== "assistant"),
            { role: "assistant", content: botReply },
        ]);
        }
    } catch (error) {
        setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
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
