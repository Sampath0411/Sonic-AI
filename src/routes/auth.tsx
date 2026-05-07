import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { lovable } from "@/integrations/lovable";
import { Sparkles } from "lucide-react";

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

  const handleGoogle = async () => {
    setError(null);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/chat`,
      });
      if (result.error) setError(result.error.message ?? "Google sign-in failed");
    } catch (err: any) {
      setError(err?.message ?? "Google sign-in failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1012] px-4">
      <div className="w-full max-w-md rounded-3xl border border-[#2A2B2F] bg-[#1F2023] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#1EAEDB] to-[#8B5CF6] flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Aether AI</h1>
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

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#2A2B2F]" />
          <span className="text-xs text-gray-500">or</span>
          <div className="h-px flex-1 bg-[#2A2B2F]" />
        </div>

        <button onClick={handleGoogle}
          className="w-full rounded-xl bg-[#2A2B2F] border border-[#3A3B3F] px-4 py-3 text-sm font-medium text-white hover:bg-[#33343A] transition flex items-center justify-center gap-2">
          <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

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
