import { eq, desc, and } from "drizzle-orm";
import { db, schema } from "./index";
import type { Message } from "./schema";

export async function getThreadMessages(threadId: string): Promise<Message[]> {
  return db
    .select()
    .from(schema.messages)
    .where(eq(schema.messages.threadId, threadId))
    .orderBy(schema.messages.createdAt);
}

export async function saveMessage(
  threadId: string,
  role: "user" | "assistant" | "system" | "tool",
  content: string | null,
  parts: unknown[]
): Promise<Message> {
  const [message] = await db
    .insert(schema.messages)
    .values({ threadId, role, content, parts })
    .returning();
  return message;
}

export async function saveMessages(
  threadId: string,
  messages: Array<{ role: "user" | "assistant" | "system" | "tool"; content: string | null; parts: unknown[] }>
): Promise<Message[]> {
  return db
    .insert(schema.messages)
    .values(messages.map((m) => ({ threadId, ...m })))
    .returning();
}

export async function getOrCreateThread(
  agentId: string,
  userId?: string,
  threadId?: string
): Promise<string> {
  if (threadId) {
    const [existing] = await db
      .select()
      .from(schema.threads)
      .where(eq(schema.threads.id, threadId))
      .limit(1);
    if (existing) return existing.id;
  }

  const [thread] = await db
    .insert(schema.threads)
    .values({ agentId, userId })
    .returning();
  return thread.id;
}

export async function getUserThreads(userId: string, agentId?: string) {
  const whereCondition = agentId
    ? and(eq(schema.threads.userId, userId), eq(schema.threads.agentId, agentId))
    : eq(schema.threads.userId, userId);

  return db
    .select()
    .from(schema.threads)
    .where(whereCondition)
    .orderBy(desc(schema.threads.updatedAt));
}
