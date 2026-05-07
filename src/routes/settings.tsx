import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React from "react";
import { useAuth } from "@/lib/auth-context";
import { Logo } from "@/components/Logo";
import { ArrowLeft, Download, User as UserIcon, Settings as SettingsIcon, Sparkles, LogOut } from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

const TONES = [
  { id: "friendly", label: "Friendly", desc: "Warm, casual, and encouraging" },
  { id: "professional", label: "Professional", desc: "Clear, formal, and concise" },
  { id: "concise", label: "Concise", desc: "Short and to the point" },
  { id: "creative", label: "Creative", desc: "Imaginative and expressive" },
] as const;

interface Prefs {
  tone: string;
  displayName: string;
  responseLength: "short" | "medium" | "long";
}

const DEFAULT_PREFS: Prefs = { tone: "friendly", displayName: "", responseLength: "medium" };

export function loadPrefs(): Prefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem("sonic-prefs");
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch { return DEFAULT_PREFS; }
}

function SettingsPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [prefs, setPrefs] = React.useState<Prefs>(DEFAULT_PREFS);
  const [saved, setSaved] = React.useState(false);
  const [tab, setTab] = React.useState<"profile" | "preferences" | "data">("profile");

  React.useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  React.useEffect(() => { setPrefs(loadPrefs()); }, []);

  const save = (next: Partial<Prefs>) => {
    const merged = { ...prefs, ...next };
    setPrefs(merged);
    localStorage.setItem("sonic-prefs", JSON.stringify(merged));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const exportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      user: { id: user?.id, email: user?.email, createdAt: user?.created_at },
      preferences: prefs,
      chats: JSON.parse(localStorage.getItem("sonic-chats") ?? "[]"),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sonic-ai-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0F1012] text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0F1012] text-white">
      <header className="border-b border-[#2A2B2F] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/chat" className="p-2 rounded-lg hover:bg-[#2A2B2F] text-gray-400 hover:text-white transition">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Logo className="h-8 w-8" />
          <span className="font-semibold">Sonic AI · Settings</span>
        </div>
        {saved && <span className="text-xs text-emerald-400">Saved</span>}
      </header>

      <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        <nav className="space-y-1">
          {[
            { id: "profile", label: "Profile", icon: UserIcon },
            { id: "preferences", label: "Preferences", icon: SettingsIcon },
            { id: "data", label: "Data & export", icon: Download },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id as any)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${tab === t.id ? "bg-[#2A2B2F] text-white" : "text-gray-400 hover:bg-[#1F2023] hover:text-white"}`}>
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </nav>

        <section className="rounded-2xl border border-[#2A2B2F] bg-[#1A1B1E] p-6">
          {tab === "profile" && (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#1EAEDB] to-[#8B5CF6] flex items-center justify-center text-2xl font-semibold">
                  {(prefs.displayName || user.email || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{prefs.displayName || user.email}</h2>
                  <p className="text-sm text-gray-400">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Joined {new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300">Display name</label>
                <input value={prefs.displayName} onChange={(e) => save({ displayName: e.target.value })}
                  placeholder="What should Sonic call you?"
                  className="mt-1 w-full rounded-xl bg-[#2A2B2F] border border-[#3A3B3F] px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5CF6]" />
              </div>

              <button onClick={() => signOut()} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}

          {tab === "preferences" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#8B5CF6]" /> Conversation tone</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TONES.map((t) => (
                    <button key={t.id} onClick={() => save({ tone: t.id })}
                      className={`text-left p-3 rounded-xl border transition ${prefs.tone === t.id ? "border-[#8B5CF6] bg-[#8B5CF6]/10" : "border-[#2A2B2F] bg-[#1F2023] hover:border-[#3A3B3F]"}`}>
                      <div className="text-sm font-medium">{t.label}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Response length</h3>
                <div className="flex gap-2">
                  {(["short", "medium", "long"] as const).map((l) => (
                    <button key={l} onClick={() => save({ responseLength: l })}
                      className={`flex-1 px-3 py-2 rounded-xl text-sm border transition capitalize ${prefs.responseLength === l ? "border-[#8B5CF6] bg-[#8B5CF6]/10" : "border-[#2A2B2F] bg-[#1F2023] hover:border-[#3A3B3F]"}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "data" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Export your data</h3>
              <p className="text-sm text-gray-400">Download a copy of your account, preferences and chat history as a JSON file.</p>
              <button onClick={exportData}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1EAEDB] to-[#8B5CF6] px-4 py-2.5 text-sm font-medium hover:opacity-90 transition">
                <Download className="h-4 w-4" /> Export data (JSON)
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
