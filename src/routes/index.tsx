import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Braces, Bot, Workflow, PanelsTopLeft, Database, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/lib/seo";
import studio from "@/assets/tenure-studio.jpg";

export const Route = createFileRoute("/")({
  head: () => pageMeta("AI + software agency", "TENURE AI designs and builds AI automation, agents, SaaS platforms, APIs, and dashboards."),
  component: Index,
});

function Index() {
  return (
    <div>
      <section className="paper-grain border-b border-border"><div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-10 px-5 py-14 md:grid-cols-[1.08fr_.92fr] lg:px-8">
        <div className="relative z-10"><p className="mb-5 text-xs font-bold uppercase text-accent">AI + Software Studio</p><h1 className="max-w-3xl font-display text-6xl leading-[.9] font-semibold sm:text-7xl lg:text-8xl">Intelligence,<br/><em className="font-medium text-accent">made useful.</em></h1><p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">We design and build AI systems and digital products that remove friction, sharpen decisions, and create durable advantage.</p><div className="mt-8 flex flex-wrap gap-3"><Button size="lg" asChild><Link to="/contact">Start a Project <ArrowRight/></Link></Button><Button size="lg" variant="outline" asChild><Link to="/case-studies">See Our Work</Link></Button></div></div>
        <div className="relative h-[46vh] min-h-96 overflow-hidden rounded-md md:h-[72vh]"><img src={studio} alt="A warm, considered studio workspace" className="size-full object-cover"/><div className="absolute bottom-0 left-0 bg-background px-4 py-3 text-xs font-semibold uppercase">Strategy · Design · Engineering</div></div>
      </div></section>
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><div className="mb-14 grid gap-5 md:grid-cols-2"><h2 className="font-display text-5xl font-semibold">Six capabilities.<br/>One accountable team.</h2><p className="max-w-lg text-muted-foreground md:justify-self-end">From operating model to production code, we connect strategy, experience, data, and engineering.</p></div><div className="grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-3">{[[Workflow,"AI Automation"],[Bot,"AI Agents"],[Braces,"Full-Stack Development"],[Database,"SaaS & APIs"],[PanelsTopLeft,"Dashboards"],[Gauge,"Product Modernization"]].map(([Icon,title],i) => { const I=Icon as typeof Workflow; return <Link key={title as string} to="/services" className="group min-h-52 border-b border-r border-border p-6 transition-colors hover:bg-secondary"><span className="text-xs text-muted-foreground">0{i+1}</span><I className="mt-10 size-6 text-accent"/><h3 className="mt-4 text-2xl font-semibold">{title as string}</h3><ArrowRight className="mt-5 transition-transform group-hover:translate-x-1"/></Link>})}</div></section>
      <section className="bg-secondary"><div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-[.7fr_1.3fr] lg:px-8"><p className="text-xs font-bold uppercase text-accent">How we work</p><div><h2 className="font-display text-5xl font-semibold">Small senior teams.<br/>Clear business outcomes.</h2><div className="mt-10 divide-y divide-border">{[["01","Find the leverage","We begin with the workflow, decision, or customer moment that matters most."],["02","Prove the system","A focused first phase makes the value and technical path tangible."],["03","Build for tenure","We engineer for real users, safe operations, and confident ownership."]].map(([n,t,d])=><div key={n} className="grid gap-3 py-6 sm:grid-cols-[3rem_1fr_1.4fr]"><span className="text-sm text-accent">{n}</span><h3 className="text-lg font-bold">{t}</h3><p className="text-sm leading-6 text-muted-foreground">{d}</p></div>)}</div></div></div></section>
    </div>
  );
}
