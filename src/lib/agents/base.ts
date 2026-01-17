import { streamText, convertToCoreMessages, type CoreMessage } from "ai";
import { getModel, type ProviderType } from "@/lib/providers";
import { getThreadMessages, saveMessages, getOrCreateThread } from "@/lib/db/queries";
import { defaultTools } from "./tools";

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  provider: ProviderType;
  modelVariant?: "default" | "fast" | "reasoning";
  tools?: Record<string, typeof defaultTools[keyof typeof defaultTools]>;
  maxSteps?: number;
}

export async function runAgent(
  config: AgentConfig,
  userMessage: string,
  options: {
    threadId?: string;
    userId?: string;
  } = {}
) {
  const threadId = await getOrCreateThread(config.id, options.userId, options.threadId);
  const previousMessages = await getThreadMessages(threadId);

  const coreMessages: CoreMessage[] = [
    ...previousMessages.map((m) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content || "",
    })),
    { role: "user" as const, content: userMessage },
  ];

  const model = getModel(config.provider, config.modelVariant);

  const result = streamText({
    model,
    system: config.systemPrompt,
    messages: coreMessages,
    tools: config.tools || defaultTools,
    maxSteps: config.maxSteps || 5,
    onFinish: async ({ text }) => {
      await saveMessages(threadId, [
        { role: "user", content: userMessage, parts: [{ type: "text", text: userMessage }] },
        { role: "assistant", content: text, parts: [{ type: "text", text }] },
      ]);
    },
  });

  return { result, threadId };
}

export function createAgent(config: AgentConfig) {
  return {
    ...config,
    run: (message: string, options?: { threadId?: string; userId?: string }) =>
      runAgent(config, message, options),
  };
}
