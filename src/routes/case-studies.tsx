import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/case-studies")({
  head: () => pageMeta("Selected work", "Explore the kinds of AI and software outcomes TENURE AI creates."),
  component: () => (
    <div><section className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><p className="text-xs font-bold uppercase text-accent">Selected work</p><h1 className="mt-5 max-w-4xl font-display text-6xl font-semibold leading-none">Proof matters more than promises.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">We’re documenting current engagements with care. Published case studies will appear here when the work and client approvals are ready.</p></section><section className="border-y border-border bg-secondary"><div className="mx-auto max-w-7xl px-5 py-20 text-center lg:px-8"><p className="text-xs font-bold uppercase text-accent">In the meantime</p><h2 className="mt-4 font-display text-4xl font-semibold">Bring us a stubborn operational problem.</h2><p className="mx-auto mt-4 max-w-xl text-muted-foreground">We can share a relevant approach and outline what a focused first phase could prove.</p><Button className="mt-7" asChild><Link to="/contact">Start a Project</Link></Button></div></section></div>
  ),
});
