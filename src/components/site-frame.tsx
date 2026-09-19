import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const links = [["/services", "Capabilities"], ["/case-studies", "Work"], ["/about", "Studio"], ["/contact", "Contact"]] as const;

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const [open,setOpen]=useState(false); const [signedIn,setSignedIn]=useState(false);
  const pathname=useRouterState({select:(s)=>s.location.pathname}); const isWorkspace=pathname.startsWith("/dashboard")||pathname.startsWith("/admin");
  useEffect(()=>{supabase.auth.getSession().then(({data})=>setSignedIn(Boolean(data.session)));const {data}=supabase.auth.onAuthStateChange((_event,session)=>setSignedIn(Boolean(session)));return()=>data.subscription.unsubscribe()},[]);
  return <>
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl"><nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8" aria-label="Primary navigation">
      <Link to="/" className="group flex items-center gap-3 font-bold"><span className="grid size-7 place-items-center border border-accent text-[10px] text-accent transition-shadow group-hover:cyan-glow">T</span><span>TENURE <span className="text-accent">AI</span></span></Link>
      <div className="hidden items-center gap-8 md:flex">{links.map(([to,label])=><Link key={to} to={to} activeProps={{className:"text-accent"}} className="font-mono text-[11px] uppercase text-muted-foreground transition-colors hover:text-foreground">{label}</Link>)}</div>
      <div className="hidden items-center gap-2 md:flex"><Button variant="ghost" asChild><Link to={signedIn?"/dashboard":"/auth"}>{signedIn?"Workspace":"Sign in"}</Link></Button><Button asChild><Link to="/contact">Start a project <ArrowUpRight/></Link></Button></div>
      <Button variant="ghost" size="icon" className="min-h-11 min-w-11 md:hidden" aria-label={open?"Close menu":"Open menu"} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</Button>
    </nav>{open&&<div className="border-t border-border bg-background px-5 py-5 md:hidden">{links.map(([to,label])=><Link key={to} to={to} onClick={()=>setOpen(false)} className="block border-b border-border py-4 font-mono text-sm uppercase">{label}</Link>)}<Link to={signedIn?"/dashboard":"/auth"} onClick={()=>setOpen(false)} className="block py-4 font-mono text-sm uppercase">{signedIn?"Workspace":"Sign in"}</Link><Button className="mt-3 w-full" asChild><Link to="/contact">Start a project</Link></Button></div>}</header>
    <main>{children}</main>
    {!isWorkspace&&<footer className="border-t border-border bg-background"><div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8"><div><div className="flex items-center gap-3 font-bold"><span className="grid size-7 place-items-center border border-accent text-[10px] text-accent">T</span>TENURE <span className="text-accent">AI</span></div><p className="mt-5 max-w-sm text-2xl font-semibold">Useful intelligence.<br/>Engineered to endure.</p></div><div><p className="mb-4 font-mono text-[10px] uppercase text-accent">Navigation</p>{links.map(([to,label])=><Link key={to} to={to} className="mb-3 block text-sm text-muted-foreground hover:text-foreground">{label}</Link>)}</div><div><p className="mb-4 font-mono text-[10px] uppercase text-accent">System</p><p className="text-sm leading-6 text-muted-foreground">AI and software systems for ambitious teams.</p><p className="mt-5 font-mono text-[10px] uppercase text-accent">● Available for select engagements</p></div></div><div className="border-t border-border px-5 py-5 text-center font-mono text-[10px] uppercase text-muted-foreground">© 2026 TENURE AI / All systems operational</div></footer>}
  </>;
}