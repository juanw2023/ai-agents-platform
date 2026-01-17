import { Chat } from "@/components/Chat";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto">
        <header className="py-6 text-center border-b">
          <h1 className="text-3xl font-bold">AI Agents Platform</h1>
          <p className="text-gray-500 mt-2">Multi-agent system with memory and tool support</p>
        </header>
        <Chat />
      </div>
    </main>
  );
}
