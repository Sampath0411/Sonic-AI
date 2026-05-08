import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import {
  Search, Plus, MessageSquare, LogOut,
  PanelLeftClose, PanelLeft, User as UserIcon, Settings, Trash2,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Preloader } from "@/components/Preloader";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
});

interface ChatItem { id: string; title: string; }
interface Msg { id?: string; role: "user" | "assistant"; content: string; }

interface Profile { display_name: string | null; avatar_url: string | null; tone: string; response_length: string; }

function ChatPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [chats, setChats] = React.useState<ChatItem[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<Msg[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [chatsLoading, setChatsLoading] = React.useState(true);
  const [msgsLoading, setMsgsLoading] = React.useState(false);
  const [profile, setProfile] = React.useState<Profile | null>(null);

  React.useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  // Load chats + profile
  React.useEffect(() => {
    if (!user) return;
    (async () => {
      setChatsLoading(true);
      const [{ data: c }, { data: p }] = await Promise.all([
        supabase.from("chats").select("id,title").order("updated_at", { ascending: false }),
        supabase.from("profiles").select("display_name,avatar_url,tone,response_length").eq("user_id", user.id).maybeSingle(),
      ]);
      setChats((c as any) ?? []);
      setProfile((p as any) ?? { display_name: null, avatar_url: null, tone: "friendly", response_length: "medium" });
      if (c && c.length > 0) setActiveId((c[0] as any).id);
      setChatsLoading(false);
    })();
  }, [user]);

  // Load messages for active chat
  React.useEffect(() => {
    if (!activeId) { setMessages([]); return; }
    (async () => {
      setMsgsLoading(true);
      const { data } = await supabase.from("messages")
        .select("id,role,content").eq("chat_id", activeId).order("created_at");
      setMessages((data as any) ?? []);
      setMsgsLoading(false);
    })();
  }, [activeId]);

  if (loading || !user) return <Preloader />;

  const filtered = chats.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));

  const newChat = async () => {
    const { data, error } = await supabase.from("chats")
      .insert({ user_id: user.id, title: "New chat" }).select("id,title").single();
    if (error) { toast.error(error.message); return; }
    setChats((cs) => [data as any, ...cs]);
    setActiveId((data as any).id);
    setMessages([]);
  };

  const deleteChat = async (id: string) => {
    await supabase.from("chats").delete().eq("id", id);
    setChats((cs) => cs.filter((c) => c.id !== id));
    if (activeId === id) { setActiveId(null); setMessages([]); }
  };

  const handleSend = async (msg: string) => {
    if (!msg.trim() || isLoading) return;

    let chatId = activeId;
    if (!chatId) {
      const { data, error } = await supabase.from("chats")
        .insert({ user_id: user.id, title: msg.slice(0, 50) }).select("id,title").single();
      if (error) { toast.error(error.message); return; }
      chatId = (data as any).id;
      setChats((cs) => [data as any, ...cs]);
      setActiveId(chatId);
    }

    const userMsg: Msg = { role: "user", content: msg };
    const next = [...messages, userMsg];
    setMessages(next);
    setIsLoading(true);

    await supabase.from("messages").insert({ chat_id: chatId, user_id: user.id, role: "user", content: msg });

    // Update title from first user message
    if (messages.length === 0) {
      const title = msg.slice(0, 50);
      await supabase.from("chats").update({ title }).eq("id", chatId);
      setChats((cs) => cs.map((c) => (c.id === chatId ? { ...c, title } : c)));
    }

    try {
      const fnUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const resp = await fetch(fnUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map(({ role, content }) => ({ role, content })),
          tone: profile?.tone ?? "friendly",
          responseLength: profile?.response_length ?? "medium",
          displayName: profile?.display_name,
        }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: "Request failed" }));
        toast.error(err.error || "AI request failed");
        setIsLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              assistantText += delta;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: assistantText };
                return copy;
              });
            }
          } catch {}
        }
      }

      if (assistantText) {
        await supabase.from("messages").insert({
          chat_id: chatId, user_id: user.id, role: "assistant", content: assistantText,
        });
      }
    } catch (e: any) {
      toast.error(e.message ?? "Failed to reach AI");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0F1012] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className={`flex flex-col border-r border-[#2A2B2F] bg-[#1A1B1E] transition-all duration-300 ${collapsed ? "w-16" : "w-72"}`}>
        <div className="flex items-center justify-between p-3 border-b border-[#2A2B2F]">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <Logo className="h-8 w-8" spin />
              <span className="font-semibold">Sonic AI</span>
            </Link>
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
          {chatsLoading ? (
            <div className="space-y-2 px-1">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-9 w-full bg-[#2A2B2F]" />)}
            </div>
          ) : filtered.map((chat) => (
            <div key={chat.id} className={`group flex items-center gap-1 rounded-lg mb-1 ${activeId === chat.id ? "bg-[#2A2B2F]" : "hover:bg-[#2A2B2F]/50"}`}>
              <button onClick={() => setActiveId(chat.id)}
                className="flex-1 flex items-center gap-2 px-3 py-2 text-sm text-left">
                <MessageSquare className="h-4 w-4 flex-shrink-0 text-gray-400" />
                {!collapsed && <span className="truncate">{chat.title}</span>}
              </button>
              {!collapsed && (
                <button onClick={() => deleteChat(chat.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 mr-1 text-gray-500 hover:text-red-400 transition">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-[#2A2B2F]">
          <Link to="/settings" className={`flex items-center gap-2 px-2 py-2 rounded-xl bg-[#2A2B2F] hover:bg-[#33343A] transition ${collapsed ? "justify-center" : ""}`}>
            <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-br from-[#8B5CF6] to-[#F97316] flex items-center justify-center flex-shrink-0">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <UserIcon className="h-4 w-4 text-white" />
              )}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{profile?.display_name || user.email}</p>
                  <p className="text-[10px] text-gray-500">View profile</p>
                </div>
                <Settings className="h-4 w-4 text-gray-400" />
              </>
            )}
          </Link>
          {!collapsed && (
            <button onClick={() => signOut()} className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-[#2A2B2F] transition">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          {msgsLoading ? (
            <div className="max-w-3xl mx-auto space-y-4">
              <Skeleton className="h-16 w-3/4 bg-[#1F2023]" />
              <Skeleton className="h-20 w-2/3 ml-auto bg-[#1F2023]" />
              <Skeleton className="h-24 w-3/4 bg-[#1F2023]" />
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <Logo className="h-20 w-20 mb-4" spin />
              <h1 className="text-3xl font-semibold mb-2">
                {profile?.display_name ? `Hi ${profile.display_name}, how can I help?` : "How can I help today?"}
              </h1>
              <p className="text-gray-400">Ask anything — Sonic AI remembers your preferences.</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-gradient-to-r from-[#1EAEDB] to-[#8B5CF6] text-white" : "bg-[#1F2023] border border-[#2A2B2F] text-gray-100"}`}>
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                      </div>
                    ) : m.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 md:p-6 max-w-3xl mx-auto w-full">
          <PromptInputBox onSend={handleSend} isLoading={isLoading} />
          <p className="text-center text-xs text-gray-500 mt-2">Sonic AI may produce inaccurate information.</p>
        </div>
      </main>
    </div>
  );
}
