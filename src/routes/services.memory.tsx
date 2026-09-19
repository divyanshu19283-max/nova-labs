import { createFileRoute } from "@tanstack/react-router";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/services/memory")({
  head:()=>pageMeta("AI Automation & Agents","AI workflows and agents designed for reliable production use."),
  component: () => (
    <Service title="AI Automation & Agents" intro="Move repetitive work out of the way and put intelligence where it improves a real decision." items={["Workflow and opportunity mapping","Knowledge-grounded AI agents","Human approval and escalation paths","Evaluation, monitoring, and guardrails"]}/>
  ),
});
function Service({title,intro,items}:{title:string;intro:string;items:string[]}){return <div><p className="text-xs font-bold uppercase text-accent">Service</p><h1 className="mt-5 max-w-4xl font-display text-6xl font-semibold leading-none">{title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{intro}</p><div className="mt-16 grid border-l border-t border-border sm:grid-cols-2">{items.map((item,i)=><div key={item} className="border-b border-r border-border p-6"><span className="text-xs text-accent">0{i+1}</span><h2 className="mt-8 text-xl font-bold">{item}</h2></div>)}</div></div>}
