import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const links = [["/services", "Services"], ["/case-studies", "Work"], ["/about", "About"], ["/contact", "Contact"]] as const;

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isWorkspace = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session)));
    return () => data.subscription.unsubscribe();
  }, []);
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8" aria-label="Primary navigation">
          <Link to="/" className="text-base font-extrabold text-foreground">TENURE <span className="text-accent">AI</span></Link>
          <div className="hidden items-center gap-7 md:flex">
            {links.map(([to, label]) => <Link key={to} to={to} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{label}</Link>)}
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" asChild><Link to={signedIn ? "/dashboard" : "/auth"}>{signedIn ? "Workspace" : "Sign in"}</Link></Button>
            <Button asChild><Link to="/contact">Start a Project <ArrowUpRight /></Link></Button>
          </div>
          <Button variant="ghost" size="icon" className="min-h-11 min-w-11 md:hidden" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
        </nav>
        {open && <div className="border-t border-border bg-background px-5 py-5 md:hidden">{links.map(([to, label]) => <Link key={to} to={to} onClick={() => setOpen(false)} className="block border-b border-border py-3 text-lg">{label}</Link>)}<Link to={signedIn ? "/dashboard" : "/auth"} onClick={() => setOpen(false)} className="block py-3 text-lg">{signedIn ? "Workspace" : "Sign in"}</Link><Button className="mt-3 w-full" asChild><Link to="/contact">Start a Project</Link></Button></div>}
      </header>
      <main>{children}</main>
      {!isWorkspace && <footer className="border-t border-border bg-primary text-primary-foreground"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8"><div><p className="font-display text-3xl">Useful systems.<br/>Built to endure.</p></div><div><p className="mb-3 text-xs font-bold uppercase text-primary-foreground/60">Explore</p>{links.map(([to,label]) => <Link key={to} to={to} className="mb-2 block text-sm">{label}</Link>)}</div><div><p className="mb-3 text-xs font-bold uppercase text-primary-foreground/60">TENURE AI</p><p className="text-sm text-primary-foreground/70">AI and software systems for ambitious teams.</p></div></div><div className="border-t border-primary-foreground/15 px-5 py-5 text-center text-xs text-primary-foreground/60">© 2026 TENURE AI</div></footer>}
    </>
  );
}