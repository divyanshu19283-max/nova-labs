import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, Braces, Database, Gauge, Network, Orbit, ShieldCheck, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/lib/seo";
import coreVisual from "@/assets/tenure-ai-core.jpg";

export const Route = createFileRoute("/")({
  head: () => pageMeta("AI systems engineered for impact", "TENURE AI designs and builds advanced AI automation, agents, digital products, and data infrastructure."),
  component: Index,
});

const capabilities = [
  [Workflow, "AI Automation", "Operational systems that remove repetition and increase throughput."],
  [Bot, "AI Agents", "Grounded, observable agents built for consequential work."],
  [Braces, "Product Engineering", "High-performance applications from strategy to production."],
  [Database, "Data & APIs", "Connected foundations that make intelligence usable everywhere."],
  [Network, "SaaS Platforms", "Secure, scalable products with clear operating logic."],
  [Gauge, "Modernization", "Legacy systems rebuilt for speed, clarity, and intelligence."],
] as const;

function Index() {
  return <div className="overflow-hidden">
    <section className="relative min-h-[calc(100vh-72px)] border-b border-border">
      <img src={coreVisual} width={1536} height={1024} alt="Luminous AI network architecture" className="absolute inset-0 size-full object-cover object-[66%_center] opacity-70" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_4%,color-mix(in_oklab,var(--background)_92%,transparent)_44%,color-mix(in_oklab,var(--background)_26%,transparent)_100%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center px-5 py-20 lg:px-8">
        <div className="max-w-4xl animate-fade-in">
          <div className="mb-7 flex items-center gap-3 font-mono text-[11px] uppercase text-accent"><span className="size-2 animate-pulse bg-accent cyan-glow"/>AI engineering studio <span className="h-px w-16 bg-accent/50"/></div>
          <h1 className="max-w-4xl text-6xl font-semibold leading-[.92] sm:text-7xl lg:text-8xl xl:text-9xl">Intelligence,<br/><span className="text-accent">engineered.</span></h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">We design and build AI systems that transform complex operations into durable competitive advantage.</p>
          <div className="mt-9 flex flex-wrap gap-3"><Button size="lg" asChild><Link to="/contact">Initiate a project <ArrowRight/></Link></Button><Button size="lg" variant="outline" asChild><Link to="/services">Explore capabilities</Link></Button></div>
          <div className="mt-14 grid max-w-2xl grid-cols-3 border-y border-border py-5 font-mono text-[10px] uppercase text-muted-foreground"><span>Strategy_01</span><span>Systems_02</span><span>Scale_03</span></div>
        </div>
      </div>
      <div className="absolute bottom-8 right-8 hidden items-center gap-3 font-mono text-[10px] uppercase text-accent lg:flex"><Orbit className="size-4 animate-spin [animation-duration:8s]"/> Core online / 2026</div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
      <div className="mb-14 grid gap-8 md:grid-cols-[.8fr_1.2fr]"><p className="font-mono text-xs uppercase text-accent">[ Capabilities ]</p><div><h2 className="text-4xl font-semibold leading-tight sm:text-6xl">From hard problems to<br/><span className="text-muted-foreground">production systems.</span></h2><p className="mt-6 max-w-xl leading-7 text-muted-foreground">One senior team connects intelligence, product, data, and engineering—without the handoff tax.</p></div></div>
      <div className="grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-3">{capabilities.map(([Icon,title,text],i)=><Link key={title} to="/services" className="group min-h-64 border-b border-r border-border bg-card/35 p-6 transition-all duration-300 hover:bg-cyan-soft"><div className="flex items-center justify-between"><span className="font-mono text-[10px] text-muted-foreground">SYS_0{i+1}</span><ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent"/></div><Icon className="mt-12 size-7 text-accent"/><h3 className="mt-5 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p></Link>)}</div>
    </section>

    <section className="border-y border-border bg-secondary/50"><div className="mx-auto grid max-w-7xl gap-16 px-5 py-24 lg:grid-cols-[.8fr_1.2fr] lg:px-8 lg:py-32"><div><p className="font-mono text-xs uppercase text-accent">[ Operating model ]</p><h2 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">Precision at every layer.</h2><div className="mt-8 flex items-center gap-3 text-xs text-muted-foreground"><ShieldCheck className="size-5 text-accent"/> Security and governance by design</div></div><div className="divide-y divide-border border-y border-border">{[["01","Find the leverage","Map the critical workflow, decision, or customer moment."],["02","Prove the system","Make value and technical feasibility tangible in a focused first phase."],["03","Engineer for tenure","Build for real users, safe operations, and confident ownership."]].map(([n,t,d])=><div key={n} className="grid gap-4 py-7 sm:grid-cols-[3rem_1fr_1.3fr]"><span className="font-mono text-xs text-accent">{n}</span><h3 className="font-semibold">{t}</h3><p className="text-sm leading-6 text-muted-foreground">{d}</p></div>)}</div></div></section>
  </div>;
}