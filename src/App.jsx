import React, { useState, useEffect, useRef } from "react";

const themes = {
  "dark-red": {
    html: "bg-gray-900 text-white",
    body: "bg-gray-900",
    userMsg: "bg-green-100 p-3 rounded-lg w-fit ml-auto text-black",
    botMsg: "bg-gray-700 p-3 rounded-lg w-fit text-white",
    tailUser: "after:absolute after:bottom-0 after:right-[-8px] after:border-t-8 after:border-l-8 after:border-transparent after:border-l-green-100",
    tailBot: "after:absolute after:bottom-0 after:left-[-8px] after:border-t-8 after:border-r-8 after:border-transparent after:border-r-gray-700",
  },
  "white-red": {
    html: "bg-white text-red-700",
    body: "bg-white",
    userMsg: "bg-green-100 p-3 rounded-lg w-fit ml-auto text-black",
    botMsg: "bg-gray-200 p-3 rounded-lg w-fit text-black",
    tailUser: "after:absolute after:bottom-0 after:right-[-8px] after:border-t-8 after:border-l-8 after:border-transparent after:border-l-green-100",
    tailBot: "after:absolute after:bottom-0 after:left-[-8px] after:border-t-8 after:border-r-8 after:border-transparent after:border-r-gray-200",
  },
  "black-red": {
    html: "bg-black text-red-500",
    body: "bg-black",
    userMsg: "bg-green-100 p-3 rounded-lg w-fit ml-auto text-black",
    botMsg: "bg-gray-800 p-3 rounded-lg w-fit text-white",
    tailUser: "after:absolute after:bottom-0 after:right-[-8px] after:border-t-8 after:border-l-8 after:border-transparent after:border-l-green-100",
    tailBot: "after:absolute after:bottom-0 after:left-[-8px] after:border-t-8 after:border-r-8 after:border-transparent after:border-r-gray-800",
  },
};

export default function App() {
  const [theme, setTheme] = useState("white-red");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization:
            "Bearer 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",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openrouter/cypher-alpha:free",
          messages: newMessages,
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "Hakuna jibu.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Tatizo limetokea." }]);
    }
  }

  return (
    <div className={`${themes[theme].html} min-h-screen`}>
      {/* Theme Buttons */}
      <div className="flex justify-center gap-4 p-4 bg-white shadow sticky top-0 z-10">
        <button onClick={() => setTheme("dark-red")} className="px-4 py-2 bg-red-800 text-white rounded">Dark Red</button>
        <button onClick={() => setTheme("white-red")} className="px-4 py-2 bg-white text-red-700 border border-red-700 rounded">White Red</button>
        <button onClick={() => setTheme("black-red")} className="px-4 py-2 bg-black text-red-500 rounded">Black Red</button>
      </div>

      {/* Chat Container */}
      <div className={`${themes[theme].body} flex justify-center`}>
        <div className="w-full max-w-3xl flex flex-col h-[calc(100vh-120px)]">
          <div ref={chatBoxRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`relative ${
                  msg.role === "user"
                    ? `${themes[theme].userMsg} ${themes[theme].tailUser}`
                    : `${themes[theme].botMsg} ${themes[theme].tailBot}`
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 p-4 bg-white shadow-md">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border px-4 py-2 rounded"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <button onClick={sendMessage} className="bg-green-600 text-white px-4 py-2 rounded">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
