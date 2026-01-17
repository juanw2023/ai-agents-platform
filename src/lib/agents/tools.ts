import { tool } from "ai";
import { z } from "zod";

export const calculatorTool = tool({
  description: "Perform mathematical calculations",
  parameters: z.object({
    expression: z.string().describe("The mathematical expression to evaluate"),
  }),
  execute: async ({ expression }) => {
    try {
      const result = Function(`"use strict"; return (${expression})`)();
      return { result: String(result), success: true };
    } catch {
      return { result: "Error evaluating expression", success: false };
    }
  },
});

export const currentTimeTool = tool({
  description: "Get the current date and time",
  parameters: z.object({
    timezone: z.string().optional().describe("Timezone (e.g., 'America/New_York')"),
  }),
  execute: async ({ timezone }) => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      dateStyle: "full",
      timeStyle: "long",
      timeZone: timezone || "UTC",
    };
    return { datetime: now.toLocaleString("en-US", options) };
  },
});

export const webSearchTool = tool({
  description: "Search the web for information (placeholder - implement with your preferred search API)",
  parameters: z.object({
    query: z.string().describe("The search query"),
  }),
  execute: async ({ query }) => {
    return {
      results: [
        { title: "Placeholder result", snippet: `Search results for: ${query}` },
      ],
      note: "Implement with your preferred search API (Tavily, Serper, etc.)",
    };
  },
});

export const defaultTools = {
  calculator: calculatorTool,
  currentTime: currentTimeTool,
  webSearch: webSearchTool,
};
