import { describe, it, expect } from "vitest";
import { calculatorTool, currentTimeTool, webSearchTool } from "@/lib/agents/tools";

describe("Agent Tools", () => {
  describe("calculatorTool", () => {
    it("evaluates simple math expressions", async () => {
      const result = await calculatorTool.execute({ expression: "2 + 2" }, {
        toolCallId: "test",
        messages: [],
      });
      expect(result.success).toBe(true);
      expect(result.result).toBe("4");
    });

    it("evaluates complex expressions", async () => {
      const result = await calculatorTool.execute({ expression: "Math.pow(2, 10)" }, {
        toolCallId: "test",
        messages: [],
      });
      expect(result.success).toBe(true);
      expect(result.result).toBe("1024");
    });

    it("handles invalid expressions gracefully", async () => {
      const result = await calculatorTool.execute({ expression: "invalid()" }, {
        toolCallId: "test",
        messages: [],
      });
      expect(result.success).toBe(false);
    });
  });

  describe("currentTimeTool", () => {
    it("returns current time in UTC by default", async () => {
      const result = await currentTimeTool.execute({}, {
        toolCallId: "test",
        messages: [],
      });
      expect(result.datetime).toBeDefined();
      expect(typeof result.datetime).toBe("string");
    });

    it("accepts timezone parameter", async () => {
      const result = await currentTimeTool.execute({ timezone: "America/New_York" }, {
        toolCallId: "test",
        messages: [],
      });
      expect(result.datetime).toBeDefined();
    });
  });

  describe("webSearchTool", () => {
    it("returns placeholder search results", async () => {
      const result = await webSearchTool.execute({ query: "test query" }, {
        toolCallId: "test",
        messages: [],
      });
      expect(result.results).toBeDefined();
      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results[0].snippet).toContain("test query");
    });
  });
});
