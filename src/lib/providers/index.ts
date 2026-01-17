import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";

export type ProviderType = "openai" | "google" | "anthropic";

export const providers = {
  openai: {
    default: openai("gpt-4o"),
    fast: openai("gpt-4o-mini"),
    reasoning: openai("o1-mini"),
  },
  google: {
    default: google("gemini-1.5-pro"),
    fast: google("gemini-1.5-flash"),
    reasoning: google("gemini-2.0-flash-thinking-exp"),
  },
  anthropic: {
    default: anthropic("claude-3-5-sonnet-latest"),
    fast: anthropic("claude-3-5-haiku-latest"),
    reasoning: anthropic("claude-3-5-sonnet-latest"),
  },
} as const;

export function getModel(provider: ProviderType, variant: "default" | "fast" | "reasoning" = "default") {
  return providers[provider][variant];
}
