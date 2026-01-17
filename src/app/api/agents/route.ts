import { agentConfigs } from "@/lib/agents";

export async function GET() {
  const agents = Object.entries(agentConfigs).map(([id, config]) => ({
    id,
    name: config.name,
    description: config.description,
    provider: config.provider,
  }));

  return Response.json({ agents });
}
