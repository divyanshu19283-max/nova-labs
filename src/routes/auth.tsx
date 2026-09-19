import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/auth")({ head: () => pageMeta("Sign in", "Access your TENURE AI client workspace."), component: AuthPage });

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMessage("");
    const fd = new FormData(e.currentTarget); const email = String(fd.get("email") ?? "").trim(); const password = String(fd.get("password") ?? "");
    try {
      if (mode === "register") {
        const displayName = String(fd.get("name") ?? "").trim().replace(/[<>]/g, "").slice(0, 80);
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName } } });
        if (error) throw error; setMessage("Account created. Check your email to confirm your address.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error;
        await navigate({ to: "/dashboard" });
      }
    } catch (error) { setMessage(error instanceof Error ? error.message : "We couldn't complete that request."); } finally { setBusy(false); }
  }
  async function google() { setBusy(true); const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin }); if (result.error) { setMessage(result.error.message); setBusy(false); } }
  return <section className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-stretch md:grid-cols-2">
    <div className="scan-grid hidden border-r border-border bg-secondary/60 p-12 md:flex md:flex-col md:justify-between"><p className="font-mono text-xs uppercase text-accent">[ Client workspace ]</p><h1 className="text-6xl font-semibold">One place for the work in motion.</h1><p className="max-w-sm text-sm leading-6 text-muted-foreground">Projects, deliverables, support, and invoices—kept clear from kickoff to launch.</p></div>
    <div className="flex items-center px-5 py-16 sm:px-12"><div className="mx-auto w-full max-w-md"><p className="font-mono text-xs uppercase text-accent">{mode === "login" ? "[ Welcome back ]" : "[ Create your account ]"}</p><h2 className="mt-4 text-5xl font-semibold">{mode === "login" ? "Sign in" : "Join TENURE"}</h2>
      <Button variant="outline" className="mt-8 w-full" onClick={google} disabled={busy}>Continue with Google</Button><div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border"/>or use email<span className="h-px flex-1 bg-border"/></div>
      <form onSubmit={submit} className="space-y-4">{mode === "register" && <div><Label htmlFor="name">Full name</Label><Input id="name" name="name" required minLength={2} maxLength={80} className="mt-2 h-11" autoComplete="name"/></div>}<div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required maxLength={160} className="mt-2 h-11" autoComplete="email"/></div><div><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" required minLength={8} maxLength={72} className="mt-2 h-11" autoComplete={mode === "login" ? "current-password" : "new-password"}/></div><Button className="w-full" size="lg" disabled={busy}>{busy && <Loader2 className="animate-spin"/>}{mode === "login" ? "Sign in" : "Create account"}</Button></form>
      {message && <p className="mt-4 rounded-md bg-muted p-3 text-sm" role="status">{message}</p>}<p className="mt-6 text-sm text-muted-foreground">{mode === "login" ? "New here?" : "Already registered?"} <button className="font-semibold text-foreground underline underline-offset-4" onClick={() => { setMode(mode === "login" ? "register" : "login"); setMessage(""); }}>{mode === "login" ? "Create an account" : "Sign in"}</button></p><Link to="/" className="mt-8 inline-block text-sm text-muted-foreground">← Back to the site</Link></div></div>
  </section>;
}