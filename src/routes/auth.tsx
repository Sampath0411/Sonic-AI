import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  if (!loading && user) return <Navigate to="/chat" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/chat` },
        });
        if (err) throw err;
        if (data.user && data.user.identities?.length === 0) {
          setError("This email is already registered. Try signing in instead.");
        } else {
          setError("Check your email for the confirmation link, then sign in.");
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) {
          if (err.message.includes("Email not confirmed")) {
            setError("Please verify your email before signing in. Check your inbox.");
          } else if (err.message.includes("Invalid login credentials")) {
            setError("Wrong email or password. Try again or create an account.");
          } else {
            setError(err.message);
          }
        } else {
          navigate({ to: "/chat" });
        }
      }
    } catch (err: any) {
      setError(err.message ?? "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1012] px-4 py-10">
      <div className="w-full max-w-xl rounded-3xl border border-[#2A2B2F] bg-[#1F2023] p-10 sm:p-12 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col items-center text-center mb-8">
          <Logo className="h-20 w-20 mb-4" />
          <h1 className="text-3xl font-semibold text-white tracking-tight">Sonic AI</h1>
          <p className="text-sm text-gray-400 mt-2">
            {mode === "signin" ? "Welcome back, sign in to continue" : "Create your account to get started"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl bg-[#2A2B2F] border border-[#3A3B3F] px-4 py-3.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#8B5CF6] transition"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} required minLength={6}
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl bg-[#2A2B2F] border border-[#3A3B3F] px-4 py-3.5 pr-12 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#8B5CF6] transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition p-1"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={busy}
            className="w-full rounded-xl bg-gradient-to-r from-[#1EAEDB] to-[#8B5CF6] px-4 py-3.5 text-sm font-medium text-white hover:opacity-90 transition disabled:opacity-50">
            {busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-[#8B5CF6] hover:underline">
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
