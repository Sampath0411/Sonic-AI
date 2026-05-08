import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { Preloader } from "@/components/Preloader";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Download, User as UserIcon, Settings as SettingsIcon, Sparkles, LogOut, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

const TONES = [
  { id: "friendly", label: "Friendly", desc: "Warm, casual, and encouraging" },
  { id: "professional", label: "Professional", desc: "Clear, formal, and concise" },
  { id: "concise", label: "Concise", desc: "Short and to the point" },
  { id: "creative", label: "Creative", desc: "Imaginative and expressive" },
];

const AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sonic",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Nova",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Astro",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Echo",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Bolt",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Pixel",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Flux",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Quantum",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Sun",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Moon",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Star",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Comet",
];

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
  tone: string;
  response_length: string;
}

function SettingsPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = React.useState(true);
  const [tab, setTab] = React.useState<"profile" | "preferences" | "data">("profile");

  React.useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  React.useEffect(() => {
    if (!user) return;
    (async () => {
      setProfileLoading(true);
      const { data } = await supabase.from("profiles")
        .select("display_name,avatar_url,tone,response_length")
        .eq("user_id", user.id).maybeSingle();
      setProfile((data as any) ?? { display_name: null, avatar_url: null, tone: "friendly", response_length: "medium" });
      setProfileLoading(false);
    })();
  }, [user]);

  const save = async (next: Partial<Profile>) => {
    if (!user || !profile) return;
    const merged = { ...profile, ...next };
    setProfile(merged);
    const { error } = await supabase.from("profiles")
      .upsert({ user_id: user.id, ...merged }, { onConflict: "user_id" });
    if (error) toast.error(error.message);
    else toast.success("Saved");
  };

  const exportData = async () => {
    if (!user) return;
    const [{ data: chats }, { data: messages }] = await Promise.all([
      supabase.from("chats").select("*"),
      supabase.from("messages").select("*"),
    ]);
    const data = {
      exportedAt: new Date().toISOString(),
      user: { id: user.id, email: user.email, createdAt: user.created_at },
      profile, chats, messages,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `sonic-ai-export-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || !user) return <Preloader />;

  return (
    <div className="min-h-screen bg-[#0F1012] text-white">
      <header className="border-b border-[#2A2B2F] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/chat" className="p-2 rounded-lg hover:bg-[#2A2B2F] text-gray-400 hover:text-white transition">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Logo className="h-8 w-8" spin />
          <span className="font-semibold">Sonic AI · Settings</span>
        </div>
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
          {profileLoading || !profile ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-2/3 bg-[#2A2B2F]" />
              <Skeleton className="h-10 w-full bg-[#2A2B2F]" />
              <Skeleton className="h-32 w-full bg-[#2A2B2F]" />
            </div>
          ) : tab === "profile" ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br from-[#1EAEDB] to-[#8B5CF6] flex items-center justify-center text-2xl font-semibold">
                  {profile.avatar_url
                    ? <img src={profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
                    : (profile.display_name || user.email || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{profile.display_name || user.email}</h2>
                  <p className="text-sm text-gray-400">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Joined {new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300">Display name</label>
                <input value={profile.display_name ?? ""} onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                  onBlur={(e) => save({ display_name: e.target.value })}
                  placeholder="What should Sonic call you?"
                  className="mt-1 w-full rounded-xl bg-[#2A2B2F] border border-[#3A3B3F] px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5CF6]" />
              </div>

              <div>
                <label className="text-sm text-gray-300">Profile picture</label>
                <div className="mt-2 grid grid-cols-6 gap-2">
                  {AVATARS.map((url) => (
                    <button key={url} onClick={() => save({ avatar_url: url })}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${profile.avatar_url === url ? "border-[#8B5CF6]" : "border-transparent hover:border-[#3A3B3F]"}`}>
                      <img src={url} alt="" className="h-full w-full object-cover bg-[#2A2B2F]" />
                      {profile.avatar_url === url && (
                        <div className="absolute inset-0 bg-[#8B5CF6]/30 flex items-center justify-center">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => signOut()} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          ) : tab === "preferences" ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#8B5CF6]" /> Conversation tone</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TONES.map((t) => (
                    <button key={t.id} onClick={() => save({ tone: t.id })}
                      className={`text-left p-3 rounded-xl border transition ${profile.tone === t.id ? "border-[#8B5CF6] bg-[#8B5CF6]/10" : "border-[#2A2B2F] bg-[#1F2023] hover:border-[#3A3B3F]"}`}>
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
                    <button key={l} onClick={() => save({ response_length: l })}
                      className={`flex-1 px-3 py-2 rounded-xl text-sm border transition capitalize ${profile.response_length === l ? "border-[#8B5CF6] bg-[#8B5CF6]/10" : "border-[#2A2B2F] bg-[#1F2023] hover:border-[#3A3B3F]"}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
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
