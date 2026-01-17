import { createAgent, type AgentConfig } from "./base";
import { defaultTools } from "./tools";

export const generalAssistant: AgentConfig = {
  id: "general-assistant",
  name: "General Assistant",
  description: "A helpful general-purpose AI assistant",
  systemPrompt: `You are a helpful, friendly AI assistant. You can help with a variety of tasks including:
- Answering questions
- Performing calculations
- Providing information about the current time
- General conversation

Be concise, accurate, and helpful. If you don't know something, say so.`,
  provider: "openai",
  modelVariant: "default",
  tools: defaultTools,
  maxSteps: 5,
};

export const codeAssistant: AgentConfig = {
  id: "code-assistant",
  name: "Code Assistant",
  description: "A specialized coding and programming assistant",
  systemPrompt: `You are an expert software engineer and coding assistant. You help with:
- Writing and reviewing code
- Debugging issues
- Explaining programming concepts
- Architecture and design decisions
- Best practices and code quality

Always provide clear, well-documented code examples. Explain your reasoning.`,
  provider: "anthropic",
  modelVariant: "default",
  tools: { calculator: defaultTools.calculator },
  maxSteps: 3,
};

export const researchAssistant: AgentConfig = {
  id: "research-assistant",
  name: "Research Assistant",
  description: "A research and information gathering assistant",
  systemPrompt: `You are a research assistant specialized in finding and synthesizing information. You help with:
- Research questions
- Summarizing complex topics
- Fact-checking and verification
- Finding relevant information

Always cite your sources when possible and be clear about certainty levels.`,
  provider: "google",
  modelVariant: "default",
  tools: { webSearch: defaultTools.webSearch, currentTime: defaultTools.currentTime },
  maxSteps: 10,
};

export const agents = {
  general: createAgent(generalAssistant),
  code: createAgent(codeAssistant),
  research: createAgent(researchAssistant),
};

export const agentConfigs: Record<string, AgentConfig> = {
  "general-assistant": generalAssistant,
  "code-assistant": codeAssistant,
  "research-assistant": researchAssistant,
};

export { createAgent } from "./base";
export { defaultTools } from "./tools";
