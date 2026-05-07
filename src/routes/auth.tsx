import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = React.useState<"signin" | "signup">("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  if (!loading && user) return <Navigate to="/chat" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/chat` },
        });
        if (err) throw err;
        navigate({ to: "/chat" });
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        navigate({ to: "/chat" });
      }
    } catch (err: any) {
      setError(err.message ?? "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1012] px-4">
      <div className="w-full max-w-md rounded-3xl border border-[#2A2B2F] bg-[#1F2023] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-2 mb-6">
          <Logo className="h-10 w-10" />
          <div>
            <h1 className="text-xl font-semibold text-white">Sonic AI</h1>
            <p className="text-xs text-gray-400">{mode === "signin" ? "Welcome back" : "Create your account"}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl bg-[#2A2B2F] border border-[#3A3B3F] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#8B5CF6] transition"
          />
          <input
            type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-xl bg-[#2A2B2F] border border-[#3A3B3F] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#8B5CF6] transition"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={busy}
            className="w-full rounded-xl bg-gradient-to-r from-[#1EAEDB] to-[#8B5CF6] px-4 py-3 text-sm font-medium text-white hover:opacity-90 transition disabled:opacity-50">
            {busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-[#8B5CF6] hover:underline">
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
