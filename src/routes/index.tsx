import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-[#0F1012] text-white flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#2A2B2F]">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#1EAEDB] to-[#8B5CF6] flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-lg">Aether AI</span>
        </div>
        <Link to="/auth" className="text-sm text-gray-300 hover:text-white transition">Sign in</Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2A2B2F] bg-[#1A1B1E] text-xs text-gray-400 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />
          Powered by next-gen AI
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight max-w-3xl bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
          Your intelligent companion for everything
        </h1>
        <p className="mt-5 text-gray-400 max-w-xl">
          Search the web, think deeply, create on canvas, and chat with files — all in one beautifully crafted AI workspace.
        </p>
        <Link to="/chat" className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#1EAEDB] to-[#8B5CF6] hover:opacity-90 transition font-medium">
          Open chat <ArrowRight className="h-4 w-4" />
        </Link>
      </main>
    </div>
  );
}
