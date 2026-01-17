import { streamText, convertToCoreMessages, type CoreMessage } from "ai";
import { agentConfigs } from "@/lib/agents";
import { getModel } from "@/lib/providers";
import { getThreadMessages, saveMessages, getOrCreateThread } from "@/lib/db/queries";
import { defaultTools } from "@/lib/agents/tools";

export async function POST(req: Request) {
  try {
    const { messages, agentId = "general-assistant", threadId, userId } = await req.json();

    const config = agentConfigs[agentId];
    if (!config) {
      return new Response(JSON.stringify({ error: "Agent not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const currentThreadId = await getOrCreateThread(config.id, userId, threadId);
    const previousMessages = await getThreadMessages(currentThreadId);

    const allMessages: CoreMessage[] = [
      ...previousMessages.map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content || "",
      })),
      ...messages,
    ];

    const model = getModel(config.provider, config.modelVariant);

    const result = streamText({
      model,
      system: config.systemPrompt,
      messages: allMessages,
      tools: config.tools || defaultTools,
      maxSteps: config.maxSteps || 5,
      onFinish: async ({ text }) => {
        const lastUserMessage = messages[messages.length - 1];
        await saveMessages(currentThreadId, [
          {
            role: "user",
            content: lastUserMessage.content,
            parts: [{ type: "text", text: lastUserMessage.content }],
          },
          { role: "assistant", content: text, parts: [{ type: "text", text }] },
        ]);
      },
    });

    return result.toDataStreamResponse({
      headers: {
        "X-Thread-Id": currentThreadId,
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
