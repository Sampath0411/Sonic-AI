import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React from "react";
import { useAuth } from "@/lib/auth-context";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { Search, Plus, MessageSquare, LogOut, PanelLeftClose, PanelLeft, Sparkles, User as UserIcon } from "lucide-react";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
});

interface ChatItem { id: string; title: string; }

function ChatPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [chats, setChats] = React.useState<ChatItem[]>([
    { id: "1", title: "Welcome to Aether" },
  ]);
  const [activeId, setActiveId] = React.useState<string>("1");
  const [messages, setMessages] = React.useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0F1012] text-gray-400">Loading...</div>;
  }

  const filtered = chats.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));

  const newChat = () => {
    const id = Date.now().toString();
    setChats([{ id, title: "New chat" }, ...chats]);
    setActiveId(id);
    setMessages([]);
  };

  const handleSend = (msg: string) => {
    if (!msg.trim()) return;
    setMessages((m) => [...m, { role: "user", content: msg }]);
    setIsLoading(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", content: "This is a simulated response. Connect an AI backend to get real answers." }]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex h-screen w-full bg-[#0F1012] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className={`flex flex-col border-r border-[#2A2B2F] bg-[#1A1B1E] transition-all duration-300 ${collapsed ? "w-16" : "w-72"}`}>
        <div className="flex items-center justify-between p-3 border-b border-[#2A2B2F]">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#1EAEDB] to-[#8B5CF6] flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">Aether</span>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-[#2A2B2F] text-gray-400 hover:text-white transition">
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        <div className="p-3 space-y-2">
          <button onClick={newChat}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-[#1EAEDB] to-[#8B5CF6] hover:opacity-90 transition text-sm font-medium">
            <Plus className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>New chat</span>}
          </button>

          {!collapsed && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search chats..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#2A2B2F] border border-[#3A3B3F] text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#8B5CF6] transition" />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          {filtered.map((chat) => (
            <button key={chat.id} onClick={() => setActiveId(chat.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition mb-1 ${activeId === chat.id ? "bg-[#2A2B2F] text-white" : "text-gray-400 hover:bg-[#2A2B2F]/50 hover:text-white"}`}>
              <MessageSquare className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span className="truncate text-left">{chat.title}</span>}
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-[#2A2B2F]">
          <div className={`flex items-center gap-2 px-2 py-2 rounded-xl bg-[#2A2B2F] ${collapsed ? "justify-center" : ""}`}>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#F97316] flex items-center justify-center flex-shrink-0">
              <UserIcon className="h-4 w-4 text-white" />
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{user.email}</p>
                  <p className="text-[10px] text-gray-500">Free plan</p>
                </div>
                <button onClick={() => signOut()} className="p-2 rounded-lg hover:bg-[#3A3B3F] text-gray-400 hover:text-white transition" title="Sign out">
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#1EAEDB] to-[#8B5CF6] flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-semibold mb-2">How can I help today?</h1>
              <p className="text-gray-400">Ask anything, search the web, think deeply, or create on canvas.</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-gradient-to-r from-[#1EAEDB] to-[#8B5CF6] text-white" : "bg-[#1F2023] border border-[#2A2B2F] text-gray-100"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 md:p-6 max-w-3xl mx-auto w-full">
          <PromptInputBox onSend={handleSend} isLoading={isLoading} />
          <p className="text-center text-xs text-gray-500 mt-2">Aether may produce inaccurate information.</p>
        </div>
      </main>
    </div>
  );
}
