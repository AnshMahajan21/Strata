import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthProvider";

export function Login() {
  const { user, authEnabled, signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  if (user) return <Navigate to="/watchlist" replace />;

  const submit = async () => {
    setBusy(true);
    setError(null);
    const fn = mode === "signin" ? signInWithEmail : signUpWithEmail;
    const { error } = await fn(email, password);
    setBusy(false);
    if (error) return setError(error);
    if (mode === "signup") return setSent(true);
    navigate("/watchlist");
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-md py-10">
        <p className="eyebrow mb-3">Account</p>
        <h1 className="mb-2 font-serif text-5xl tracking-tight">
          {mode === "signin" ? "Welcome back" : "Create account"}
        </h1>
        <p className="mb-8 text-haze">
          Sign in to sync your watchlist across devices.
        </p>

        <Card className="p-6">
          {!authEnabled ? (
            <p className="text-sm text-haze">
              Authentication isn’t configured in this deployment. Add your
              Supabase keys to <code className="text-chalk">.env</code> to enable
              accounts. You can still use the watchlist locally.
            </p>
          ) : sent ? (
            <p className="text-sm text-haze">
              Check your inbox to confirm <span className="text-chalk">{email}</span>,
              then sign in.
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="eyebrow mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus-ring w-full rounded-xl border border-line bg-ink-900/60 px-4 py-3 text-sm"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="eyebrow mb-1.5 block">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  className="focus-ring w-full rounded-xl border border-line bg-ink-900/60 px-4 py-3 text-sm"
                  placeholder="••••••••"
                />
              </div>
              {error && <p className="text-sm text-loss">{error}</p>}
              <Button onClick={submit} disabled={busy} className="w-full">
                {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
              </Button>
              <button
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  setError(null);
                }}
                className="w-full text-sm text-fog hover:text-chalk"
              >
                {mode === "signin"
                  ? "Need an account? Sign up"
                  : "Have an account? Sign in"}
              </button>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
