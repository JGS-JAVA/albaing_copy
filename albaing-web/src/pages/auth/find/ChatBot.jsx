import React, { useState } from "react";
import axios from "axios";
import "./ChatBot.css";
// 커밋하기
const ChatBot = () => {
    const [messages, setMessages] = useState([{ sender: "bot", text: "안녕하세요! 무엇을 도와드릴까요?" }]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        const currentInput = input;

        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInput("");
        setIsLoading(true);

        axios.post("http://localhost:8080/chatbot/dialogflow", null, {
            params: { sessionId: "user-" + Date.now(), message: currentInput }
        })
            .then(response => {
                const botReply = response.data.response;
                setMessages(prevMessages => [...prevMessages, {
                    sender: "bot",
                    text: botReply
                }]);
            })
            .catch(error => {
                console.error("Error:", error);
                setMessages(prevMessages => [...prevMessages, {
                    sender: "bot",
                    text: "오류가 발생했어요. 다시 시도해주세요."
                }]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender === "user" ? "chat-message user" : "chat-message bot"}>
                        {msg.text}
                    </div>
                ))}
                {isLoading && <div className="chat-message bot loading">메시지 처리 중...</div>}
            </div>

            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    disabled={isLoading}
                />
                <button onClick={sendMessage} disabled={isLoading}>
                    {isLoading ? "처리 중..." : "전송"}
                </button>
            </div>
        </div>
    );
};

export default ChatBot;