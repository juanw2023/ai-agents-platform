import { describe, it, expect } from "vitest";
import { agentConfigs, generalAssistant, codeAssistant, researchAssistant } from "@/lib/agents";

describe("Agent Configurations", () => {
  it("has general assistant configured with OpenAI", () => {
    expect(generalAssistant.id).toBe("general-assistant");
    expect(generalAssistant.provider).toBe("openai");
    expect(generalAssistant.tools).toBeDefined();
  });

  it("has code assistant configured with Anthropic", () => {
    expect(codeAssistant.id).toBe("code-assistant");
    expect(codeAssistant.provider).toBe("anthropic");
    expect(codeAssistant.maxSteps).toBe(3);
  });

  it("has research assistant configured with Google", () => {
    expect(researchAssistant.id).toBe("research-assistant");
    expect(researchAssistant.provider).toBe("google");
    expect(researchAssistant.maxSteps).toBe(10);
  });

  it("exports all agent configs in a record", () => {
    expect(Object.keys(agentConfigs)).toEqual([
      "general-assistant",
      "code-assistant",
      "research-assistant",
    ]);
  });

  it("each agent has required properties", () => {
    Object.values(agentConfigs).forEach((config) => {
      expect(config.id).toBeDefined();
      expect(config.name).toBeDefined();
      expect(config.description).toBeDefined();
      expect(config.systemPrompt).toBeDefined();
      expect(config.provider).toBeDefined();
    });
  });
});
