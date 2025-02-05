"use client";
import { useState } from "react";
import Image from "next/image";
import { Suspense } from "react";


export default function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");



  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");

    setTimeout(async () => {
      let botResponse;
      try {
        const res = await fetch("/chatbot-client/api", {
          method: "POST",
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ text: userMessage.text })
        });
        const { data } = await res.json();
        // console.log(data);
        botResponse = { text: data, sender: "bot" };
      }
      catch (e) {
        botResponse = { text: "unable to retrieve data", sender: "bot" };
      }
      setMessages((prev) => [...prev, botResponse]);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-screen p-1 bg-gray-100">
      <h1 className="text-center text-2xl">AI chatbot</h1>
      <div className="flex-1 overflow-y-auto p-4 bg-white rounded-xl shadow-md">
        <Suspense
          fallback={
            <div className="text-sm text-gray-500">generating text...</div>
          }
        >
          {messages.map((msg, index) => (
            <div key={index}>
              {msg.sender === 'user' ?
                <Image
                  className="light:invert ml-auto"
                  src="https://cdn-icons-png.flaticon.com/512/5953/5953714.png"
                  alt="bot"
                  width={25}
                  height={25}
                  priority
                />
                :

                <Image
                  className="light:invert"
                  src="https://cdn-icons-png.flaticon.com/512/8649/8649607.png"
                  alt="bot"
                  width={25}
                  height={25}
                  priority
                />
              }
              <div
                className={`p-2 my-2 max-w-xs rounded-lg text-white ${msg.sender === "user" ? "bg-blue-500 ml-auto" : "bg-gray-600 mr-auto"
                  }`}
              >
                <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, "<br/>") }} />
              </div>
            </div>
          ))}
        </Suspense>

      </div>

      <div className="flex mt-2 p-10">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg focus:outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
}
