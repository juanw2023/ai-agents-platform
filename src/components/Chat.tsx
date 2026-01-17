"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

interface Agent {
  id: string;
  name: string;
  description: string;
  provider: string;
}

const AGENTS: Agent[] = [
  { id: "general-assistant", name: "General Assistant", description: "A helpful general-purpose AI assistant", provider: "openai" },
  { id: "code-assistant", name: "Code Assistant", description: "A specialized coding assistant", provider: "anthropic" },
  { id: "research-assistant", name: "Research Assistant", description: "A research and information gathering assistant", provider: "google" },
];

export function Chat() {
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: { agentId: selectedAgent.id },
  });

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Select Agent:</label>
        <select
          value={selectedAgent.id}
          onChange={(e) => setSelectedAgent(AGENTS.find((a) => a.id === e.target.value) || AGENTS[0])}
          className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800"
        >
          {AGENTS.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name} ({agent.provider})
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-500 mt-1">{selectedAgent.description}</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg ${
              message.role === "user"
                ? "bg-blue-100 dark:bg-blue-900 ml-12"
                : "bg-gray-100 dark:bg-gray-800 mr-12"
            }`}
          >
            <div className="font-semibold text-sm mb-1">
              {message.role === "user" ? "You" : selectedAgent.name}
            </div>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mr-12">
            <div className="animate-pulse">Thinking...</div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-1 p-3 border rounded-lg bg-white dark:bg-gray-800"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
